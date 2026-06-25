"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, Compass, Calendar, MapPin, Users, Heart, Laptop, Image as Paintbrush, Scale, Check, Phone, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

const poleDetails = {
    Logistique: {
    title: "Pôle Logistique",
    icon: <Truck className="h-6 w-6 text-primary" />,
    sub: "Logistique · Environnement · Transport",
    spots: 12,
    timeline: [
      { time: "09h00", label: "Présentation des filières logistiques (conteneurs etc)" },
      { time: "10h30", label: "Panel: La réalité d'un cabinet de consultation à Pointe-Noire" },
      { time: "11h30", label: "Atelier pratique: Premiers secours & Lecture d'ordonnances" },
    ], 
    mentors: [
      { name: "Dr. Marc Mavoungou", role: "Cardiologue d'honneur · Clinique Océane" },
      { name: "Dr. Sarah Taty", role: "Directrice Générale · Pharmacie Centrale" },
    ]
  },
  sante: {
    title: "Pôle Santé",
    icon: <Heart className="h-6 w-6 text-primary" />,
    sub: "Médecine · Pharmacie · Soins",
    spots: 12,
    timeline: [
      { time: "09h00", label: "Présentation des filières médicales (Médecine dentaire, sage-femme, pharmacie)" },
      { time: "10h30", label: "Panel: La réalité d'un cabinet de consultation à Pointe-Noire" },
      { time: "11h30", label: "Atelier pratique: Premiers secours & Lecture d'ordonnances" },
    ], 
    mentors: [
      { name: "Dr. Marc Mavoungou", role: "Cardiologue d'honneur · Clinique Océane" },
      { name: "Dr. Sarah Taty", role: "Directrice Générale · Pharmacie Centrale" },
    ]
  },
  tech: {
    title: "Technologies & Industrie",
    icon: <Laptop className="h-6 w-6 text-[#1D9E75]" />,
    sub: "IA · Numérique · Ingénierie",
    spots: 8,
    timeline: [
      { time: "09h00", label: "Les métiers d'avenir de l'intelligence artificielle et du cloud computing" },
      { time: "10h30", label: "Atelier de programmation: Coder sa première landing page" },
      { time: "11h30", label: "Présentation de projets innovants conçus au Congo" },
    ],
    mentors: [
      { name: "M. Grace Loussou", role: "Architecte Solution Senior · MTN Congo" },
      { name: "Mme Ruth Makosso", role: "Chercheuse Intelligence Artificielle" },
    ]
  },
  arts: {
    title: "Culture & Education",
    icon: <Paintbrush className="h-6 w-6 text-[#C4622D]" />,
    sub: "education · culture · Social",
    spots: 15,
    timeline: [
      { time: "09h00", label: "Débouchés professionnels des beaux-arts et de l'architecture" },
      { time: "10h30", label: "Masterclass: Analyse critique de portfolio d'admission" },
      { time: "11h30", label: "Atelier pratique de dessin et d'esquisse architecturale" },
    ],
    mentors: [
      { name: "Mme Priscille Taty", role: "Architecte d'intérieur DPLG · Cabinet Kité" },
      { name: "M. Junior Balossa", role: "Directeur Artistique · NTI Media" },
    ]
  },
  business: {
    title: "Gestion & Droit",
    icon: <Scale className="h-6 w-6 text-primary" />,
    sub: "Gestion · Finance · Droit",
    spots: 5,
    timeline: [
      { time: "09h00", label: "Comprendre le climat de l'entrepreneuriat et de la finance" },
      { time: "10h30", label: "Simulation: Négocier un contrat commercial sans stress" },
      { time: "11h30", label: "Rencontre: Les filières d'avocats et juristes d'affaires" },
    ],
    mentors: [
      { name: "Me Jean-Paul Balossa", role: "Avocat d'affaires · Barreau de Pointe-Noire" },
      { name: "Mme Sarah Mavoungou", role: "Fondatrice · Incubateur Océan" },
    ]
  }
};

