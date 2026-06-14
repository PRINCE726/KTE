"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from 'next/image';
import { Bus, MapPin, Check, BookOpen, GraduationCap, Calendar, Phone, Mail, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

const scheduleData = [
  { id: 1, lycee: "Lycée Victor Augagneur", arrond: "Arrond. 3 Mvou-Mvou", date: "12 Déc 2025", statut: "complet" as const, label: "Complet" },
  { id: 2, lycee: "Lycée Chaminade", arrond: "Arrond. 2 Mvou-Mvou", date: "15 Jan 2026", statut: "complet" as const, label: "Complet" },
  { id: 3, lycee: "Lycée de la Révolution", arrond: "Arrond. 4 Loandjili", date: "10 Fév 2026", statut: "green" as const, label: "Disponible" },
  { id: 4, lycee: "Lycée Technique Poaty Bernard", arrond: "Arrond. 5 Mongo-Mpoukou", date: "24 Fév 2026", statut: "default" as const, label: "À venir" },
];

const testimonials = [
  {
    id: 1,
    quote: "La Caravane KTE est venue directement dans notre classe au Lycée Augagneur. Grâce aux conseillers, j'ai compris la différence entre médecine et pharmacie et j'ai déjà constitué mon dossier de bourse d'études !",
    author: "Ruth Taty",
    role: "Bachelière 2025 · Pointe-Noire",
  },
  {
    id: 2,
    quote: "C'était incroyable. Je ne savais pas du tout quoi faire après mon Bac D. L'atelier d'orientation gratuit m'a ouvert les yeux sur les métiers du numérique et le codage d'applications mobiles.",
    author: "Junior Makosso",
    role: "Bachelier 2025 · Pointe-Noire",
  },
  {
    id: 3,
    quote: "Un grand merci à la Caravane KTE. Leur équipe d'orientation m'a aidé à comprendre les procédures de visa étudiant et les possibilités d'études abordables en France et au Sénégal.",
    author: "Priscille Loussou",
    role: "Étudiante en gestion · Ancienne Bachelière",
  }
];

export default function CaravanePage() {
  const [formData, setFormData] = useState({
    lycee: "",
    arrondissement: "Arrond. 1 Emery Patrice Lumumba",
    responsable: "",
    telephone: "",
    email: "",
    nb_eleves: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lycee || !formData.responsable || !formData.telephone) {
      toast({
        title: "Champs requis",
        description: "Merci de remplir les champs obligatoires.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/demande-caravane", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Demande Envoyée ! 🚌",
          description: "L'équipe KTE a bien reçu ta demande pour ton lycée. Nous te contacterons très bientôt.",
          variant: "success",
        });
        setFormData({
          lycee: "",
          arrondissement: "Arrond. 1 Emery Patrice Lumumba",
          responsable: "",
          telephone: "",
          email: "",
          nb_eleves: "",
          message: ""
        });
      } else {
        throw new Error(data.error || "Une erreur est survenue.");
      }
    } catch (err: any) {
      toast({
        title: "Oups !",
        description: err.message || "Impossible d'envoyer ta demande.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen text-foreground overflow-x-hidden flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 w-full">
        {/* SECTION 1: HERO */}
        <section className="relative min-h-[70vh] w-full flex items-center justify-center py-16 overflow-hidden">
          {/* Panoramic background frame */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/80 z-0" />
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center flex flex-col items-center">
            <Badge variant="green" className="px-3.5 py-1 text-xs border-[#1D9E75]/30 text-[#1D9E75] uppercase mb-6 tracking-widest bg-[#141414]/80">
              🚌 Caravane de l'Orientation · Mobilité Scolaire
            </Badge>

            <h1 className="font-serif text-4xl md:text-6xl font-extrabold text-foreground mb-4">
              La Caravane de l'Orientation
            </h1>
            <p className="font-serif text-xl md:text-2xl text-primary font-bold mb-6">
              On vient chez toi. Dans ton lycée.
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-12">
              Le programme KTE d'accompagnement mobile de proximité. Nos experts d'orientation et de bourses d'études se déplacent directement dans ton établissement scolaire à Pointe-Noire pour t'offrir des conseils d'excellence gratuits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="#form">
                <Button size="pill" variant="default" className="px-8 shadow-[0_6px_25px_rgba(212,175,55,0.3)]">
                  FAIRE VENIR DANS MON LYCÉE
                </Button>
              </Link>
              <Link href="#schedule">
                <Button size="pill" variant="outline" className="px-8">
                  VOIR LE CALENDRIER
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 2: EXPLANATION SPLIT */}
        <section className="w-full py-20 bg-[#0F0F0F] relative border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              {/* Left Column - Team photo */}
<div className="lg:col-span-5 relative flex justify-center">
  <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-border/20 shadow-2xl bg-zinc-900">
    
    {/* Utilisation correcte du composant Image de Next.js */}
    <Image 
      src="/images/caravane/caravane-groupe-lycee.webp" 
      alt="Groupe d'élèves devant la Caravane KTE"
      fill 
      className="object-cover"
    />

    {/* Icône Bus en superposition */}
    <div className="absolute -bottom-2 -right-2 text-[#1D9E75]/20 z-10">
      <Bus className="h-36 w-36" />
    </div>

    {/* Texte en superposition (si vous voulez garder le texte par-dessus l'image) */}
    <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center space-y-2 bg-black/40 p-8">
      <GraduationCap className="h-12 w-12 text-primary" />
      <span className="font-serif text-lg font-bold text-white">Un Accompagnement Mobile</span>
      <span className="text-xs text-white/80">Conseils gratuits, brochures spécialisées et tests d'orientation sur place.</span>
    </div>

    {/* Gold corner accents */}
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary z-30" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary z-30" />
  </div>
</div>

              {/* Right Column */}
              <div className="lg:col-span-7 flex flex-col space-y-6">
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-primary" />
                  <span className="text-xs font-bold tracking-widest text-primary uppercase">Comment ça marche ?</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-foreground">
                  Des coachs certifiés
                  <br />
                  <span className="text-primary font-serif">se déplacent pour t'aider à choisir.</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Pas besoin de perdre ton temps ou ton argent en transports. En collaboration officielle avec la **Mairie Centrale de Pointe-Noire**, la Caravane KTE se rend dans les lycées publics et privés de chaque arrondissement de la ville océane.
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Nous animons des séances de questions-réponses interactives de 2 heures par classe, présentons les filières d'avenir à forte employabilité en République du Congo et à l'international, et distribuons des guides d'orientation détaillés.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: UPCOMING SCHEDULE */}
        <section id="schedule" className="w-full py-20 bg-background relative border-t border-border/10">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Planification 2025 - 2026</span>
              <h2 className="font-serif text-3xl font-bold mt-2">Le Calendrier des Escales</h2>
              <p className="text-xs text-muted-foreground mt-2">Découvre les prochaines dates validées. Si ton lycée n'y figure pas, fais une demande ci-dessous !</p>
            </div>

            {/* Schedule Cards List */}
            <div className="space-y-4">
              {scheduleData.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-border/10 bg-card hover:border-primary/20 transition-all duration-300 gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 text-xl font-bold font-serif">
                      🏫
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-foreground">{item.lycee}</h4>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          {item.arrond}
                        </span>
                        <span className="hidden sm:inline text-muted-foreground/30">|</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-primary" />
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t border-border/10 sm:border-none pt-3 sm:pt-0">
                    <Badge variant={item.statut === "complet" ? "destructive" : item.statut === "green" ? "green" : "default"} className="text-[10px] uppercase font-bold tracking-wider px-3 py-1">
                      {item.label}
                    </Badge>
                    <Link href="#form">
                      <Button size="sm" variant={item.statut === "green" ? "default" : "outline"} className="text-xs rounded-lg">
                        Demander
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="#form" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                <span>Faire une demande pour votre établissement scolaire →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: WHAT YOU GET FREE */}
        <section className="w-full py-20 bg-[#0F0F0F] relative border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Gratuité Totale</span>
              <h2 className="font-serif text-3xl font-bold mt-2">Ce que KTE t'apporte</h2>
              <p className="text-xs text-muted-foreground mt-2">Chaque escale de la Caravane inclut des services d'excellence entièrement pris en charge.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <Card hoverEffect={true} className="border-border/15 bg-card/65">
                <CardHeader className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl">
                    🎯
                  </div>
                  <CardTitle className="font-serif text-lg font-bold mt-4">Orientation Personnalisée</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-xs text-muted-foreground leading-relaxed space-y-3">
                  <p>Tests de personnalité professionnels et entretiens de 15 minutes en tête-à-tête avec nos conseillers spécialisés.</p>
                  <ul className="space-y-1.5 text-foreground/80 font-medium">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary shrink-0" /> Évaluation des passions</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary shrink-0" /> Alignement avec le marché</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card hoverEffect={true} className="border-border/15 bg-card/65">
                <CardHeader className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/20 flex items-center justify-center text-[#1D9E75] text-xl">
                    📚
                  </div>
                  <CardTitle className="font-serif text-lg font-bold mt-4">Catalogue des Formations</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-xs text-muted-foreground leading-relaxed space-y-3">
                  <p>Remise d'une brochure de 48 pages présentant les meilleures universités d'Afrique, d'Europe et d'Amérique.</p>
                  <ul className="space-y-1.5 text-foreground/80 font-medium">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#1D9E75] shrink-0" /> 50+ filières répertoriées</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#1D9E75] shrink-0" /> Critères d'admission exacts</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card hoverEffect={true} className="border-border/15 bg-card/65">
                <CardHeader className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-[#C4622D]/10 border border-[#C4622D]/20 flex items-center justify-center text-[#C4622D] text-xl">
                    ✈️
                  </div>
                  <CardTitle className="font-serif text-lg font-bold mt-4">Guides Bourses & Visas</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-xs text-muted-foreground leading-relaxed space-y-3">
                  <p>Fiches pratiques simplifiées expliquant les démarches de bourses d'études et d'obtention de visas étudiants sans stress.</p>
                  <ul className="space-y-1.5 text-foreground/80 font-medium">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#C4622D] shrink-0" /> Chronogramme des bourses</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#C4622D] shrink-0" /> Checklist pièces administratives</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 5: REQUEST FORM */}
        <section id="form" className="w-full py-20 bg-background relative border-t border-border/10">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Proviseurs & Établissements</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">Faire une Demande d'Escale</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Vous êtes proviseur, enseignant ou délégué de classe ? Remplissez ce formulaire pour planifier le passage gratuit de la Caravane KTE dans votre lycée.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-[#141414] p-8 rounded-3xl border border-border/15 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Nom du Lycée / Établissement *</label>
                  <Input
                    placeholder="Ex: Lycée Victor Augagneur"
                    value={formData.lycee}
                    onChange={(e) => setFormData({ ...formData, lycee: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Arrondissement *</label>
                  <Select
                    value={formData.arrondissement}
                    onChange={(e) => setFormData({ ...formData, arrondissement: e.target.value })}
                    options={[
                      { value: "Arrond. 1 Emery Patrice Lumumba", label: "Arrondissement 1 — Lumumba" },
                      { value: "Arrond. 2 Mvou-Mvou", label: "Arrondissement 2 — Mvou-Mvou" },
                      { value: "Arrond. 3 Tié-Tié", label: "Arrondissement 3 — Tié-Tié" },
                      { value: "Arrond. 4 Loandjili", label: "Arrondissement 4 — Loandjili" },
                      { value: "Arrond. 5 Mongo-Mpoukou", label: "Arrondissement 5 — Mongo-Mpoukou" },
                      { value: "Arrond. 6 Ngoyo", label: "Arrondissement 6 — Ngoyo" },
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Responsable à contacter *</label>
                <Input
                  placeholder="Ex: M. Jean-Paul Balossa (Proviseur)"
                  value={formData.responsable}
                  onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Téléphone *</label>
                  <Input
                    type="tel"
                    placeholder="Ex: +242 05 328 7181"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Adresse E-mail</label>
                  <Input
                    type="email"
                    placeholder="Ex: proviseur@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Nombre d'élèves de Terminale</label>
                  <Input
                    type="number"
                    placeholder="Ex: 450"
                    value={formData.nb_eleves}
                    onChange={(e) => setFormData({ ...formData, nb_eleves: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Message / Détails de la demande</label>
                <Textarea
                  placeholder="Ex: Explique tes souhaits d'orientation pour ton établissement..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="pt-4 border-t border-border/10 flex flex-col sm:flex-row gap-4">
                <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-center rounded-full font-bold">
                  {isSubmitting ? "Envoi de votre demande..." : "FAIRE VENIR LA CARAVANE"}
                </Button>
                <a
                  href="https://wa.me/242053287181"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#1D9E75] hover:bg-[#25bc8d] text-[#F5F0E8] py-3 px-6 text-sm font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(29,158,117,0.3)] shrink-0"
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span>Assistance direct</span>
                </a>
              </div>
            </form>
          </div>
        </section>

        {/* SECTION 6: TESTIMONIALS */}
        <section className="w-full py-20 bg-[#0F0F0F] relative border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Témoignages</span>
              <h2 className="font-serif text-3xl font-bold mt-2">Ils Témoignent de l'Impact</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((item) => (
                <Card key={item.id} hoverEffect={true} className="border-border/10 bg-card/50 flex flex-col justify-between">
                  <CardContent className="p-6 space-y-4">
                    <span className="text-3xl text-primary font-serif">“</span>
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      {item.quote}
                    </p>
                  </CardContent>
                  <CardContent className="p-6 pt-0 border-t border-border/5 mt-4">
                    <h4 className="font-serif text-sm font-bold text-foreground">{item.author}</h4>
                    <p className="text-[10px] text-primary font-semibold mt-0.5">{item.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
