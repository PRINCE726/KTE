import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ActualitesClient from "./ActualitesClient";

// Conserve votre stratégie de mise en cache (ISR) : rafraîchissement toutes les minutes
export const revalidate = 60;
export const dynamic = "force-dynamic"; // 👈 AJOUTEZ CETTE LIGNE

export default async function ActualitesPage() {
  const cookieStore = await cookies();

  // Nouveau client Supabase SSR requis pour Next.js 16+
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Optionnel : Géré par le middleware de l'application
          }
        },
      },
    }
  );

  // Récupération de vos articles filtrés et ordonnés
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return <ActualitesClient initialArticles={articles || []} />;
}