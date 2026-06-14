"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Download, MessageSquare, Eye } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
// CORRECTION 1 : Importation de l'initialisation de votre supabase.ts
import { createClient } from "@/lib/supabase";

// Initialisation de l'instance client Supabase
const supabase = createClient();

export default function CaravaneAdmin() {
  const [demandes, setDemandes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [msgDialog, setMsgDialog] = useState<{ isOpen: boolean; content: string | null }>({ isOpen: false, content: null });

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("demandes_caravane").select("*").order("created_at", { ascending: false });
    if (!error && data) setDemandes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, statut: string) => {
    const { error } = await supabase
      .from("demandes_caravane")
      .update({ statut })
      .eq("id", id);

    if (error) {
      toast({ title: "Erreur", variant: "error" });
    } else {
      toast({ title: "Statut mis à jour" });
      setDemandes(demandes.map(d => d.id === id ? { ...d, statut } : d));
    }
  };

  const handleExportCSV = () => {
    if (demandes.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,ID,Lycee,Arrondissement,Responsable,Telephone,NbEleves,Statut,Date\n";
    demandes.forEach(row => {
      // CORRECTION 2 : Nettoyage des antislashs parasites pour réparer le template string
      csvContent += `"${row.id}","${row.lycee}","${row.arrondissement || "-"}","${row.responsable}","${row.telephone}","${row.nb_eleves || 0}","${row.statut}","${row.created_at}"\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "export_caravane.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#F5F5F5]">Demandes Caravane</h1>
          <p className="text-sm text-[#888888] mt-1">{demandes.length} demandes d'établissements.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-[rgba(255,255,255,0.15)] text-[#AAAAAA] hover:bg-[#1E1E1E] hover:text-[#F5F5F5] rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="bg-[#161616] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#111111]">
            <TableRow>
              <TableHead className="w-12 text-center text-[#666666]">#</TableHead>
              <TableHead className="text-[#666666]">Lycée</TableHead>
              <TableHead className="text-[#666666]">Arrondissement</TableHead>
              <TableHead className="text-[#666666]">Responsable</TableHead>
              <TableHead className="text-[#666666]">Téléphone</TableHead>
              <TableHead className="text-[#666666]">Nb Élèves</TableHead>
              <TableHead className="text-[#666666]">Statut</TableHead>
              <TableHead className="text-[#666666]">Date</TableHead>
              <TableHead className="text-right text-[#666666]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-[#888888]">Chargement...</TableCell></TableRow>
            ) : demandes.length > 0 ? (
              demandes.map((row, idx) => (
                <TableRow key={row.id} className="hover:bg-[#1A1A1A]">
                  <TableCell className="text-center text-[#888888] text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-[#F5F5F5]">{row.lycee}</TableCell>
                  <TableCell className="text-sm text-[#888888]">{row.arrondissement || "-"}</TableCell>
                  <TableCell className="text-sm font-medium text-[#F5F5F5]">{row.responsable}</TableCell>
                  <TableCell className="text-sm font-mono text-[#F5F5F5]">{row.telephone}</TableCell>
                  <TableCell className="text-sm font-bold text-[#F5F5F5]">{row.nb_eleves || "-"}</TableCell>
                  <TableCell>
                    <select 
                      value={row.statut}
                      onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md min-w-[110px] cursor-pointer focus:outline-none ${
                        row.statut === "nouveau" ? "bg-blue-950/40 text-blue-400 border border-blue-900/30" :
                        row.statut === "en_traitement" ? "bg-orange-950/40 text-orange-400 border border-orange-900/30" :
                        "bg-[rgba(29,158,117,0.12)] text-[#1D9E75] border border-[rgba(29,158,117,0.2)]"
                      }`}
                    >
                      <option value="nouveau" className="bg-[#161616] text-[#F5F5F5]">Nouveau</option>
                      <option value="en_traitement" className="bg-[#161616] text-[#F5F5F5]">En traitement</option>
                      <option value="traite" className="bg-[#161616] text-[#F5F5F5]">Traité</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-xs text-[#888888]">
                    {row.created_at ? format(new Date(row.created_at), "dd MMM yy", { locale: fr }) : "-"}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    {row.message && (
                      <button 
                        onClick={() => setMsgDialog({ isOpen: true, content: row.message })}
                        className="p-1.5 text-gray-400 hover:bg-[#1E1E1E] rounded-md transition-colors"
                        title="Voir message"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <a 
                      href={`https://wa.me/${row.telephone.replace(/\s+/g, "")}?text=${encodeURIComponent(`Bonjour ${row.responsable}, suite à votre demande pour ${row.lycee}, l'équipe KTE vous contacte pour organiser la Caravane de l'Orientation. Quelles sont vos disponibilités ?`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#1D9E75] hover:bg-[#1D9E75]/10 rounded-md transition-colors"
                      title="WhatsApp"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-[#888888]">Aucun résultat.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={msgDialog.isOpen} onOpenChange={(val) => !val && setMsgDialog({ isOpen: false, content: null })}>
        <DialogContent className="bg-[#161616] text-[#F5F5F5] border-[rgba(255,255,255,0.1)]">
          <DialogHeader>
            <DialogTitle className="text-[#F5F5F5]">Message du lycée</DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-4 bg-[#0F0F0F] rounded-lg text-sm whitespace-pre-wrap leading-relaxed border border-[rgba(255,255,255,0.08)] text-[#888888]">
            {msgDialog.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
