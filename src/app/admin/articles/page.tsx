"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
// CORRECTION 1 : Alignement avec la méthode d'initialisation de votre projet
import { createClient } from "@/lib/supabase";

// Initialisation du client Supabase
const supabase = createClient();

export default function ArticlesAdmin() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Tous");
  const { toast } = useToast();

  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const fetchArticles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    if (!error && data) setArticles(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    
    const { error } = await supabase.from("articles").delete().eq("id", deleteDialog.id);
    if (error) {
      // CORRECTION 2 : Variant standardisé pour shadcn toast
      toast({ title: "Erreur lors de la suppression", variant: "error" });
    } else {
      toast({ title: "Article supprimé" });
      setArticles(articles.filter(a => a.id !== deleteDialog.id));
    }
    setDeleteDialog({ isOpen: false, id: null });
  };

  const filteredArticles = articles.filter(article => {
    if (activeTab === "Tous") return true;
    if (activeTab === "Publiés") return article.published === true;
    if (activeTab === "Brouillons") return article.published === false;
    return article.categorie === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#F5F5F5]">Articles & Actualités</h1>
          <p className="text-sm text-[#888888] mt-1">Gerez le contenu du blog et les actualités.</p>
        </div>
        <Link 
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Nouvel article
        </Link>
      </div>

      <div className="flex border-b border-[rgba(255,255,255,0.08)] overflow-x-auto">
        {["Tous", "Publiés", "Brouillons", "Gala", "Caravane", "JPO", "Partenariat"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-bold capitalize whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === tab ? "border-[#D4AF37] text-[#C9A84C]" : "border-transparent text-[#888888] hover:text-[#F5F5F5]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-12 text-[#888888]">Chargement...</div>
        ) : filteredArticles.length > 0 ? (
          filteredArticles.map(article => (
            <div key={article.id} className="bg-[#161616] rounded-xl border border-[rgba(255,255,255,0.08)] p-4 flex flex-col sm:flex-row gap-4 items-center transition-all hover:bg-[#1E1E1E]">
              <div className="h-20 w-20 shrink-0 bg-[#0F0F0F] rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                {article.image_url ? (
                  <img src={article.image_url} alt={article.titre} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[#555555] text-xs font-bold uppercase">Image</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#F5F5F5] text-lg truncate mb-1">{article.titre}</h3>
                <div className="flex items-center gap-3 text-xs mb-2">
                  <span className="bg-[#1A1A1A] text-[#888888] border border-[rgba(255,255,255,0.08)] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                    {article.categorie}
                  </span>
                  <span className="text-[#555555]">
                    {article.created_at ? format(new Date(article.created_at), "dd MMM yyyy", { locale: fr }) : "-"}
                  </span>
                </div>
                <p className="text-sm text-[#888888] truncate">{article.excerpt || "Aucun extrait"}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:ml-4">
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                  article.published ? "bg-[#1D9E75]/10 text-[#1D9E75]" : "bg-[#1A1A1A] text-[#555555]"
                }`}>
                  {article.published ? "Publié" : "Brouillon"}
                </span>
                
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/articles/${article.id}/edit`}
                    className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-md transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Link>
                  <button 
                    onClick={() => setDeleteDialog({ isOpen: true, id: article.id })}
                    className="p-2 text-[#C4622D] hover:bg-[#C4622D]/10 rounded-md transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-[#161616] rounded-xl border border-dashed border-[rgba(255,255,255,0.08)]">
            <p className="text-[#888888] mb-4">Aucun article trouvé.</p>
            <Link 
              href="/admin/articles/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors"
            >
              Créer votre premier article
            </Link>
          </div>
        )}
      </div>

      <Dialog open={deleteDialog.isOpen} onOpenChange={(val) => !val && setDeleteDialog({ isOpen: false, id: null })}>
        <DialogContent className="bg-[#161616] text-[#F5F5F5] border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5]">Supprimer l'article ?</DialogTitle>
            <DialogDescription className="text-[#888888]">
              Cette action est irréversible. L'article sera définitivement supprimé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" className="bg-transparent border-[rgba(255,255,255,0.15)] text-[#AAAAAA] hover:bg-[#1E1E1E] hover:text-[#F5F5F5]">Annuler</Button>
            </DialogClose>
            <Button 
              onClick={handleDelete} 
              className="bg-[#C4622D] hover:bg-red-700 text-white"
            >
              Oui, supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
