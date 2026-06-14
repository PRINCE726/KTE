"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Edit2, Trash2, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
//  À remplacer à la ligne 10 :
import { createClient } from "@/lib/supabase";

const supabase = createClient();
export default function EvenementsAdmin() {
  const [evenements, setEvenements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [editorDialog, setEditorDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isSaving, setIsSaving] = useState(false);

  // Form
  const [editId, setEditId] = useState<string | null>(null);
  const [titre, setTitre] = useState("");
  const [type, setType] = useState("autre");
  const [date, setDate] = useState("");
  const [lieu, setLieu] = useState("");
  const [description, setDescription] = useState("");
  const [statut, setStatut] = useState("upcoming");

  const fetchEvenements = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("evenements").select("*").order("date", { ascending: true });
    if (!error && data) setEvenements(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvenements();
  }, []);

  const openEditor = (event: any = null) => {
    if (event) {
      setEditId(event.id);
      setTitre(event.titre);
      setType(event.type);
      setDate(event.date ? event.date.slice(0, 16) : "");
      setLieu(event.lieu || "");
      setDescription(event.description || "");
      setStatut(event.statut);
    } else {
      setEditId(null);
      setTitre("");
      setType("autre");
      setDate("");
      setLieu("");
      setDescription("");
      setStatut("upcoming");
    }
    setEditorDialog(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      titre,
      type,
      date: date ? new Date(date).toISOString() : null,
      lieu,
      description,
      statut
    };

    if (editId) {
      const { error } = await supabase.from("evenements").update(payload).eq("id", editId);
      if (error) toast({ title: "Erreur de modification", variant: "error" });
      else {
        toast({ title: "Événement modifié", variant: "success" });
        setEditorDialog(false);
        fetchEvenements();
      }
    } else {
      const { error } = await supabase.from("evenements").insert([payload]);
      if (error) toast({ title: "Erreur de création", variant: "error" });
      else {
        toast({ title: "Événement créé", variant: "success" });
        setEditorDialog(false);
        fetchEvenements();
      }
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    const { error } = await supabase.from("evenements").delete().eq("id", deleteDialog.id);
    if (!error) {
      toast({ title: "Événement supprimé", variant: "success" });
      setEvenements(evenements.filter(e => e.id !== deleteDialog.id));
    }
    setDeleteDialog({ isOpen: false, id: null });
  };

  const getTypeStyle = (t: string) => {
    if (t === "gala") return "bg-[#D4AF37] border-[#D4AF37] text-[#080808]";
    if (t === "caravane") return "bg-[#1D9E75]/20 border border-[#1D9E75]/30 text-[#1D9E75]";
    if (t === "jpo") return "bg-blue-950/40 border border-blue-900/30 text-blue-400";
    return "bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] text-[#888888]";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#F5F5F5]">Événements</h1>
          <p className="text-sm text-[#888888] mt-1">Agenda et calendrier des activités KTE.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Nouvel événement
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-12 text-[#888888]">Chargement...</div>
        ) : evenements.length > 0 ? (
          evenements.map(evt => (
            <div key={evt.id} className="bg-[#161616] rounded-xl border border-[rgba(255,255,255,0.08)] p-4 flex flex-col sm:flex-row gap-4 items-center transition-all hover:bg-[#1E1E1E]">
              <div className="flex items-center justify-center shrink-0 w-16 h-16 rounded-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.08)]">
                <div className={`w-4 h-4 rounded-full ${evt.type === "gala" ? "bg-[#D4AF37]" : evt.type === "caravane" ? "bg-[#1D9E75]" : evt.type === "jpo" ? "bg-blue-500" : "bg-gray-500"}`}></div>
              </div>
              
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getTypeStyle(evt.type)}`}>
                    {evt.type}
                  </span>
                  <h3 className="font-bold text-[#F5F5F5] text-lg truncate">{evt.titre}</h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#888888] mb-2">
                  {evt.date && (
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3 text-[#555555]" />
                      {format(new Date(evt.date), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                    </span>
                  )}
                  {evt.lieu && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#555555]" />
                      {evt.lieu}
                    </span>
                  )}
                </div>
                {evt.description && <p className="text-sm text-[#888888] truncate">{evt.description}</p>}
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:ml-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                  evt.statut === "upcoming" ? "bg-blue-950/40 text-blue-400 border border-blue-900/30" :
                  evt.statut === "ongoing" ? "bg-[#1D9E75]/10 text-[#1D9E75]" :
                  "bg-[#1A1A1A] text-[#555555]"
                }`}>
                  {evt.statut === "upcoming" ? "À venir" : evt.statut === "ongoing" ? "En cours" : "Passé"}
                </span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEditor(evt)}
                    className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-md transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteDialog({ isOpen: true, id: evt.id })}
                    className="p-2 text-[#C4622D] hover:bg-[#C4622D]/10 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-[#161616] rounded-xl border border-dashed border-[rgba(255,255,255,0.08)]">
            <p className="text-[#888888] mb-4">Aucun événement trouvé.</p>
            <button 
              onClick={() => openEditor()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors cursor-pointer"
            >
              Planifier un événement
            </button>
          </div>
        )}
      </div>

      {/* EDITOR MODAL */}
      <Dialog open={editorDialog} onOpenChange={setEditorDialog}>
        <DialogContent className="bg-[#161616] text-[#F5F5F5] border-[rgba(255,255,255,0.1)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5]">{editId ? "Modifier l'événement" : "Nouvel événement"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Titre</label>
              <input type="text" required value={titre} onChange={e => setTitre(e.target.value)} className="w-full border border-[rgba(255,255,255,0.1)] bg-[#0F0F0F] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="Titre de l'événement" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="w-full border border-[rgba(255,255,255,0.1)] bg-[#0F0F0F] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]">
                  <option value="gala" className="bg-[#161616] text-[#F5F5F5]">Gala</option>
                  <option value="caravane" className="bg-[#161616] text-[#F5F5F5]">Caravane</option>
                  <option value="jpo" className="bg-[#161616] text-[#F5F5F5]">JPO</option>
                  <option value="autre" className="bg-[#161616] text-[#F5F5F5]">Autre</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Statut</label>
                <select value={statut} onChange={e => setStatut(e.target.value)} className="w-full border border-[rgba(255,255,255,0.1)] bg-[#0F0F0F] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]">
                  <option value="upcoming" className="bg-[#161616] text-[#F5F5F5]">À venir</option>
                  <option value="ongoing" className="bg-[#161616] text-[#F5F5F5]">En cours</option>
                  <option value="past" className="bg-[#161616] text-[#F5F5F5]">Passé</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Date et Heure</label>
                <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-[rgba(255,255,255,0.1)] bg-[#0F0F0F] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Lieu</label>
                <input type="text" value={lieu} onChange={e => setLieu(e.target.value)} className="w-full border border-[rgba(255,255,255,0.1)] bg-[#0F0F0F] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="Localisation" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border border-[rgba(255,255,255,0.1)] bg-[#0F0F0F] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] resize-none" placeholder="Détails de l'événement..." />
            </div>
            <DialogFooter className="mt-6">
              <DialogClose>
                <Button variant="outline" type="button" className="bg-transparent border-[rgba(255,255,255,0.15)] text-[#AAAAAA] hover:bg-[#1E1E1E] hover:text-[#F5F5F5]">Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving} className="bg-[#D4AF37] hover:bg-[#E8C84D] text-[#080808] font-bold cursor-pointer">
                {isSaving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={deleteDialog.isOpen} onOpenChange={(val) => !val && setDeleteDialog({ isOpen: false, id: null })}>
        <DialogContent className="bg-[#161616] text-[#F5F5F5] border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5]">Supprimer l'événement ?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-[#888888]">Cette action est irréversible.</div>
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
