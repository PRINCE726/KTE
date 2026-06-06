"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, Download, MessageSquare, Check, X } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
// CORRECTION : Utilisation de la fonction d'initialisation de votre supabase.ts
import { createClient } from "@/lib/supabase";

// Interface pour typer proprement les données d'inscription
interface Inscription {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  type_pass: "vip" | "bachelier" | string;
  lycee: string;
  statut: "en_attente" | "confirme" | "annule" | string;
  created_at: string;
}

// CORRECTION : Initialisation de l'instance client Supabase
const supabase = createClient();

export default function GalaAdmin() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterPass, setFilterPass] = useState("Tous");
  const { toast } = useToast();

  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; action: "confirme" | "annule" | null; id: string | null }>({
    isOpen: false, action: null, id: null
  });

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("inscriptions_gala")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error && data) setInscriptions(data as Inscription[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async () => {
    if (!confirmDialog.id || !confirmDialog.action) return;
    
    const { error } = await supabase
      .from("inscriptions_gala")
      .update({ statut: confirmDialog.action })
      .eq("id", confirmDialog.id);

    if (error) {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    } else {
      toast({ title: "Statut mis à jour avec succès", variant: "default" });
      setInscriptions(inscriptions.map(inc => inc.id === confirmDialog.id ? { ...inc, statut: confirmDialog.action! } : inc));
    }
    setConfirmDialog({ isOpen: false, action: null, id: null });
  };

  const handleExportCSV = () => {
    if (inscriptions.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,ID,Nom,Email,Telephone,Pass,Lycee,Statut,Date\n";
    
    inscriptions.forEach(row => {
      csvContent += `"${row.id}","${row.nom}","${row.email}","${row.telephone}","${row.type_pass}","${row.lycee}","${row.statut}","${row.created_at}"\n`;
    });
    
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "export_gala.csv";
    link.click();
  };

  const filteredInscriptions = inscriptions.filter(inc => {
    const matchesSearch = inc.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.telephone.includes(searchTerm);
    const matchesStatut = filterStatut === "Tous" || inc.statut === filterStatut;
    const matchesPass = filterPass === "Tous" || inc.type_pass === filterPass;
    return matchesSearch && matchesStatut && matchesPass;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A]">Inscriptions Gala</h1>
          <p className="text-sm text-[#666666] mt-1">
            <span className="bg-[#D4AF37]/20 text-[#D4AF37] font-bold px-2 py-0.5 rounded-full text-xs mr-2">{inscriptions.length} total</span>
            Gestion des réservations VIP et Classiques.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E3DD] flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
          <input 
            type="text" 
            placeholder="Rechercher nom, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E5E3DD] rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <select 
          value={filterStatut} 
          onChange={(e) => setFilterStatut(e.target.value)}
          className="border border-[#E5E3DD] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
        >
          <option value="Tous">Statut: Tous</option>
          <option value="en_attente">En attente</option>
          <option value="confirme">Confirmé</option>
          <option value="annule">Annulé</option>
        </select>
        <select 
          value={filterPass} 
          onChange={(e) => setFilterPass(e.target.value)}
          className="border border-[#E5E3DD] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
        >
          <option value="Tous">Pass: Tous</option>
          <option value="bachelier">Bachelier</option>
          <option value="vip">VIP</option>
        </select>
        <button 
          onClick={handleExportCSV}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-[#F8F7F4] border border-[#E5E3DD] rounded-lg text-sm font-semibold hover:bg-[#E5E3DD] transition-colors"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E3DD] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F8F7F4]">
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Pass</TableHead>
                <TableHead>Lycée</TableHead>
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
                    <TableCell className="font-bold text-[#1A1A1A]">{row.nom}</TableCell>
                    <TableCell className="text-sm text-[#666666]">{row.email}</TableCell>
                    <TableCell className="text-sm font-mono">{row.telephone}</TableCell>
                    <TableCell>
                      {row.type_pass === "vip" ? (
                        <span className="bg-[#D4AF37] text-[#080808] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                          VIP
                        </span>
                      ) : (
                        <span className="border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                          Classique
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{row.lycee}</TableCell>
                    <TableCell>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md inline-block text-center ${
                        row.statut === "confirme" ? "bg-[#1D9E75]/10 text-[#1D9E75]" :
                        row.statut === "annule" ? "bg-[#C4622D]/10 text-[#C4622D]" :
                        "bg-[#D4AF37]/20 text-[#D4AF37]"
                      }`}>
                        {row.statut ? row.statut.replace("_", " ") : "en attente"}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-[#666666]">
                      {row.created_at ? format(new Date(row.created_at), "dd MMM yyyy", { locale: fr }) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a 
                          href={`https://wa.me/${row.telephone.replace(/\s+/g, "")}?text=${encodeURIComponent(`Bonjour ${row.nom}...`)}`}
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-[#666666]">Aucun résultat trouvé.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
            <DialogClose asChild>
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