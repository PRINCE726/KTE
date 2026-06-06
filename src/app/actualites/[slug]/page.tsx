import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Calendar, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60; // Revalide la page toutes les minutes
export const dynamic = "force-dynamic"; // Force la mise à jour des données en développement

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  // 1. Résolution asynchrone des paramètres et du store de cookies
  const { slug } = await params;
  const cookieStore = await cookies();
  
  // 2. Initialisation propre du client Supabase SSR
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
            // Géré par le middleware de l'application
          }
        },
      },
    }
  );
  
  // 3. Récupération de l'article ciblé par son slug
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!article) {
    notFound();
  }

  const getBadgeColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "gala": return "gold";
      case "caravane": return "outline";
      case "partenariat":
      case "partenariat": return "green";
      case "jpo": return "secondary";
      case "médias": return "secondary";
      default: return "secondary";
    }
  };

  // On utilise la date de création 'created_at' si 'date_publication' est absente de la base
  const articleDate = article.date_publication || article.created_at;

  return (
    <div className="w-full bg-background min-h-screen text-foreground overflow-x-hidden flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-8">
          <Link href="/actualites" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux actualités
          </Link>
        </div>

        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant={getBadgeColor(article.categorie) as any} className="text-xs uppercase tracking-wider px-3 py-1">
                {article.categorie || "Actualité"}
              </Badge>
              {articleDate && (
                <span className="text-sm text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(articleDate), "dd MMMM yyyy", { locale: fr })}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-extrabold leading-tight text-foreground">
              {article.titre}
            </h1>

            {article.excerpt && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed border-l-2 border-primary pl-4 py-1">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Cover Image */}
          {article.image_url ? (
            <div className="w-full aspect-video relative rounded-2xl overflow-hidden border border-border/10 shadow-2xl bg-zinc-950">
              <img src={article.image_url} alt={article.titre} className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-video relative rounded-2xl overflow-hidden border border-border/10 shadow-xl bg-zinc-950 flex items-center justify-center">
              <Compass className="h-24 w-24 text-primary/20" />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none 
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground/90 prose-strong:font-bold
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: article.content || article.body || "" }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}