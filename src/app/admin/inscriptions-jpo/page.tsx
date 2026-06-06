"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, Download, MessageSquare, Check, X } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
// CORRECTION 1 : Utilisation de la fonction d'initialisation de votre supabase.ts
import { createClient } from "@/lib/supabase";

// Initialisation de l'instance client Supabase
const supabase = createClient();

export default function JPOAdmin() {
  const [inscriptions, setInscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Tous");
  const { toast } = useToast();

  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; action: "confirme" | "annule" | null; id: string | null }>({
    isOpen: false, action: null, id: null
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("inscriptions_jpo").select("*").order("created_at", { ascending: false });
    if (!error && data) setInscriptions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async () => {
    if (!confirmDialog.id || !confirmDialog.action) return;
    
    const { error } = await supabase
      .from("inscriptions_jpo")
      .update({ statut: confirmDialog.action })
      .eq("id", confirmDialog.id);

    if (error) {
      toast({ title: "Erreur", variant: "error" });
    } else {
      toast({ title: "Statut mis à jour" });
      setInscriptions(inscriptions.map(inc => inc.id === confirmDialog.id ? { ...inc, statut: confirmDialog.action } : inc));
    }
    setConfirmDialog({ isOpen: false, action: null, id: null });
  };

  const handleExportCSV = () => {
    if (inscriptions.length === 0) return;
    const toExport = activeTab === "Tous" ? inscriptions : inscriptions.filter(i => i.pole === activeTab);
    
    let csvContent = "data:text/csv;charset=utf-8,ID,Nom,Email,Telephone,Pole,Session,Lycee,Classe,Statut,Date\n";
    toExport.forEach(row => {
      // CORRECTION 2 : Retrait des antislashs parasites devant les backticks pour réparer le template string
      csvContent += `"${row.id}","${row.nom}","${row.email}","${row.telephone}","${row.pole}","${row.session || "-"}","${row.lycee || "-"}","${row.classe || "-"}","${row.statut}","${row.created_at}"\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `export_jpo_${activeTab.toLowerCase()}.csv`;
    link.click();
  };

  const filteredInscriptions = inscriptions.filter(inc => {
    const matchesSearch = inc.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.telephone.includes(searchTerm);
    const matchesTab = activeTab === "Tous" || inc.pole === activeTab;
    return matchesSearch && matchesTab;
  });

  const getPoleColor = (pole: string) => {
    if (pole === "sante") return "bg-green-100 text-green-800 border-green-200";
    if (pole === "tech") return "bg-blue-100 text-blue-800 border-blue-200";
    if (pole === "arts") return "bg-purple-100 text-purple-800 border-purple-200";
    if (pole === "business") return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A]">Inscriptions JPO</h1>
          <p className="text-sm text-[#666666] mt-1">Gestion des inscriptions aux journées d'immersion.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E3DD] rounded-lg text-sm font-semibold hover:bg-[#F8F7F4] transition-colors shadow-sm"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E3DD] overflow-x-auto">
        {["Tous", "sante", "tech", "arts", "business"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-bold capitalize whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab ? "border-[#D4AF37] text-[#1A1A1A]" : "border-transparent text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            {tab === "Tous" ? "Tous" : `Pôle ${tab}`}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
        <input 
          type="text" 
          placeholder="Rechercher par nom ou téléphone..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E3DD] rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E3DD] overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#F8F7F4]">
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Pôle</TableHead>
              <TableHead>Lycée</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-[#666666]">Chargement...</TableCell></TableRow>
            ) : filteredInscriptions.length > 0 ? (
              filteredInscriptions.map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center text-[#666666] text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-[#1A1A1A] text-white">{row.nom}</TableCell>
                  <TableCell className="text-sm font-mono">{row.telephone}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPoleColor(row.pole)}`}>
                      {row.pole}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{row.lycee || "-"}</TableCell>
                  <TableCell className="text-sm">{row.classe || "-"}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md inline-block text-center min-w-[80px] ${
                      row.statut === "confirme" ? "bg-[#1D9E75]/10 text-[#1D9E75]" :
                      row.statut === "annule" ? "bg-[#C4622D]/10 text-[#C4622D]" :
                      "bg-[#D4AF37]/20 text-[#D4AF37]"
                    }`}>
                      {row.statut ? row.statut.replace("_", " ") : "en attente"}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-[#666666]">
                    {row.created_at ? format(new Date(row.created_at), "dd MMM yy", { locale: fr }) : "-"}
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    <a 
                      href={`https://wa.me/${row.telephone.replace(/\s+/g, "")}?text=${encodeURIComponent(`Bonjour ${row.nom}, votre inscription à la JPO Pôle ${row.pole ? row.pole.toUpperCase() : ""} KTE 2026 est confirmée ! Pour toute question: +242 05 328 7181`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#1D9E75] hover:bg-[#1D9E75]/10 rounded-md transition-colors"
                      title="WhatsApp"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </a>
                    {row.statut !== "confirme" && (
                      <button 
                        onClick={() => setConfirmDialog({ isOpen: true, action: "confirme", id: row.id })}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Confirmer"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {row.statut !== "annule" && (
                      <button 
                        onClick={() => setConfirmDialog({ isOpen: true, action: "annule", id: row.id })}
                        className="p-1.5 text-[#C4622D] hover:bg-[#C4622D]/10 rounded-md transition-colors"
                        title="Annuler"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-[#666666]">Aucun résultat.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={confirmDialog.isOpen} onOpenChange={(val) => !val && setConfirmDialog({ isOpen: false, action: null, id: null })}>
        <DialogContent className="bg-white text-[#1A1A1A] border-[#E5E3DD]">
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr ?</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment marquer cette inscription comme <strong className="uppercase">{confirmDialog.action}</strong> ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button 
              onClick={handleUpdateStatus} 
              className={confirmDialog.action === "annule" ? "bg-[#C4622D] hover:bg-red-700 text-white" : "bg-[#1D9E75] hover:bg-green-700 text-white"}
            >
              Oui, valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
