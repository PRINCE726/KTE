import { createServerSupabaseClient } from "@/lib/supabase-server";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Download, FilePlus2, MessageSquare } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  const [{ count: countGala }, { count: countJPO }, { count: countCaravane }, { count: countNewsletter }] = await Promise.all([
    supabase.from("inscriptions_gala").select("*", { count: "exact", head: true }),
    supabase.from("inscriptions_jpo").select("*", { count: "exact", head: true }),
    supabase.from("demandes_caravane").select("*", { count: "exact", head: true }),
    supabase.from("newsletter").select("*", { count: "exact", head: true }),
  ]);

  // Fetch recent activity across all tables
  const [
    { data: recentGala },
    { data: recentJPO },
    { data: recentCaravane }
  ] = await Promise.all([
    supabase.from("inscriptions_gala").select("id, nom, type_pass, telephone, statut, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("inscriptions_jpo").select("id, nom, pole, telephone, statut, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("demandes_caravane").select("id, lycee, arrondissement, telephone, statut, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const activities = [
    ...(recentGala || []).map(item => ({ ...item, source: "gala" as const })),
    ...(recentJPO || []).map(item => ({ ...item, source: "jpo" as const })),
    ...(recentCaravane || []).map(item => ({ ...item, source: "caravane" as const }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-t-[#D4AF37] border-x border-b border-[#E5E3DD] p-6">
          <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-2">🎭 Inscriptions Gala</p>
          <p className="text-4xl font-black text-[#D4AF37] mb-1">{countGala || 0}</p>
          <p className="text-xs text-[#1A1A1A] font-semibold">Total inscrits</p>
          <p className="text-[10px] text-[#666666] mt-1">À suivre ce mois</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-t-[#D4AF37] border-x border-b border-[#E5E3DD] p-6">
          <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-2">🎓 Inscriptions JPO</p>
          <p className="text-4xl font-black text-[#1A1A1A] mb-1">{countJPO || 0}</p>
          <p className="text-xs text-[#1A1A1A] font-semibold">Total inscrits</p>
          <p className="text-[10px] text-[#666666] mt-1">Immersions à planifier</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-t-[#D4AF37] border-x border-b border-[#E5E3DD] p-6">
          <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-2">🚌 Demandes Caravane</p>
          <p className="text-4xl font-black text-[#1A1A1A] mb-1">{countCaravane || 0}</p>
          <p className="text-xs text-[#1A1A1A] font-semibold">Total demandes</p>
          <p className="text-[10px] text-[#666666] mt-1">Établissements en attente</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border-t-[3px] border-t-[#D4AF37] border-x border-b border-[#E5E3DD] p-6">
          <p className="text-xs font-bold text-[#666666] uppercase tracking-wider mb-2">📧 Newsletter</p>
          <p className="text-4xl font-black text-[#1A1A1A] mb-1">{countNewsletter || 0}</p>
          <p className="text-xs text-[#1A1A1A] font-semibold">Abonnés</p>
          <p className="text-[10px] text-[#666666] mt-1">Alertes KTE actives</p>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E3DD] rounded-lg text-sm font-semibold text-[#1A1A1A] shadow-sm hover:bg-[#F8F7F4] transition-colors">
          <Download className="h-4 w-4 text-[#666666]" /> Export Gala CSV
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E3DD] rounded-lg text-sm font-semibold text-[#1A1A1A] shadow-sm hover:bg-[#F8F7F4] transition-colors">
          <Download className="h-4 w-4 text-[#666666]" /> Export JPO CSV
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E3DD] rounded-lg text-sm font-semibold text-[#1A1A1A] shadow-sm hover:bg-[#F8F7F4] transition-colors">
          <Download className="h-4 w-4 text-[#666666]" /> Export Caravane CSV
        </button>
        <Link href="/admin/articles/new" className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold shadow-sm hover:bg-[#E8C84D] transition-colors ml-auto">
          <FilePlus2 className="h-4 w-4" /> Nouvel Article
        </Link>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E3DD] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E3DD] bg-[#F8F7F4]/50">
          <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">Nouvelles inscriptions (aujourd'hui)</h2>
        </div>
        <div className="divide-y divide-[#E5E3DD]">
          {activities.length > 0 ? activities.map((activity) => {
            const timeAgo = formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: fr });
            const name = activity.source === "caravane" ? activity.lycee : activity.nom;
            const initials = name?.substring(0, 2).toUpperCase() || "K";
            
            let description = "";
            if (activity.source === "gala") {
              description = "Pass " + (activity.type_pass === "vip" ? "VIP" : "Bachelier");
            }
            if (activity.source === "jpo") {
              description = "JPO " + activity.pole;
            }
            if (activity.source === "caravane") {
              description = "Caravane " + activity.arrondissement;
            }

            return (
              <div key={`${activity.source}-${activity.id}`} className="px-6 py-4 flex items-center justify-between hover:bg-[#F8F7F4] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 bg-[#D4AF37]/20 border border-[#D4AF37] rounded-full flex items-center justify-center font-bold text-[#080808]">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">{name}</p>
                    <p className="text-xs text-[#666666] capitalize">{description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className="text-xs text-[#666666] w-24 text-right hidden sm:block">{timeAgo}</span>
                  
                  {/* Status Badge */}
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md w-24 text-center ${
                    activity.statut === "confirme" || activity.statut === "traite" ? "bg-[#1D9E75]/10 text-[#1D9E75]" :
                    activity.statut === "annule" ? "bg-[#C4622D]/10 text-[#C4622D]" :
                    "bg-[#D4AF37]/20 text-[#D4AF37]"
                  }`}>
                    {activity.statut ? activity.statut.replace("_", " ") : ""}
                  </span>

                  {/* WhatsApp Button */}
                  <a 
                    href={`https://wa.me/${activity.telephone ? activity.telephone.replace(/\s+/g, "") : ""}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-[#1D9E75] bg-[#1D9E75]/10 hover:bg-[#1D9E75]/20 rounded-lg transition-colors"
                    title="Contacter sur WhatsApp"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          }) : (
            <div className="p-8 text-center text-[#666666] text-sm">
              Aucune activité récente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
