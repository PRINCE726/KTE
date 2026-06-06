"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Download, Search } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
// CORRECTION 1 : Alignement avec la méthode d'initialisation de votre projet
import { createClient } from "@/lib/supabase";

// Initialisation du client Supabase
const supabase = createClient();

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("newsletter").select("*").order("created_at", { ascending: false });
    if (!error && data) setSubscribers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (subscribers.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,ID,Email,Date\n";
    subscribers.forEach(row => {
      // CORRECTION 2 : Retrait de l'antislash parasite pour fermer correctement le template string
      csvContent += `"${row.id}","${row.email}","${row.created_at}"\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "export_newsletter.csv";
    link.click();
  };

  const filteredSubs = subscribers.filter(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()));

  // Calculate stats
  const total = subscribers.length;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const newThisMonth = subscribers.filter(s => new Date(s.created_at) >= startOfMonth).length;
  const newThisWeek = subscribers.filter(s => new Date(s.created_at) >= startOfWeek).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A]">Newsletter</h1>
          <p className="text-sm text-[#666666] mt-1">{total} abonnés inscrits aux alertes.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E3DD] rounded-lg text-sm font-semibold hover:bg-[#F8F7F4] transition-colors shadow-sm"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-t-[#D4AF37] border-x border-b border-[#E5E3DD] p-6">
          <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-2">Total abonnés</p>
          <p className="text-4xl font-black text-[#1A1A1A]">{total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-t-[#D4AF37] border-x border-b border-[#E5E3DD] p-6">
          <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-2">Nouveaux ce mois</p>
          <p className="text-4xl font-black text-[#1D9E75]">+{newThisMonth}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-t-[#D4AF37] border-x border-b border-[#E5E3DD] p-6">
          <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-2">Nouveaux cette semaine</p>
          <p className="text-4xl font-black text-[#1D9E75]">+{newThisWeek}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E5E3DD] overflow-hidden">
        <div className="p-4 border-b border-[#E5E3DD] bg-[#F8F7F4]">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
            <input 
              type="text" 
              placeholder="Rechercher un email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E3DD] rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-white">
            <TableRow>
              <TableHead className="w-16 text-center">#</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date d'inscription</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-[#666666]">Chargement...</TableCell></TableRow>
            ) : filteredSubs.length > 0 ? (
              filteredSubs.map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell className="text-center text-[#666666] text-xs">{idx + 1}</TableCell>
                  <TableCell className="font-bold text-[#1A1A1A]">{row.email}</TableCell>
                  <TableCell className="text-sm text-[#666666]">
                    {row.created_at ? format(new Date(row.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr }) : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={3} className="text-center py-8 text-[#666666]">Aucun abonné trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}