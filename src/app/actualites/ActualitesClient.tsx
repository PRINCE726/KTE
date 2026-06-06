"use client";

import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Search, Calendar, ChevronRight, MessageSquare, Rss, ArrowUpRight, Compass, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categoryPills = ["Tous", "Gala", "Caravane", "JPO", "Partenariat", "Médias"];

export default function ActualitesClient({ initialArticles }: { initialArticles: any[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast({
          title: "Abonnement réussi ! 📧",
          description: "Tu es inscrit aux alertes KTE.",
          variant: "success",
        });
        setEmail("");
      } else {
        throw new Error();
      }
    } catch {
      toast({
        title: "Oups !",
        description: "Impossible de s'abonner pour le moment.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "gala": return "gold";
      case "caravane": return "outline";
      case "partenariat": return "green";
      case "jpo": return "secondary";
      case "médias": return "secondary";
      default: return "secondary";
    }
  };

  // Client-side filtering logic
  const filteredArticles = initialArticles.filter((article) => {
    const matchesSearch = article.titre.toLowerCase().includes(search.toLowerCase()) ||
                          (article.excerpt && article.excerpt.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "Tous" || (article.categorie && article.categorie.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;

  return (
    <div className="w-full bg-background min-h-screen text-foreground overflow-x-hidden flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* SECTION 1: HERO MINIMAL & FILTERS */}
        <div className="flex flex-col space-y-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Média d'Orientation</span>
              <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-foreground mt-2">Actualités</h1>
              <div className="w-10 h-0.5 bg-primary mt-2" />
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:max-w-xs">
              <Input
                placeholder="Rechercher un article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 text-xs bg-card border-border/15"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Filter badges */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryPills.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="focus:outline-none cursor-pointer"
              >
                <Badge
                  variant={activeCategory === cat ? "gold" : "secondary"}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {cat}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: FEATURED ARTICLE */}
        {activeCategory === "Tous" && !search && featuredArticle && (
          <div className="mb-16">
            <Card hoverEffect={true} className="border-border/15 overflow-hidden bg-card/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                {/* Image block */}
                <div className="lg:col-span-6 relative aspect-video lg:aspect-auto min-h-[300px] bg-zinc-950 flex items-center justify-center p-8 text-primary/10 border-b lg:border-b-0 lg:border-r border-border/10">
                  {featuredArticle.image_url ? (
                    <img src={featuredArticle.image_url} alt={featuredArticle.titre} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <Compass className="h-24 w-24 animate-pulse-ring" />
                  )}
                  <div className="absolute inset-0 bg-black/60 z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <Badge variant="green" className="text-[10px] uppercase font-bold tracking-widest bg-[#1D9E75] text-white">
                      À la Une
                    </Badge>
                  </div>
                </div>

                {/* Content block */}
                <CardContent className="lg:col-span-6 p-8 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge variant={getBadgeColor(featuredArticle.categorie) as any} className="text-[10px] uppercase tracking-wider">
                      {featuredArticle.categorie || "Actualité"}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {featuredArticle.date_publication ? format(new Date(featuredArticle.date_publication), "dd MMM yyyy", { locale: fr }) : ""}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight">
                    {featuredArticle.titre}
                  </h2>

                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="pt-4 border-t border-border/10">
                    <Link href={`/actualites/${featuredArticle.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-[#E8C84D] transition-colors group">
                      <span>Lire l'article complet</span>
                      <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* SECTION 3: ARTICLES GRID & SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Grid list */}
          <div className="lg:col-span-8 flex flex-col space-y-8">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 p-8 bg-[#141414] border border-border/10 rounded-2xl">
                <p className="text-sm text-muted-foreground font-semibold">Aucun article ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} id={article.id} hoverEffect={true} className="border-border/10 flex flex-col justify-between h-full scroll-mt-24">
                    <div className="aspect-video relative overflow-hidden bg-zinc-950 flex items-center justify-center p-6 text-primary/10 border-b border-border/10">
                      {article.image_url ? (
                        <img src={article.image_url} alt={article.titre} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <Rss className="h-12 w-12" />
                      )}
                      <div className="absolute inset-0 bg-black/60 z-10" />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="font-mono text-[9px] text-primary/30">KTE_ARCHIVE</span>
                      </div>
                    </div>
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={getBadgeColor(article.categorie) as any} className="text-[9px] uppercase tracking-wider font-bold">
                          {article.categorie || "Actualité"}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {article.date_publication ? format(new Date(article.date_publication), "dd MMM yyyy", { locale: fr }) : ""}
                        </span>
                      </div>
                      <CardTitle className="font-serif text-base font-bold mt-3 leading-snug line-clamp-2">
                        {article.titre}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed flex-1">
                      <p className="line-clamp-3">{article.excerpt}</p>
                    </CardContent>
                    <CardContent className="p-5 pt-0 border-t border-border/5 mt-3 flex justify-between items-center shrink-0">
                      <Link href={`/actualites/${article.slug}`} className="inline-flex items-center gap-0.5 text-xs font-bold text-primary hover:text-[#E8C84D] transition-colors group">
                        <span>Voir l'article</span>
                        <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            {/* Box 1: Events Calendar */}
            <Card hoverEffect={false} className="border-border/10 bg-card/65">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agenda 2026
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4 text-xs">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h5 className="font-serif text-sm font-bold text-foreground">Caravanes dans les Lycées</h5>
                    <p className="text-muted-foreground mt-0.5">Ateliers mobiles d'orientation gratuits.</p>
                  </div>
                  <Badge variant="green" className="shrink-0 text-[8px] uppercase">En cours</Badge>
                </div>
                <div className="h-px bg-border/5" />
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h5 className="font-serif text-sm font-bold text-foreground">Journées Portes Ouvertes</h5>
                    <p className="text-muted-foreground mt-0.5">Immersion dans 4 pôles métiers.</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[8px] uppercase">Avr-Mai</Badge>
                </div>
                <div className="h-px bg-border/5" />
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h5 className="font-serif text-sm font-bold text-foreground">GALA DES BACHELIERS</h5>
                    <p className="text-muted-foreground mt-0.5">Soirée prestige solennelle de bourses.</p>
                  </div>
                  <Badge variant="gold" className="shrink-0 text-[8px] uppercase">28 Juin</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Box 2: Newsletter form */}
            <Card hoverEffect={false} className="border-border/15 bg-[#141414] shadow-2xl">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="font-serif text-lg font-bold text-primary flex items-center gap-2">
                  <Rss className="h-5 w-5" />
                  Newsletter KTE
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Abonne-toi pour recevoir en direct les nouvelles offres de bourses gratuites et communiqués officiels par e-mail.
                </p>
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Ton adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 text-xs bg-[#0F0F0F] border-border/15"
                    required
                  />
                  <Button type="submit" disabled={isSubmitting} className="w-full h-10 text-xs rounded-xl font-bold uppercase tracking-wider">
                    {isSubmitting ? "Inscription..." : "M'INSCRIRE AUX ALERTES"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Box 3: WhatsApp Support */}
            <Card hoverEffect={false} className="border-border/10 bg-card/65 text-center">
              <CardContent className="p-6 space-y-4">
                <MessageSquare className="h-8 w-8 text-[#1D9E75] mx-auto animate-bounce" />
                <h4 className="font-serif text-sm font-bold">Un doute sur ton orientation ?</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Nos coachs d'orientation te répondent directement sur WhatsApp pour t'aider à finaliser tes dossiers scolaires.
                </p>
                <a
                  href="https://wa.me/242053287181"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D9E75] hover:bg-[#25bc8d] text-[#F5F0E8] py-2.5 text-xs font-bold transition-all shadow-[0_4px_10px_rgba(29,158,117,0.25)]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Écrire sur WhatsApp</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
