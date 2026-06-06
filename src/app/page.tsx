import { createServerSupabaseClient } from "@/lib/supabase-server";
import LandingClient from "./LandingClient";

export const revalidate = 60; // Revalidate every minute

export default async function LandingPage() {
  // On utilise le bon client asynchrone issu de votre fichier supabase-server.ts
  const supabase = await createServerSupabaseClient();
  
  // Fetch Gala Photos for the split sticky slideshow
  const { data: galeries } = await supabase
    .from("galeries")
    .select("id")
    .ilike("titre", "%Gala%")
    .eq("published", true)
    .limit(1)
    .single();
  
  let mappedPhotos: any[] = [];
  
  if (galeries) {
    const { data: galPhotos } = await supabase
      .from("galerie_photos")
      .select("*")
      .eq("galerie_id", galeries.id)
      .order("ordre", { ascending: true })
      .limit(5);

    if (galPhotos && galPhotos.length > 0) {
      // Map DB fields to what the UI expects
      const badgeVars = ["green", "outline", "destructive", "green", "destructive"];
      mappedPhotos = galPhotos.map((p, index) => ({
        id: p.id,
        url: p.image_url,
        badge: "Archive KTE",
        badgeVar: badgeVars[index % badgeVars.length],
        title: p.legende || "Le Gala des Bacheliers",
        sub: "Célébration de l'excellence à Pointe-Noire",
      }));
    }
  }

  // Fallback if no photos in DB
  if (mappedPhotos.length === 0) {
    mappedPhotos = [
      {
        id: 1,
        url: "/images/gala/gala-salle-diner-2.webp",
        badge: "Networking VIP",
        badgeVar: "green",
        title: "Construis ton réseau",
        sub: "Rencontre des décideurs et mentors",
      },
      {
        id: 2,
        url: "/images/gala/gala-remise-bourse-2.webp",
        badge: "Distinctions",
        badgeVar: "outline",
        title: "Ton mérite récompensé",
        sub: "10+ bourses octroyées",
      },
      {
        id: 3,
        url: "/images/gala/gala-salle-diner-1.webp",
        badge: "Soirée Prestige",
        badgeVar: "destructive",
        title: "Une nuit inoubliable",
        sub: "Dîner · Artistes · Tombola",
      }
    ];
  }

  return <LandingClient initialGalaPhotos={mappedPhotos} />;
}
