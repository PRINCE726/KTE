import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import GalaClient from "./GalaClient";

export const revalidate = 60; // Revalidate every minute

export default async function GalaPage() {
  // 1. Récupération des cookies (asynchrone)
  const cookieStore = await cookies();

  // 2. Initialisation du nouveau client Supabase SSR
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
            // Optionnel : Next.js peut râler si on tente de modifier des cookies 
            // pendant le rendu d'un Server Component statique (ISR). On ignore ici.
          }
        },
      },
    }
  );
  
  // 3. Récupération des paramètres
  const { data: parametres } = await supabase.from("parametres").select("*");
  const settings: Record<string, string> = {};
  if (parametres) {
    parametres.forEach(item => {
      settings[item.cle] = item.valeur;
    });
  }

  // 4. Récupération de la galerie "Gala"
  const { data: galeries } = await supabase
    .from("galeries")
    .select("id")
    .ilike("titre", "%Gala%")
    .eq("published", true)
    .limit(1)
    .maybeSingle(); // .single() crash si rien n'est trouvé, .maybeSingle() est plus safe

  let photos: any[] = [];
  if (galeries) {
    const { data: galPhotos } = await supabase
      .from("galerie_photos")
      .select("*")
      .eq("galerie_id", galeries.id)
      .order("ordre", { ascending: true });
    photos = galPhotos || [];
  }

  return <GalaClient settings={settings} initialPhotos={photos} />;
}
