"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, X, UploadCloud, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase";

// Instructions pour Supabase Storage:
// 1. Créez un bucket public nommé 'partenaires' dans Supabase Storage.
// 2. Configurez les politiques RLS pour autoriser SELECT (public) et INSERT/UPDATE/DELETE (service_role ou authentifié).

const supabase = createClient();

interface Partenaire {
  id: string;
  nom: string;
  logo_url: string | null;
  ordre: number;
  actif: boolean;
  created_at?: string;
}

export default function PartenairesAdmin() {
  const { toast } = useToast();
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [editId, setEditId] = useState<string | null>(null);
  const [nom, setNom] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [ordre, setOrdre] = useState<number>(0);
  const [actif, setActif] = useState(true);

  const fetchPartenaires = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("partenaires")
      .select("*")
      .order("ordre", { ascending: true });
    
    if (!error && data) {
      setPartenaires(data as Partenaire[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPartenaires();
  }, [fetchPartenaires]);

  const openEditor = (partner: Partenaire | null = null) => {
    if (partner) {
      setEditId(partner.id);
      setNom(partner.nom);
      setLogoUrl(partner.logo_url || "");
      setOrdre(partner.ordre);
      setActif(partner.actif);
    } else {
      setEditId(null);
      setNom("");
      setLogoUrl("");
      setOrdre(partenaires.length > 0 ? Math.max(...partenaires.map(p => p.ordre)) + 10 : 0);
      setActif(true);
    }
    setIsEditorOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Le logo est trop lourd (2 Mo maximum)", variant: "error" });
      return;
    }

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-logo.${fileExt}`;
    const filePath = `${fileName}`;

    toast({ title: "Téléchargement du logo..." });

    const { error: uploadError } = await supabase.storage
      .from('partenaires')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      toast({ title: `Erreur d'upload : ${uploadError.message}`, variant: "error" });
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('partenaires').getPublicUrl(filePath);
    setLogoUrl(publicUrl);
    toast({ title: "Logo téléversé avec succès !", variant: "success" as any });
    setIsUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      toast({ title: "Le nom du partenaire est requis", variant: "error" });
      return;
    }

    setIsSaving(true);
    const payload = {
      nom: nom.trim(),
      logo_url: logoUrl || null,
      ordre: Number(ordre),
      actif
    };

    if (editId) {
      const { error } = await supabase
        .from("partenaires")
        .update(payload)
        .eq("id", editId);
      
      if (error) {
        toast({ title: "Erreur lors de la modification", variant: "error" });
      } else {
        toast({ title: "Partenaire mis à jour !", variant: "success" as any });
        setIsEditorOpen(false);
        fetchPartenaires();
      }
    } else {
      const { error } = await supabase
        .from("partenaires")
        .insert([payload]);

      if (error) {
        toast({ title: "Erreur lors de la création", variant: "error" });
      } else {
        toast({ title: "Partenaire ajouté !", variant: "success" as any });
        setIsEditorOpen(false);
        fetchPartenaires();
      }
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    const { error } = await supabase
      .from("partenaires")
      .delete()
      .eq("id", deleteDialog.id);

    if (error) {
      toast({ title: "Erreur lors de la suppression", variant: "error" });
    } else {
      toast({ title: "Partenaire supprimé !", variant: "success" as any });
      setPartenaires(partenaires.filter(p => p.id !== deleteDialog.id));
    }
    setDeleteDialog({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#F5F5F5]">Partenaires</h1>
          <p className="text-sm text-[#888888] mt-1">Logos affichés dans le carousel de la landing page.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Ajouter un partenaire
        </button>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="text-center py-12 text-[#888888]">Chargement des partenaires...</div>
      ) : partenaires.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {partenaires.map((partner) => (
            <div 
              key={partner.id} 
              className="bg-[#161616] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 flex flex-col gap-3 justify-between items-center text-center relative group"
            >
              {/* Logo wrapper */}
              <div className="w-[80px] h-[80px] bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                {partner.logo_url ? (
                  <img src={partner.logo_url} alt={partner.nom} className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-[#333333]" />
                )}
              </div>

              {/* Title & order */}
              <div className="space-y-1 w-full">
                <p className="font-sans font-bold text-[14px] text-[#F5F5F5] truncate">{partner.nom}</p>
                <p className="text-[11px] text-[#555555]">Ordre : {partner.ordre}</p>
              </div>

              {/* Status Badge & Actions */}
              <div className="flex flex-col gap-2 items-center w-full mt-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  partner.actif ? "bg-[#1D9E75]/12 text-[#1D9E75]" : "bg-[rgba(255,255,255,0.05)] text-[#555555]"
                }`}>
                  {partner.actif ? "Actif" : "Inactif"}
                </span>

                <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openEditor(partner)}
                    className="p-1 text-blue-400 hover:bg-blue-900/20 rounded transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setDeleteDialog({ isOpen: true, id: partner.id })}
                    className="p-1 text-[#C4622D] hover:bg-[#C4622D]/10 rounded transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#161616] rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] text-[#888888]">
          Aucun partenaire enregistré. Cliquez sur le bouton en haut à droite pour en ajouter.
        </div>
      )}

      {/* Editor Modal */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="bg-[#161616] text-[#F5F5F5] border-[rgba(255,255,255,0.1)] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5]">{editId ? "Modifier le partenaire" : "Ajouter un partenaire"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Nom du partenaire</label>
              <input 
                type="text" 
                required 
                value={nom} 
                onChange={e => setNom(e.target.value)} 
                className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" 
                placeholder="Ex: Orange, MTN..." 
              />
            </div>

            {/* Logo upload / preview */}
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-2 block">Logo</label>
              
              {logoUrl ? (
                <div className="relative group rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] w-[100px] h-[100px] bg-[#0F0F0F] flex items-center justify-center p-2">
                  <img src={logoUrl} alt="Preview" className="w-full h-full object-contain" />
                  <button 
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded hover:bg-black transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[#C9A84C] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1E1E1E] transition-colors text-center group">
                  <UploadCloud className="h-8 w-8 text-[#555555] mb-2 group-hover:text-[#D4AF37] transition-colors" />
                  <span className="text-xs font-semibold text-[#888888]">
                    {isUploading ? "Chargement..." : "Glisser ou cliquer pour téléverser"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Ordre d'affichage</label>
                <input 
                  type="number" 
                  value={ordre} 
                  onChange={e => setOrdre(Number(e.target.value))} 
                  className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" 
                />
              </div>

              <div className="flex flex-col justify-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm py-2">
                  <input 
                    type="checkbox" 
                    checked={actif} 
                    onChange={e => setActif(e.target.checked)} 
                    className="rounded bg-[#0F0F0F] border-[rgba(255,255,255,0.1)] text-[#C9A84C] focus:ring-[#C9A84C]" 
                  />
                  <span className="text-sm font-medium text-[#F5F5F5]">Actif</span>
                </label>
              </div>
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

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(val) => !val && setDeleteDialog({ isOpen: false, id: null })}>
        <DialogContent className="bg-[#161616] text-[#F5F5F5] border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5]">Supprimer ce partenaire ?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-[#888888]">Cette action supprimera définitivement le partenaire de la liste.</div>
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
