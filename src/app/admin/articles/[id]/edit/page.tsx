"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { Image as ImageIcon, ArrowLeft, Save, Rocket, Bold, Italic, Heading1, Heading2, List, ListOrdered, Link as LinkIcon, Minus } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/toast";

// Initialisation du client Supabase
const supabase = createClient();

export default function ArticleEditor() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const isEditing = !!params?.id && params.id !== "new";
  const articleId = isEditing ? (params.id as string) : null;

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [titre, setTitre] = useState("");
  const [slug, setSlug] = useState("");
  const [categorie, setCategorie] = useState("Gala");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] text-[#F5F0E8] bg-[#0F0F0F] p-4 rounded-lg",
      },
    },
  });

  useEffect(() => {
    if (isEditing && articleId) {
      const fetchArticle = async () => {
        const { data, error } = await supabase.from("articles").select("*").eq("id", articleId).single();
        if (data && !error) {
          setTitre(data.titre);
          setSlug(data.slug);
          setCategorie(data.categorie);
          setExcerpt(data.excerpt || "");
          setImageUrl(data.image_url || "");
          setPublished(data.published);
          setDate(data.created_at ? data.created_at.split("T")[0] : new Date().toISOString().split("T")[0]);
          if (editor && (data.contenu || data.body)) {
            editor.commands.setContent(data.contenu || data.body);
          }
        }
        setIsLoading(false);
      };
      fetchArticle();
    }
  }, [isEditing, articleId, editor]);

  // Génération automatique du slug pendant que vous écrivez le titre
  useEffect(() => {
    if (!isEditing && titre) {
      const generatedSlug = titre
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  }, [titre, isEditing]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "L'image est trop lourde (5 Mo maximum)", variant: "error" });
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    toast({ title: "Téléchargement en cours...", variant: "default" });

    const { error: uploadError } = await supabase.storage
      .from('articles-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      toast({ title: `Erreur : ${uploadError.message}`, variant: "error" });
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('articles-images').getPublicUrl(filePath);
    setImageUrl(publicUrl);
    toast({ title: "Image téléchargée avec succès !" });
  };

  // FONCTION SÉCURISÉE SANS LES COLONNES FANTÔMES (REMOVED updated_at & co)
  const handleSave = async (willPublish: boolean) => {
    const titreNettoye = titre.trim();
    const slugNettoye = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    if (!titreNettoye || !slugNettoye) {
      toast({ title: "Le titre et le slug sont requis", variant: "error" });
      return;
    }

    setIsSaving(true);
    const body = editor?.getHTML() || "";

    // Uniquement vos 7 vraies colonnes Supabase
    const payload = {
      titre: titreNettoye,
      slug: slugNettoye,
      categorie,
      excerpt: excerpt.trim() || null, 
      image_url: imageUrl || null,     
      contenu: body,  // Utilise votre colonne 'contenu'
      body: body,     // Sécurité doublon pour votre colonne 'body'
      published: willPublish,
      created_at: new Date().toISOString(),
    };

    if (isEditing) {
      const { error } = await supabase.from("articles").update(payload).eq("id", articleId);
      if (error) {
        toast({ title: `Erreur de mise à jour : ${error.message}`, variant: "error" });
      } else {
        toast({ title: "Article mis à jour avec succès !" });
        setPublished(willPublish);
      }
    } else {
      const { error } = await supabase.from("articles").insert([payload]);
      if (error) {
        if (error.code === '23505') {
          toast({ title: "Ce slug existe déjà (l'URL doit être unique)", variant: "error" });
        } else {
          toast({ title: `Erreur Supabase : ${error.message} (Code ${error.code})`, variant: "error" });
        }
      } else {
        toast({ title: "Article créé avec succès !" });
        router.push("/admin/articles");
      }
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="text-center py-12 text-[#888888]">Chargement...</div>;

  return (
    <div className="space-y-6 pb-20">
      <Link href="/admin/articles" className="inline-flex items-center text-sm text-[#888888] hover:text-[#F5F5F5] transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux articles
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT MAIN: Editor */}
        <div className="flex-1 space-y-6">
          <div className="bg-[#161616] p-6 rounded-xl border border-[rgba(255,255,255,0.08)]">
            <input
              type="text"
              placeholder="Titre de l'article..."
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="w-full text-3xl font-serif font-bold text-[#F5F5F5] placeholder-[#555555] focus:outline-none border-b border-transparent focus:border-[rgba(255,255,255,0.08)] bg-transparent pb-2 transition-colors"
            />
            <div className="mt-2 text-sm text-[#888888] flex items-center gap-2">
              URL: /actualites/
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded px-2 py-0.5 focus:outline-none focus:border-[#C9A84C] text-xs"
              />
            </div>
          </div>

          <div className="bg-[#161616] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
            {/* Editor Toolbar */}
            {editor && (
              <div className="bg-[#111111] border-b border-[rgba(255,255,255,0.08)] p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded hover:bg-[#1E1E1E] ${editor.isActive('bold') ? 'bg-[#1E1E1E] text-[#C9A84C]' : 'text-[#888888]'}`}><Bold className="h-4 w-4" /></button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded hover:bg-[#1E1E1E] ${editor.isActive('italic') ? 'bg-[#1E1E1E] text-[#C9A84C]' : 'text-[#888888]'}`}><Italic className="h-4 w-4" /></button>
                <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-1"></div>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded hover:bg-[#1E1E1E] ${editor.isActive('heading', { level: 1 }) ? 'bg-[#1E1E1E] text-[#C9A84C]' : 'text-[#888888]'}`}><Heading1 className="h-4 w-4" /></button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded hover:bg-[#1E1E1E] ${editor.isActive('heading', { level: 2 }) ? 'bg-[#1E1E1E] text-[#C9A84C]' : 'text-[#888888]'}`}><Heading2 className="h-4 w-4" /></button>
                <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-1"></div>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded hover:bg-[#1E1E1E] ${editor.isActive('bulletList') ? 'bg-[#1E1E1E] text-[#C9A84C]' : 'text-[#888888]'}`}><List className="h-4 w-4" /></button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded hover:bg-[#1E1E1E] ${editor.isActive('orderedList') ? 'bg-[#1E1E1E] text-[#C9A84C]' : 'text-[#888888]'}`}><ListOrdered className="h-4 w-4" /></button>
                <div className="w-px h-6 bg-[rgba(255,255,255,0.08)] mx-1"></div>
                <button onClick={() => {
                    const url = window.prompt('URL');
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                  }} className={`p-2 rounded hover:bg-[#1E1E1E] ${editor.isActive('link') ? 'bg-[#1E1E1E] text-[#C9A84C]' : 'text-[#888888]'}`}><LinkIcon className="h-4 w-4" /></button>
                <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-2 rounded hover:bg-[#1E1E1E] text-[#888888]"><Minus className="h-4 w-4" /></button>
              </div>
            )}
            
            {/* Editor Content */}
            <div className="p-6 bg-[#0F0F0F]">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Settings */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Publish Settings */}
          <div className="bg-[#161616] p-5 rounded-xl border border-[rgba(255,255,255,0.08)]">
            <h3 className="font-bold text-[#F5F5F5] mb-4 text-sm uppercase tracking-wider">Publication</h3>
            <div className="flex items-center gap-3 mb-6">
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${published ? "bg-[#1D9E75]/10 text-[#1D9E75]" : "bg-[#1A1A1A] text-[#555555]"}`}>
                Status: {published ? "Publié" : "Brouillon"}
              </span>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-2 bg-transparent border border-[rgba(255,255,255,0.15)] text-[#AAAAAA] hover:bg-[#1E1E1E] rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <Save className="h-4 w-4" /> Enregistrer brouillon
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors shadow-sm cursor-pointer"
              >
                <Rocket className="h-4 w-4" /> Publier maintenant
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-[#161616] p-5 rounded-xl border border-[rgba(255,255,255,0.08)]">
            <h3 className="font-bold text-[#F5F5F5] mb-3 text-sm uppercase tracking-wider">Catégorie</h3>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm bg-[#0F0F0F] text-[#F5F5F5] focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="Gala" className="bg-[#161616] text-[#F5F5F5]">Gala</option>
              <option value="Caravane" className="bg-[#161616] text-[#F5F5F5]">Caravane</option>
              <option value="JPO" className="bg-[#161616] text-[#F5F5F5]">JPO</option>
              <option value="Partenariat" className="bg-[#161616] text-[#F5F5F5]">Partenariat</option>
              <option value="Médias" className="bg-[#161616] text-[#F5F5F5]">Médias</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="bg-[#161616] p-5 rounded-xl border border-[rgba(255,255,255,0.08)]">
            <h3 className="font-bold text-[#F5F5F5] mb-3 text-sm uppercase tracking-wider">Image Principale</h3>
            {imageUrl ? (
              <div className="relative group rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)]">
                <img src={imageUrl} alt="Cover" className="w-full h-32 object-cover" />
                <button 
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[#C9A84C] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1E1E1E] transition-colors text-center group">
                <ImageIcon className="h-8 w-8 text-[#555555] mb-2 group-hover:text-[#D4AF37] transition-colors" />
                <span className="text-xs font-semibold text-[#888888]">Cliquez pour sélectionner</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>

          {/* Excerpt */}
          <div className="bg-[#161616] p-5 rounded-xl border border-[rgba(255,255,255,0.08)]">
            <h3 className="font-bold text-[#F5F5F5] mb-3 text-sm uppercase tracking-wider">Extrait</h3>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Court résumé affiché dans la liste..."
              className="w-full border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-sm bg-[#0F0F0F] text-[#F5F5F5] focus:outline-none focus:border-[#C9A84C] resize-none"
              maxLength={160}
            />
            <div className="text-[10px] text-right text-[#555555] mt-1">{excerpt.length}/160</div>
          </div>

        </div>
      </div>
    </div>
  );
}