export default function JPOPage() {
  const [activePole, setActivePole] = useState< "Logistique" | "sante" | "technologie" | "culture" | "Gestion">("sante");
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    lycee: "",
    classe: "Terminale D",
    pole: "sante",
    session: "Matin (09h - 12h)",
    source: "Facebook"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.telephone || !formData.email) {
      toast({
        title: "Champs requis",
        description: "Merci de remplir les champs obligatoires.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inscription-jpo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Inscription JPO Validée ! 🎯",
          description: "Ta journée d'immersion est confirmée. Un email avec ton reçu t'a été envoyé.",
          variant: "success",
        });
        setFormData({
          nom: "",
          telephone: "",
          email: "",
          lycee: "",
          classe: "Terminale D",
          pole: "sante",
          session: "Matin (09h - 12h)",
          source: "Facebook"
        });
      } else {
        throw new Error(data.error || "Une erreur est survenue.");
      }
    } catch (err: any) {
      toast({
        title: "Oups !",
        description: err.message || "Impossible de valider ton inscription.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPole = poleDetails[activePole];

  return (
    <div className="w-full bg-background min-h-screen text-foreground overflow-x-hidden flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 w-full">
        {/* SECTION 1: HERO */}
        <section className="relative min-h-[60vh] w-full flex items-center justify-center py-16 overflow-hidden bg-dots">
          {/* Panoramic screen container */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/45 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/75 z-0" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center flex flex-col items-center">
            <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary uppercase mb-6 tracking-widest bg-[#141414]/90 animate-pulse">
              ⚡ Journée d'Immersion · Juin 2026
            </Badge>

            <h1 className="font-serif text-4xl md:text-6xl font-extrabold text-foreground mb-4">
              Passe une journée entière à te renseigner 
            </h1>
            <p className="font-serif text-xl md:text-2xl text-primary font-bold mb-6">
              dans le métier de tes rêves. Avant de décider.
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-12">
              Une expérience pratique d'orientation révolutionnaire à Pointe-Noire. Fini les théories ennuyeuses, choisis ton pôle d'activité et vis une immersion complète d'une demi-journée guidée par de réels professionnels en activité.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
             <span className="bg-[#141414] border border-border/10 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:text-primary transition-colors cursor-default"> 🚜 Logistique</span>
              <span className="bg-[#141414] border border-border/10 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:text-primary transition-colors cursor-default">🩺 Santé</span>
              <span className="bg-[#141414] border border-border/10 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:text-primary transition-colors cursor-default">💻 Technologies & Industrie</span>
              <span className="bg-[#141414] border border-border/10 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:text-primary transition-colors cursor-default">🎨 Culture & Education</span>
              <span className="bg-[#141414] border border-border/10 px-3.5 py-1.5 rounded-full text-xs font-semibold hover:text-primary transition-colors cursor-default">⚖️ Gestion & Droit</span>
            </div>

            <Link href="#form">
              <Button size="pill" variant="default" className="px-8 shadow-[0_6px_25px_rgba(212,175,55,0.3)]">
                CHOISIR MON PÔLE & M'INSCRIRE
              </Button>
            </Link>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE CARD GRID BY TABS */}
        <section className="w-full py-20 bg-[#0F0F0F] relative border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Immersion interactive</span>
              <h2 className="font-serif text-3xl font-bold mt-2">Détails des Pôles</h2>
              <p className="text-xs text-muted-foreground mt-2">Sélectionne un pôle ci-dessous pour découvrir le programme de la journée d'immersion.</p>
            </div>

            {/* Radix styled custom Tabs */}
            <Tabs defaultValue="sante" className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-10">
                <TabsList className="flex-wrap h-auto p-1.5">
                     <TabsTrigger value="logistique" onClick={() => setActivePole("sante")} className="px-5 py-2.5">
                     🚜 Logistique
                  </TabsTrigger>
                  <TabsTrigger value="sante" onClick={() => setActivePole("sante")} className="px-5 py-2.5">
                    🩺 Santé
                  </TabsTrigger>
                  <TabsTrigger value="tech" onClick={() => setActivePole("tech")} className="px-5 py-2.5">
                    💻 Technologies & Industrie
                  </TabsTrigger>
                  <TabsTrigger value="arts" onClick={() => setActivePole("arts")} className="px-5 py-2.5">
                    🎨 Culture
                  </TabsTrigger>
                  <TabsTrigger value="business" onClick={() => setActivePole("business")} className="px-5 py-2.5">
                    ⚖️ Gestion, Management & Droit
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Dynamic content area based on state */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-card p-8 rounded-3xl border border-border/15 shadow-2xl items-start">
                {/* Left block: timeline */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    {currentPole.icon}
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      {currentPole.title}
                    </h3>
                  </div>
                  <div className="text-xs font-semibold text-[#1D9E75] uppercase tracking-wider">
                    {currentPole.sub}
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-border/10">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                      Déroulement de la Session
                    </span>
                    <div className="relative pl-6 border-l border-l-primary/30 space-y-5">
                      {currentPole.timeline.map((t, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-[29px] top-1 h-3.5 w-3.5 rounded-full bg-[#0F0F0F] border border-primary flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-primary font-mono">{t.time}</span>
                            <p className="text-xs text-foreground/95 font-medium mt-0.5">{t.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right block: mentors profiles */}
                <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-l-border/10 lg:pl-8">
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                      Disponibilité & Inscription
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider animate-pulse">
                        ⚠️ Seulement {currentPole.spots} places restantes
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                      Mentors Présents
                    </span>
                    <div className="space-y-3">
                      {currentPole.mentors.map((m, idx) => (
                        <Card key={idx} hoverEffect={false} className="border-border/10 bg-[#0F0F0F] p-4 rounded-xl flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif font-extrabold text-xs">
                            K
                          </div>
                          <div>
                            <h4 className="font-serif text-xs font-bold text-foreground">{m.name}</h4>
                            <p className="text-[10px] text-muted-foreground">{m.role}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="#form" className="w-full">
                      <Button variant="default" className="w-full rounded-xl py-3 font-bold text-xs uppercase tracking-wider">
                        S'INSCRIRE À CE PÔLE
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </section>

        {/* SECTION 7: FOIRE AUX MÉTIERS */}
        <section className="w-full py-20 bg-background relative border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Forum d'Échange</span>
              <h2 className="font-serif text-3xl font-bold mt-2">Foire aux Métiers</h2>
              <p className="text-xs text-muted-foreground mt-2">Plus de 30 entreprises et universités locales se réunissent pour te guider.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <Card hoverEffect={true} className="border-border/10 bg-card/45">
                <CardHeader className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl">
                    🏢
                  </div>
                  <CardTitle className="font-serif text-base font-bold mt-4">Rencontre des Entreprises</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-xs text-muted-foreground leading-relaxed">
                  Discute en direct avec des chefs de projets d'entreprises à Pointe-Noire. Pose des questions sur leurs parcours professionnels, obtiens des conseils et décroche des stages de découverte pendant tes vacances.
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card hoverEffect={true} className="border-border/10 bg-card/45">
                <CardHeader className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-[#1D9E75]/10 border border-[#1D9E75]/20 flex items-center justify-center text-[#1D9E75] text-xl">
                    🏫
                  </div>
                  <CardTitle className="font-serif text-base font-bold mt-4">Salons d'Universités</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-xs text-muted-foreground leading-relaxed">
                  Prends connaissance des filières proposées par des grandes écoles partenaires d'Afrique (Dakar, Côte d'Ivoire, Maroc) et d'Europe. Compare les opportunités et trouve l'école idéale.
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card hoverEffect={true} className="border-border/10 bg-card/45">
                <CardHeader className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-[#C4622D]/10 border border-[#C4622D]/20 flex items-center justify-center text-[#C4622D] text-xl">
                    🤝
                  </div>
                  <CardTitle className="font-serif text-base font-bold mt-4">Mentorat & Coaching</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-xs text-muted-foreground leading-relaxed">
                  Rejoins officiellement notre grand programme de parrainage. Bénéficie des conseils bienveillants d'anciens lauréats de KTE aujourd'hui insérés brillamment dans le monde du travail.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        

        {/* SECTION 9: REGISTRATION FORM */}
        <section id="form" className="w-full py-20 bg-background relative border-t border-border/10">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Candidatures</span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">Réserve ta Session JPO</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Remplis le formulaire d'inscription ci-dessous. Nous te contacterons par e-mail et WhatsApp pour valider ton invitation d'immersion.
              </p>
            </div>

            <form onSubmit={handleBooking} className="space-y-6 bg-[#141414] p-8 rounded-3xl border border-border/15 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Nom complet *</label>
                  <Input
                    placeholder="Ex: Marc Loussou"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Téléphone (WhatsApp) *</label>
                  <Input
                    type="tel"
                    placeholder="Ex: +242 06 912 3456"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Adresse E-mail *</label>
                  <Input
                    type="email"
                    placeholder="Ex: marclouss@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Lycée actuel *</label>
                  <Input
                    placeholder="Ex: Lycée Technique"
                    value={formData.lycee}
                    onChange={(e) => setFormData({ ...formData, lycee: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Classe *</label>
                  <Select
                    value={formData.classe}
                    onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                    options={[
                      { value: "Terminale D", label: "Terminale D" },
                      { value: "Terminale C", label: "Terminale C" },
                      { value: "Terminale A", label: "Terminale A" },
                      { value: "Terminale G", label: "Terminale G" },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Pôle d'Immersion *</label>
                  <Select
                    value={formData.pole}
                    onChange={(e) => setFormData({ ...formData, pole: e.target.value })}
                    options={[
                      { value: "Logistique", label: " 🚜 Pôle Logistique" },
                      { value: "sante", label: "🩺 Pôle Santé" },
                      { value: "tech", label: "💻 Pôle Technologies & Industrie" },
                      { value: "arts", label: "🎨 Pôle Culture & Education" },
                      { value: "business", label: "⚖️ Pôle Gestion & Droit" },
                    ]}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Session Choisie *</label>
                  <Select
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    options={[
                      { value: "Matin (09h - 12h)", label: "Matin (09h - 12h)" },
                      { value: "Après-midi (14h - 17h)", label: "Après-midi (14h - 17h)" },
                    ]}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Source d'Information *</label>
                  <Select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    options={[
                      { value: "Facebook", label: "Facebook" },
                      { value: "Caravane au lycée", label: "Passage de la Caravane" },
                      { value: "Bouche à oreille", label: "Un ami / Professeur" },
                      { value: "WhatsApp", label: "Groupe WhatsApp" },
                    ]}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/10 flex flex-col sm:flex-row gap-4">
                <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-center rounded-full font-bold">
                  {isSubmitting ? "Enregistrement en cours..." : "RÉSERVER MA PLACE JPO"}
                </Button>
                <a
                  href="https://wa.me/242053287181"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#1D9E75] hover:bg-[#1D9E75]/15 text-[#1D9E75] py-3 px-6 text-sm font-bold tracking-wide transition-all shadow-[0_4px_15px_rgba(29,158,117,0.3)] shrink-0"
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span>Assistance direct</span>
                </a>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
