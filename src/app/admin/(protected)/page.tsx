import { createServerSupabaseClient } from "@/lib/supabase-server";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();

  // Fetch counts from all tables
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
    supabase.from("inscriptions_gala").select("id, nom, type_pass, telephone, statut, created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("inscriptions_jpo").select("id, nom, pole, telephone, statut, created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("demandes_caravane").select("id, lycee, arrondissement, telephone, statut, created_at").order("created_at", { ascending: false }).limit(10),
  ]);

  return (
    <DashboardClient 
      countGala={countGala || 0}
      countJPO={countJPO || 0}
      countCaravane={countCaravane || 0}
      countNewsletter={countNewsletter || 0}
      recentGala={recentGala || []}
      recentJPO={recentJPO || []}
      recentCaravane={recentCaravane || []}
    />
  );
}
