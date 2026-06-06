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
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A]">Demandes Caravane</h1>
          <p className="text-sm text-[#666666] mt-1">{demandes.length} demandes d'établissements.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E3DD] rounded-lg text-sm font-semibold hover:bg-[#F8F7F4] transition-colors shadow-sm text-red"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E3DD] overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#F8F7F4]">
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Lycée</TableHead>
              <TableHead>Arrondissement</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Nb Élèves</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-[#666666]">Chargement...</TableCell></TableRow>
            ) : demandes.length > 0 ? (
              demandes.map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center text-[#666666] text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-[#1A1A1A] text-white">{row.lycee}</TableCell>
                  <TableCell className="text-sm text-[#666666]">{row.arrondissement || "-"}</TableCell>
                  <TableCell className="text-sm font-medium">{row.responsable}</TableCell>
                  <TableCell className="text-sm font-mono">{row.telephone}</TableCell>
                  <TableCell className="text-sm font-bold">{row.nb_eleves || "-"}</TableCell>
                  <TableCell>
                    <select 
                      value={row.statut}
                      onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md min-w-[110px] cursor-pointer focus:outline-none ${
                        row.statut === "nouveau" ? "bg-blue-100 text-blue-800" :
                        row.statut === "en_traitement" ? "bg-orange-100 text-orange-800" :
                        "bg-[#1D9E75]/10 text-[#1D9E75]"
                      }`}
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="en_traitement">En traitement</option>
                      <option value="traite">Traité</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-xs text-[#666666]">
                    {row.created_at ? format(new Date(row.created_at), "dd MMM yy", { locale: fr }) : "-"}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    {row.message && (
                      <button 
                        onClick={() => setMsgDialog({ isOpen: true, content: row.message })}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
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
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-[#666666]">Aucun résultat.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={msgDialog.isOpen} onOpenChange={(val) => !val && setMsgDialog({ isOpen: false, content: null })}>
        <DialogContent className="bg-white text-[#1A1A1A] border-[#E5E3DD]">
          <DialogHeader>
            <DialogTitle>Message du lycée</DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-4 bg-[#F8F7F4] rounded-lg text-sm whitespace-pre-wrap leading-relaxed border border-[#E5E3DD]">
            {msgDialog.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}