import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function ListeGaleriesAdminPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  // Récupérer toutes les galeries de la BDD
  const { data: galeries } = await supabase
    .from("galeries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.08)] pb-4">
        <div>
          <h1 className="font-sans text-3xl font-bold text-[#F5F5F5]">Gestion des Galeries</h1>
          <p className="text-sm text-[#888888]">Sélectionnez une galerie pour gérer ses photos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {galeries?.map((galerie) => (
          <div key={galerie.id} className="border border-[rgba(255,255,255,0.08)] p-5 rounded-xl bg-[#161616] flex flex-col justify-between">
            <div>
              <h2 className="font-sans text-xl font-bold text-[#F5F5F5] mb-1">{galerie.titre}</h2>
              <p className="text-xs text-[#888888] mb-4">Édition : {galerie.edition}</p>
            </div>
            <Link 
              href={`/admin/galeries/${galerie.id}`} 
              className="text-center block w-full px-4 py-2 bg-[#D4AF37] text-[#080808] font-bold rounded-lg text-sm hover:bg-[#E8C84D] transition-colors"
            >
              Gérer les photos →
            </Link>
          </div>
        ))}
      </div>

      {galeries?.length === 0 && (
        <div className="text-center py-12 text-[#888888] border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl bg-[#161616]">
          Aucune galerie disponible.
        </div>
      )}
    </div>
  );
}
