"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createBrowserClient } from "@supabase/ssr";

interface GaleriesAdminClientProps {
  initialGaleries: any[];
}

export default function GaleriesAdminClient({ initialGaleries }: GaleriesAdminClientProps) {
  const [galeries, setGaleries] = useState<any[]>(initialGaleries);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  // Form states
  const [edition, setEdition] = useState("");
  const [titre, setTitre] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // Client Supabase optimisé pour le navigateur
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const refreshGaleries = async () => {
    const { data, error } = await supabase
      .from("galeries")
      .select("*, galerie_photos(count)")
      .order("created_at", { ascending: false });
    
    if (!error && data) setGaleries(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const { error } = await supabase.from("galeries").insert([{
      edition: parseInt(edition),
      titre,
      date: date || null,
      description,
      published: false
    }]);

    if (error) {
      toast({ title: "Erreur de création", variant: "error" });
    } else {
      toast({ title: "Galerie créée avec succès" });
      setCreateDialog(false);
      setEdition(""); setTitre(""); setDate(""); setDescription("");
      await refreshGaleries();
    }
    setIsCreating(false);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    
    const { error } = await supabase.from("galeries").delete().eq("id", deleteDialog.id);
    if (error) {
      toast({ title: "Erreur de suppression", variant: "error" });
    } else {
      toast({ title: "Galerie supprimée" });
      setGaleries(galeries.filter(g => g.id !== deleteDialog.id));
    }
    setDeleteDialog({ isOpen: false, id: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A]">Galeries Photos</h1>
          <p className="text-sm text-[#666666] mt-1">Gérez les albums photos de chaque édition du Gala.</p>
        </div>
        <button 
          onClick={() => setCreateDialog(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Nouvelle galerie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galeries.length > 0 ? (
          // CORRECTION 1 : Typage de galerie en explicit any
          galeries.map((galerie: any) => {
            const photoCount = galerie.galerie_photos?.[0]?.count || 0;
            return (
              <div key={galerie.id} className="bg-white rounded-xl shadow-sm border border-[#E5E3DD] overflow-hidden flex flex-col transition-shadow hover:shadow-md">
                <div className="aspect-video bg-gray-100 border-b border-[#E5E3DD] flex items-center justify-center relative">
                  {galerie.cover_url ? (
                    <img src={galerie.cover_url} alt={galerie.titre} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-[#AAAAAA]" />
                  )}
                  <span className={`absolute top-3 right-3 text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm ${
                    galerie.published ? "bg-[#1D9E75] text-white" : "bg-white text-gray-600 border border-gray-200"
                  }`}>
                    {galerie.published ? "Publié" : "Brouillon"}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-[#1A1A1A] text-lg mb-1 truncate">{galerie.titre}</h3>
                  <p className="text-xs text-[#666666] mb-4">
                    Édition {galerie.edition} • {photoCount} photo{photoCount !== 1 && 's'}
                  </p>
                  
                  <div className="mt-auto flex flex-col gap-2">
                    <Link 
                      href={`/admin/galeries/${galerie.id}`}
                      className="w-full text-center py-2 bg-[#F8F7F4] border border-[#E5E3DD] text-[#1A1A1A] rounded-lg text-sm font-bold hover:bg-[#E5E3DD] transition-colors"
                    >
                      Gérer les photos
                    </Link>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg text-sm font-bold transition-colors">
                        Infos
                      </button>
                      <button 
                        onClick={() => setDeleteDialog({ isOpen: true, id: galerie.id })}
                        className="py-2 px-3 text-[#C4622D] hover:bg-[#C4622D]/10 border border-red-100 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-[#E5E3DD]">
            <p className="text-[#666666] mb-4">Aucune galerie trouvée.</p>
            <button 
              onClick={() => setCreateDialog(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors"
            >
              Créer votre première galerie
            </button>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="bg-white text-[#1A1A1A] border-[#E5E3DD] max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle Galerie</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-1 block">Édition (numéro)</label>
              <input type="number" required value={edition} onChange={e => setEdition(e.target.value)} className="w-full border border-[#E5E3DD] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="Ex: 5" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-1 block">Titre</label>
              <input type="text" required value={titre} onChange={e => setTitre(e.target.value)} className="w-full border border-[#E5E3DD] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" placeholder="GDB Édition 5" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-1 block">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-[#E5E3DD] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-1 block">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-[#E5E3DD] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] resize-none" />
            </div>
            <DialogFooter className="mt-6">
              {/* CORRECTION 2 : Retrait du asChild sur DialogClose */}
              <DialogClose>
                <Button variant="outline" type="button">Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={isCreating} className="bg-[#D4AF37] hover:bg-[#E8C84D] text-[#080808] font-bold">
                {isCreating ? "Création..." : "Créer la galerie"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(val) => !val && setDeleteDialog({ isOpen: false, id: null })}>
        <DialogContent className="bg-white text-[#1A1A1A] border-[#E5E3DD]">
          <DialogHeader>
            <DialogTitle>Supprimer la galerie ?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-[#666666]">Toutes les photos associées seront également supprimées.</div>
          <DialogFooter>
            {/* CORRECTION 3 : Retrait du asChild sur DialogClose */}
            <DialogClose>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleDelete} className="bg-[#C4622D] hover:bg-red-700 text-white">Oui, supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}