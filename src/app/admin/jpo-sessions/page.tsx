"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Plus, Edit2, Trash2, Truck, Scale, Heart, GraduationCap, Settings, 
  X, UploadCloud, Calendar as CalendarIcon, MapPin, Image as ImageIcon 
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase";

// Instructions pour Supabase Storage:
// 1. Créez un bucket public nommé 'jpo-images' dans Supabase Storage.
// 2. Configurez les politiques RLS correspondantes.

const supabase = createClient();

interface JPOSession {
  id: string;
  domaine: string;
  date_heure: string;
  heure_texte: string | null;
  icone: string;
  image_url: string | null;
  description: string | null;
  lieu: string | null;
  actif: boolean;
  created_at?: string;
}

const ICON_MAP: Record<string, any> = {
  Truck: Truck,
  Scale: Scale,
  Heart: Heart,
  GraduationCap: GraduationCap,
  Settings: Settings,
};

export default function JPOSessionsAdmin() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<JPOSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialogs
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [domaine, setDomaine] = useState("");
  const [dateHeure, setDateHeure] = useState("");
  const [heureTexte, setHeureTexte] = useState("");
  const [icone, setIcone] = useState("GraduationCap");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [lieu, setLieu] = useState("");
  const [actif, setActif] = useState(true);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("jpo_sessions")
      .select("*")
      .order("date_heure", { ascending: true });

    if (!error && data) {
      setSessions(data as JPOSession[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const openEditor = (session: JPOSession | null = null) => {
    if (session) {
      setEditId(session.id);
      setDomaine(session.domaine);
      setDateHeure(session.date_heure ? session.date_heure.slice(0, 16) : "");
      setHeureTexte(session.heure_texte || "");
      setIcone(session.icone || "GraduationCap");
      setImageUrl(session.image_url || "");
      setDescription(session.description || "");
      setLieu(session.lieu || "");
      setActif(session.actif);
    } else {
      setEditId(null);
      setDomaine("");
      setDateHeure("");
      setHeureTexte("");
      setIcone("GraduationCap");
      setImageUrl("");
      setDescription("");
      setLieu("");
      setActif(true);
    }
    setIsEditorOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      toast({ title: "L'image est trop lourde (3 Mo maximum)", variant: "error" });
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-jpo.${fileExt}`;
    const filePath = `${fileName}`;

    toast({ title: "Téléchargement de l'image de présentation..." });

    const { error: uploadError } = await supabase.storage
      .from('jpo-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      toast({ title: `Erreur d'upload : ${uploadError.message}`, variant: "error" });
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('jpo-images').getPublicUrl(filePath);
    setImageUrl(publicUrl);
    toast({ title: "Image téléversée avec succès !", variant: "success" as any });
    setIsUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domaine.trim() || !dateHeure) {
      toast({ title: "Le domaine et la date/heure sont requis", variant: "error" });
      return;
    }

    setIsSaving(true);
    const payload = {
      domaine: domaine.trim(),
      date_heure: new Date(dateHeure).toISOString(),
      heure_texte: heureTexte.trim() || null,
      icone,
      image_url: imageUrl || null,
      description: description.trim() || null,
      lieu: lieu.trim() || null,
      actif
    };

    if (editId) {
      const { error } = await supabase
        .from("jpo_sessions")
        .update(payload)
        .eq("id", editId);

      if (error) {
        toast({ title: "Erreur lors de la modification", variant: "error" });
      } else {
        toast({ title: "Session JPO modifiée !", variant: "success" as any });
        setIsEditorOpen(false);
        fetchSessions();
      }
    } else {
      const { error } = await supabase
        .from("jpo_sessions")
        .insert([payload]);

      if (error) {
        toast({ title: "Erreur lors de la création", variant: "error" });
      } else {
        toast({ title: "Session JPO créée !", variant: "success" as any });
        setIsEditorOpen(false);
        fetchSessions();
      }
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    const { error } = await supabase
      .from("jpo_sessions")
      .delete()
      .eq("id", deleteDialog.id);

    if (error) {
      toast({ title: "Erreur lors de la suppression", variant: "error" });
    } else {
      toast({ title: "Session supprimée !", variant: "success" as any });
      setSessions(sessions.filter(s => s.id !== deleteDialog.id));
    }
    setDeleteDialog({ isOpen: false, id: null });
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = ICON_MAP[iconName] || GraduationCap;
    return <IconComponent className="w-6 h-6 text-[#C9A84C]" />;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#F5F5F5]">JPO Sessions</h1>
          <p className="text-sm text-[#888888] mt-1">Sessions de présentations affichées sur la landing page.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Ajouter une session
        </button>
      </div>

      {/* Stacked Cards */}
      {isLoading ? (
        <div className="text-center py-12 text-[#888888]">Chargement des sessions...</div>
      ) : sessions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => {
            const formattedDate = session.date_heure 
              ? format(new Date(session.date_heure), "dd MMMM yyyy", { locale: fr })
              : "-";

            return (
              <div 
                key={session.id} 
                className="bg-[#161616] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  {/* Left Icon */}
                  <div className="w-[48px] h-[48px] rounded-lg bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center shrink-0">
                    {renderIcon(session.icone)}
                  </div>

                  {/* Center info */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-sans font-bold text-[#C9A84C] uppercase tracking-wider">
                        {formattedDate} {session.heure_texte ? `• ${session.heure_texte}` : ""}
                      </span>
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        session.actif ? "bg-[#1D9E75]/12 text-[#1D9E75]" : "bg-[rgba(255,255,255,0.05)] text-[#555555]"
                      }`}>
                        {session.actif ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    <h2 className="font-sans font-bold text-xl text-[#F5F5F5] truncate">{session.domaine}</h2>
                    {session.lieu && (
                      <p className="text-xs font-sans font-light text-[#666666] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#444444]" />
                        <span>{session.lieu}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right buttons */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditor(session)}
                    className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-md transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteDialog({ isOpen: true, id: session.id })}
                    className="p-2 text-[#C4622D] hover:bg-[#C4622D]/10 rounded-md transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#161616] rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] text-[#888888]">
          Aucune session planifiée. Cliquez sur le bouton en haut à droite pour en ajouter une.
        </div>
      )}

      {/* Editor Modal */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="bg-[#161616] text-[#F5F5F5] border-[rgba(255,255,255,0.1)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5]">{editId ? "Modifier la session JPO" : "Ajouter une session JPO"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-4 max-h-[75vh] overflow-y-auto pr-2">
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Domaine d'orientation *</label>
              <input 
                type="text" 
                required 
                value={domaine} 
                onChange={e => setDomaine(e.target.value)} 
                className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" 
                placeholder="Ex: Droit & Sciences Politiques..." 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Date & Heure *</label>
                <input 
                  type="datetime-local" 
                  required
                  value={dateHeure} 
                  onChange={e => setDateHeure(e.target.value)} 
                  className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Heure affichée (texte)</label>
                <input 
                  type="text" 
                  value={heureTexte} 
                  onChange={e => setHeureTexte(e.target.value)} 
                  className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" 
                  placeholder="Ex: De 9h00 à 12h00" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Icône</label>
                <select 
                  value={icone} 
                  onChange={e => setIcone(e.target.value)}
                  className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value="GraduationCap" className="bg-[#161616] text-[#F5F5F5]">Éducation (Chapeau)</option>
                  <option value="Truck" className="bg-[#161616] text-[#F5F5F5]">Logistique / Transit (Camion)</option>
                  <option value="Scale" className="bg-[#161616] text-[#F5F5F5]">Droit / Justice (Balance)</option>
                  <option value="Heart" className="bg-[#161616] text-[#F5F5F5]">Santé / Social (Cœur)</option>
                  <option value="Settings" className="bg-[#161616] text-[#F5F5F5]">Tech / Industrie (Engrenage)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Lieu</label>
                <input 
                  type="text" 
                  value={lieu} 
                  onChange={e => setLieu(e.target.value)} 
                  className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" 
                  placeholder="Ex: Siège KTE, Pointe-Noire" 
                />
              </div>
            </div>

            {/* Presentation Image */}
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-2 block">Image de présentation (optionnelle)</label>
              
              {imageUrl ? (
                <div className="relative group rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] w-full h-32 bg-[#0F0F0F] flex items-center justify-center p-2">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                  <button 
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 text-white rounded hover:bg-black transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[#C9A84C] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1E1E1E] transition-colors text-center group">
                  <UploadCloud className="h-8 w-8 text-[#555555] mb-2 group-hover:text-[#D4AF37] transition-colors" />
                  <span className="text-xs font-semibold text-[#888888]">
                    {isUploading ? "Chargement..." : "Glisser ou cliquer pour téléverser (JPG, PNG, WebP)"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={3}
                className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] resize-none" 
                placeholder="Détails sur la session, intervenants..." 
              />
            </div>

            <div className="flex flex-col">
              <label className="flex items-center gap-2 cursor-pointer text-sm py-2">
                <input 
                  type="checkbox" 
                  checked={actif} 
                  onChange={e => setActif(e.target.checked)} 
                  className="rounded bg-[#0F0F0F] border-[rgba(255,255,255,0.1)] text-[#C9A84C] focus:ring-[#C9A84C]" 
                />
                <span className="text-sm font-medium text-[#F5F5F5]">Actif (visible sur le site)</span>
              </label>
            </div>

            <DialogFooter className="mt-6">
              <DialogClose>
                <Button variant="outline" type="button" className="bg-transparent border-[rgba(255,255,255,0.15)] text-[#AAAAAA] hover:bg-[#1E1E1E] hover:text-[#F5F5F5]">Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving || isUploading} className="bg-[#D4AF37] hover:bg-[#E8C84D] text-[#080808] font-bold cursor-pointer">
                {isSaving ? "Sauvegarde..." : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(val) => !val && setDeleteDialog({ isOpen: false, id: null })}>
        <DialogContent className="bg-[#161616] text-[#F5F5F5] border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5]">Supprimer cette session ?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-[#888888]">Cette action supprimera définitivement la session JPO ainsi que toutes les liaisons.</div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline" className="bg-transparent border-[rgba(255,255,255,0.15)] text-[#AAAAAA] hover:bg-[#1E1E1E] hover:text-[#F5F5F5]">Annuler</Button>
            </DialogClose>
            <Button onClick={handleDelete} className="bg-[#C4622D] hover:bg-red-700 text-white cursor-pointer">Oui, supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
