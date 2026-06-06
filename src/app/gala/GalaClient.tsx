"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, MapPin, Check, Image as ImageIcon, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

// Photo gallery mock items
const galleryPhotos = [
  { id: 1, label: "Dîner Prestige", url: "/images/gala/gala-salle-diner-1.webp", size: "md:col-span-2 md:row-span-2" },
  { id: 2, label: "Ambiance Salle", url: "/images/gala/gala-salle-diner-2.webp", size: "col-span-1 row-span-1" },
  { id: 3, label: "Remise Bourse - 1", url: "/images/gala/gala-remise-bourse-1.webp", size: "col-span-1 md:row-span-2" },
  { id: 4, label: "Remise Bourse - 2", url: "/images/gala/gala-remise-bourse-2.webp", size: "md:col-span-2 col-span-1 row-span-1" },
  { id: 5, label: "Remise Smartphone", url: "/images/gala/gala-remise-smartphone.webp", size: "col-span-1 row-span-1" },
  { id: 6, label: "Remise Laptop", url: "/images/gala/gala-remise-laptop.webp", size: "col-span-1 row-span-1" },
  { id: 7, label: "Remise Tablette", url: "/images/gala/gala-remise-tablette.webp", size: "md:col-span-2 md:row-span-2" },
  { id: 8, label: "Networking VIP", url: "/images/gala/gala-networking.webp", size: "col-span-1 row-span-1" },
  { id: 9, label: "La Tombola", url: "/images/gala/gala-tombola.webp", size: "col-span-1 md:row-span-2" },
  { id: 10, label: "Interview", url: "/images/gala/gala-interview-nti.webp", size: "md:col-span-2 row-span-1" },
];

export default function GalaClient({ settings, initialPhotos }: { settings: Record<string, string>, initialPhotos: any[] }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<any>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [formData, setFormData] = useState({ nom: "", email: "", telephone: "", pass: "bachelier", lycee: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const galaDate = settings.gala_date || "2026-06-28T18:00:00+01:00";
  const passBachelierPrix = settings.pass_bachelier_prix || "5000";
  const passVipPrix = settings.pass_vip_prix || "10000";
  const contactWhatsapp = settings.whatsapp || "242053287181";

  useEffect(() => {
    const targetDate = new Date(galaDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [galaDate]);

  const handleOpenLightbox = (photo: any) => {
    setActivePhoto(photo);
    setLightboxOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.telephone || !formData.email) {
      toast({
        title: "Champs manquants",
        description: "Merci de remplir tous les champs requis.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inscription-gala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Pass Réservé avec Succès ! 🎉",
          description: "Un email de confirmation t'a été envoyé. Présente-toi avec ton reçu.",
          variant: "success",
        });
        setIsSubmitOpen(false);
        setFormData({ nom: "", email: "", telephone: "", pass: "bachelier", lycee: "" });
      } else {
        throw new Error(data.error || "Une erreur est survenue.");
      }
    } catch (err: any) {
      toast({
        title: "Oups !",
        description: err.message || "Impossible d'enregistrer la réservation.",
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
        <section className="relative min-h-[90vh] w-full flex items-center justify-center py-16 overflow-hidden">
          {/* Panoramic background graphic representation */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/75 z-0" />
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 text-center flex flex-col items-center">
            <Badge variant="outline" className="px-3.5 py-1 text-xs border-primary/30 text-primary uppercase mb-6 tracking-widest bg-[#141414]/80">
              📅 5ème Édition · Juin 2026
            </Badge>

            <h1 className="font-serif text-4xl md:text-6xl font-extrabold text-foreground mb-4">
              Le Gala des Bacheliers
            </h1>
            <p className="font-serif text-xl md:text-2xl text-primary font-bold mb-6">
              La soirée prestigieuse qui récompense tes efforts.
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-12">
              Le rendez-vous annuel le plus prestigieux pour les bacheliers de Pointe-Noire. Orientation, bourses d'études, inspirants panels, dîner d'excellence et concert live d'artistes de renom.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:w-auto">
              <Button size="pill" variant="default" onClick={() => setIsSubmitOpen(true)} className="px-8 shadow-[0_6px_25px_rgba(212,175,55,0.3)]">
                RÉSERVER MON PASS
              </Button>
              <Link href="#tickets">
                <Button size="pill" variant="outline" className="px-8">
                  DÉCOUVRIR LES PASS
                </Button>
              </Link>
            </div>

            {/* Countdown Grid */}
            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl w-full bg-[#141414]/90 backdrop-blur-md p-6 rounded-2xl border border-border/15 shadow-2xl">
              <div className="flex flex-col items-center">
                <span className="font-serif text-3xl md:text-5xl font-black text-primary">
                  {timeLeft.days.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Jours</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-serif text-3xl md:text-5xl font-black text-primary">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Heures</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-serif text-3xl md:text-5xl font-black text-primary">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Min</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-serif text-3xl md:text-5xl font-black text-primary">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Sec</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WHAT IS THE GALA */}
        <section className="w-full py-20 bg-[#0F0F0F] relative border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-primary" />
                  <span className="text-xs font-bold tracking-widest text-primary uppercase">Le Concept</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-foreground">
                  Une soirée unique,
                  <br />
                  <span className="text-primary font-serif">des trajectoires de vies qui changent.</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Le Gala des Bacheliers n'est pas qu'une simple fête. C'est le point de départ d'une aventure humaine extraordinaire. Nous rassemblons des centaines de jeunes diplômés brillants avec des hauts responsables d'entreprises locales, des proviseurs d'universités prestigieuses et des parrains expérimentés.
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  C'est durant cette soirée que KTE remet officiellement ses **bourses d'études supérieures gratuites** et dote les lauréats de matériel informatique professionnel d'apprentissage (laptop, tablette, smartphone) lors de la grande tombola de solidarité.
                </p>
              </div>

              {/* Stats & Features Grid */}
              <div className="grid grid-cols-2 gap-6 bg-[#141414] p-8 rounded-2xl border border-border/10">
                <div className="space-y-1">
                  <h4 className="font-serif text-3xl font-bold text-primary">500+</h4>
                  <p className="text-xs font-bold text-foreground">Participants réunis</p>
                  <p className="text-[10px] text-muted-foreground">Une synergie d'avenir à Pointe-Noire.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-3xl font-bold text-[#1D9E75]">10+</h4>
                  <p className="text-xs font-bold text-foreground">Bourses offertes</p>
                  <p className="text-[10px] text-muted-foreground">Prises en charge académiques directes.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-3xl font-bold text-[#C4622D]">4</h4>
                  <p className="text-xs font-bold text-foreground">Éditions accomplies</p>
                  <p className="text-[10px] text-muted-foreground">Des dizaines d'alumni brillamment insérés.</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-3xl font-bold text-primary">100%</h4>
                  <p className="text-xs font-bold text-[#1D9E75] uppercase">Utile & Impactant</p>
                  <p className="text-[10px] text-muted-foreground">Chaque ticket finance une bourse d'études.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: EDITION HISTORY */}
        <section className="w-full py-20 bg-background relative border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex flex-col mb-12">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Notre Parcours</span>
              <h2 className="font-serif text-3xl font-bold mt-2">4 Éditions, 4 Succès.</h2>
              <div className="w-10 h-0.5 bg-primary mt-3" />
            </div>

            {/* Horizontal scroll cards container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Ed 1 */}
              <Card hoverEffect={false} className="bg-card/45 border-border/10">
                <CardHeader className="p-5 pb-3">
                  <Badge variant="secondary" className="w-fit text-[9px] uppercase">Édition 1 · 2021</Badge>
                  <CardTitle className="font-serif text-lg font-bold mt-2 text-foreground">La Genèse</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                  Lancement à Pointe-Noire avec 150 bacheliers. Attribution des 2 premières bourses d'études locales de KTE.
                </CardContent>
              </Card>

              {/* Ed 2 */}
              <Card hoverEffect={false} className="bg-card/45 border-border/10">
                <CardHeader className="p-5 pb-3">
                  <Badge variant="secondary" className="w-fit text-[9px] uppercase">Édition 2 · 2022</Badge>
                  <CardTitle className="font-serif text-lg font-bold mt-2 text-foreground">L'Envol</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                  300 participants. Partenariats avec des écoles au Sénégal. 5 bourses d'excellence octroyées en direct.
                </CardContent>
              </Card>

              {/* Ed 3 */}
              <Card hoverEffect={false} className="bg-card/45 border-border/10">
                <CardHeader className="p-5 pb-3">
                  <Badge variant="secondary" className="w-fit text-[9px] uppercase">Édition 3 · 2023</Badge>
                  <CardTitle className="font-serif text-lg font-bold mt-2 text-foreground">La Maturité</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                  450 participants à Canal Olympia. 8 bourses attribuées. Lancement des ateliers d'orientation pré-gala.
                </CardContent>
              </Card>

              {/* Ed 4 */}
              <Card hoverEffect={false} className="bg-card/45 border-border/10">
                <CardHeader className="p-5 pb-3">
                  <Badge variant="secondary" className="w-fit text-[9px] uppercase">Édition 4 · 2024</Badge>
                  <CardTitle className="font-serif text-lg font-bold mt-2 text-foreground">La Consécration</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                  500+ participants réunis. Remise de 10 bourses, tombolas laptops, et premier forum d'orientation JPO.
                </CardContent>
              </Card>

              {/* Ed 5 - Highlighted upcoming */}
              <Card hoverEffect={true} className="border-t-4 border-t-[#1D9E75] border-x-border/15 border-b-border/15">
                <CardHeader className="p-5 pb-3">
                  <Badge variant="green" className="w-fit text-[9px] uppercase">À VENIR · JUIN 2026</Badge>
                  <CardTitle className="font-serif text-lg font-bold mt-2 text-primary">5ème Édition</CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
                  L'édition anniversaire de prestige. 10 bourses internationales, grande tombola tech, et panel d'élite.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 4: EVENING PROGRAMME */}
        <section className="w-full py-20 bg-[#0F0F0F] relative border-t border-border/10">
          <div className="max-w-3xl mx-auto px-6 md:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Le Déroulement</span>
              <h2 className="font-serif text-3xl font-bold mt-2">Le Programme de la Soirée</h2>
            </div>

            {/* Vertical timeline */}
            <div className="relative pl-8 border-l border-l-primary/30 space-y-8">
              {/* 18h00 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-[#0F0F0F] border-2 border-primary flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary font-mono">18h00</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">Accueil & Cocktail de Prestige</p>
                  <p className="text-xs text-muted-foreground">Arrivée des bacheliers sur le tapis rouge, photocall et cocktail de bienvenue.</p>
                </div>
              </div>

              {/* 19h00 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-[#0F0F0F] border-2 border-primary flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary font-mono">19h00</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">Cérémonie d'Ouverture</p>
                  <p className="text-xs text-muted-foreground">Allocution officielle de bienvenue de l'équipe de direction de KTE.</p>
                </div>
              </div>

              {/* 19h30 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-[#0F0F0F] border-2 border-primary flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary font-mono">19h30</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">Panel Spécial Orientation & Leadership</p>
                  <p className="text-xs text-muted-foreground">Interventions inspirantes d'entrepreneurs à succès et mentors académiques de Pointe-Noire.</p>
                </div>
              </div>

              {/* 20h30 HIGHLIGHTED */}
              <div className="relative border-l-2 border-l-primary/50 pl-4 py-3 bg-[#141414] rounded-xl border border-border/10">
                <div className="absolute -left-[29px] top-4 h-8 w-8 rounded-full bg-primary flex items-center justify-center animate-pulse-ring">
                  <Check className="h-4 w-4 text-[#080808] font-bold" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary font-mono">20h30</span>
                  <Badge variant="green" className="ml-2 text-[9px] font-extrabold uppercase">Temps Fort</Badge>
                  <p className="text-sm font-extrabold text-[#F5F0E8] mt-0.5">REMISE OFFICIELLE DES BOURSES</p>
                  <p className="text-xs text-[#1D9E75] font-semibold">Cérémonie solennelle d'attribution des bourses KTE aux bacheliers méritants.</p>
                </div>
              </div>

              {/* 21h00 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-[#0F0F0F] border-2 border-primary flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary font-mono">21h00</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">Dîner de Gala & Réseautage</p>
                  <p className="text-xs text-muted-foreground">Dîner gastronomique raffiné concocté par nos traiteurs partenaires et échanges directs.</p>
                </div>
              </div>

              {/* 22h00 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-[#0F0F0F] border-2 border-primary flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary font-mono">22h00</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">Prestations Artistiques Live</p>
                  <p className="text-xs text-muted-foreground">Concert acoustique d'artistes locaux aimés de Pointe-Noire pour ambiancer la soirée.</p>
                </div>
              </div>

              {/* 22h30 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-[#0F0F0F] border-2 border-primary flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary font-mono">22h30</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">La Grande Tombola KTE</p>
                  <p className="text-xs text-muted-foreground">Tirage au sort des gagnants des lots technologiques: Laptops, Tablettes et Smartphones.</p>
                </div>
              </div>

              {/* 23h00 */}
              <div className="relative">
                <div className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full bg-[#0F0F0F] border-2 border-primary flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary font-mono">23h00</span>
                  <p className="text-sm font-bold text-foreground mt-0.5">Clôture & Séance Photos Souvenirs</p>
                  <p className="text-xs text-muted-foreground">Derniers mots de la direction et session de shooting photos avec les diplômés d'honneur.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: PASSES & PRICING */}
        <section id="tickets" className="w-full py-20 bg-background relative border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Réservations</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold mt-2">Choisis ton Pass</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Les places sont strictement limitées pour des raisons de sécurité et de confort de prestige. Réserve dès maintenant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
              {/* Pass Bachelier */}
              <Card hoverEffect={true} className="border-border/15 flex flex-col justify-between h-full bg-card/60">
                <CardHeader className="p-8">
                  <Badge variant="secondary" className="w-fit text-[10px] uppercase font-bold tracking-wider">Pass Classique</Badge>
                  <CardTitle className="font-serif text-2xl font-bold mt-4">Pass Bachelier</CardTitle>
                  <CardDescription className="text-xs">Pour tous les diplômés du Baccalauréat 2026.</CardDescription>
                  <div className="mt-4 flex items-baseline">
                    <span className="font-serif text-4xl font-extrabold text-[#F5F0E8]">{passBachelierPrix.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
                    <span className="ml-1 text-sm font-bold text-muted-foreground">FCFA</span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-4">
                  <div className="h-px bg-border/10" />
                  <ul className="space-y-3.5 text-sm">
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/90">Accès intégral à la soirée de gala</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/90">Dîner gastronomique assis inclus</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/90">1 Ticket de participation à la tombola</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/90">Kit d'orientation académique KTE offert</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0 border-none mt-0">
                  <Button variant="outline" onClick={() => { setFormData({...formData, pass: "bachelier"}); setIsSubmitOpen(true); }} className="w-full py-4 text-center rounded-full font-bold">
                    RÉSERVER MON TICKET
                  </Button>
                </CardFooter>
              </Card>

              {/* Pass VIP */}
              <Card hoverEffect={true} className="border-2 border-primary flex flex-col justify-between h-full bg-[#171717]/80 relative shadow-[0_15px_45px_rgba(212,175,55,0.08)]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="green" className="text-[10px] uppercase font-bold tracking-widest bg-[#1D9E75] text-white border-none py-1 px-4">
                    Le plus choisi
                  </Badge>
                </div>
                <CardHeader className="p-8">
                  <Badge variant="outline" className="w-fit text-[10px] uppercase font-bold tracking-wider border-primary text-primary">Prestige</Badge>
                  <CardTitle className="font-serif text-2xl font-bold mt-4">Pass VIP</CardTitle>
                  <CardDescription className="text-xs">Pour les bacheliers désireux d'excellence ou parents d'élèves.</CardDescription>
                  <div className="mt-4 flex items-baseline">
                    <span className="font-serif text-4xl font-extrabold text-primary">{passVipPrix.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
                    <span className="ml-1 text-sm font-bold text-primary">FCFA</span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-0 flex-1 space-y-4">
                  <div className="h-px bg-border/20" />
                  <ul className="space-y-3.5 text-sm">
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/90 font-semibold">Tous les avantages du Pass Classique</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/90">Placement prioritaire en Table VIP d'honneur</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/90">Réseautage exclusif direct avec mentors & sponsors</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-foreground/90">Certificat de participation nominatif officiel</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0 border-none mt-0">
                  <Button variant="default" onClick={() => { setFormData({...formData, pass: "vip"}); setIsSubmitOpen(true); }} className="w-full py-4 text-center rounded-full font-bold shadow-[0_6px_25px_rgba(212,175,55,0.35)]">
                    RÉSERVER MON PASS VIP
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Mobile Money Notice */}
            <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-[#0F0F0F] border border-border/10 text-center space-y-3 shadow-xl">
              <span className="text-xs font-bold text-[#C4622D] uppercase tracking-widest">
                Méthodes de Paiement Acceptées
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
                Tu peux payer ton pass lors de ta réservation en ligne ou en point de retrait physique agréé à Pointe-Noire par virement Mobile Money:
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-mono font-bold text-foreground">
                <span className="bg-[#141414] border border-border/10 px-3.5 py-2 rounded-lg">🟡 MTN Mobile Money: *105#</span>
                <span className="bg-[#141414] border border-border/10 px-3.5 py-2 rounded-lg">🔴 Airtel Money: *128#</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: PHOTO GALLERY */}
        <section className="w-full py-20 bg-[#0F0F0F] relative border-t border-border/10">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Album Photo</span>
              <h2 className="font-serif text-3xl font-bold mt-2">Immersion en Images</h2>
              <p className="text-xs text-muted-foreground mt-2">Vis la splendeur des éditions précédentes à travers notre galerie souvenirs.</p>
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {initialPhotos.map((photo, index) => {
                const isLarge = index === 0 || index === 6 || index === 9;
                const isTall = index === 2 || index === 8;
                const sizeClass = isLarge ? "md:col-span-2 md:row-span-2" : isTall ? "col-span-1 md:row-span-2" : "col-span-1 row-span-1";
                
                return (
                  <div
                    key={photo.id}
                    onClick={() => handleOpenLightbox(photo)}
                    className={`relative min-h-[200px] md:min-h-[250px] rounded-2xl overflow-hidden border border-border/10 bg-[#141414] shadow-xl hover:border-primary/50 group cursor-pointer transition-all duration-300 ${sizeClass}`}
                  >
                    <Image src={photo.image_url} alt={photo.legende || "Gala"} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors z-10" />
                    <div className="absolute bottom-4 left-4 z-20 space-y-1">
                      <span className="inline-flex rounded-full bg-primary/20 border border-primary/20 text-primary px-2.5 py-0.5 text-[9px] uppercase tracking-wide">
                        Gala KTE
                      </span>
                      {photo.legende && (
                        <h4 className="font-serif text-sm font-bold text-foreground">
                          {photo.legende}
                        </h4>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lightbox dialog popup */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogContent size="full" className="p-0 border-none bg-black/95">
                <div className="w-full h-full flex flex-col items-center justify-center p-8 min-h-[50vh]">
                  {activePhoto && (
                    <div className="flex flex-col items-center text-center space-y-4 max-w-xl">
                      <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center text-primary/10 border border-primary/20 shadow-2xl p-8">
                        <Image src={activePhoto.image_url} alt={activePhoto.legende || "Gala"} fill className="object-contain" />
                        <div className="absolute top-2 left-2 font-mono text-[10px] text-primary/40 z-20">KTE_GALA_ARCHIVE</div>
                        {/* Title overlay */}
                        <div className="absolute bottom-4 left-4 z-20 text-left space-y-1">
                          <Badge variant="outline" className="text-[10px] text-primary uppercase">{activePhoto.legende || "Photo"}</Badge>
                          <h4 className="text-lg font-serif font-bold text-white">Visualisation Galerie GDB</h4>
                        </div>
                      </div>
                      <p className="text-sm font-serif font-bold text-primary">{activePhoto.legende}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Kimia Events Team — Archives photographiques de Pointe-Noire, République du Congo.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setLightboxOpen(false)}>
                        Fermer la vue
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* SECTION 7: FAQ */}
        <section className="w-full py-20 bg-background relative border-t border-border/10">
          <div className="max-w-4xl mx-auto px-6 md:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Une question ?</span>
              <h2 className="font-serif text-3xl font-bold mt-2">Foire Aux Questions</h2>
            </div>

            {/* Accordion FAQ list */}
            <Accordion defaultValue="q-1">
              <AccordionItem value="q-1">
                <AccordionTrigger>Comment acheter mon pass Gala ?</AccordionTrigger>
                <AccordionContent>
                  Tu peux cliquer sur n'importe quel bouton de réservation sur cette page pour ouvrir le formulaire. Après soumission, notre équipe te contacte sur WhatsApp sous 24h pour finaliser le paiement par MTN Mobile Money ou Airtel Money et t'envoyer ton e-ticket infalsifiable, ou planifier une remise physique en main propre dans Pointe-Noire.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q-2">
                <AccordionTrigger>Quel est le Dress Code exigé pour le Gala ?</AccordionTrigger>
                <AccordionContent>
                  Prestige oblige, le dress code est strictement **Tenue de Soirée Chic**. Robe de soirée élégante pour les bachelières, et costume élégant (ou veste habillée) pour les bacheliers. Les tenues décontractées, jeans, t-shirts ou baskets de sport simples ne seront pas admis à l'entrée de la salle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q-3">
                <AccordionTrigger>Qui peut postuler pour les 10 bourses d'études ?</AccordionTrigger>
                <AccordionContent>
                  Toutes les bourses d'études KTE sont réservées en priorité aux bacheliers ayant acheté leur pass pour le gala, présents à Pointe-Noire, ayant obtenu une mention "Assez Bien", "Bien" ou "Très Bien" au Baccalauréat 2026. L'évaluation se fait via un dossier académique complet déposé en ligne après obtention du pass.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q-4">
                <AccordionTrigger>Les parents d'élèves peuvent-ils participer à la soirée ?</AccordionTrigger>
                <AccordionContent>
                  Oui, tout à fait ! Les parents d'élèves ou parrains sont les bienvenus pour célébrer la réussite de leurs enfants. Ils doivent acheter un **Pass VIP** pour avoir accès à une table d'honneur et participer aux temps forts de réseautage académique.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* BOOKING MODAL DIALOG */}
        <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
          <DialogContent size="md" className="border-primary/20 bg-[#141414] text-foreground">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-bold text-primary">Réserver un Pass Gala</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Inscris tes informations de bachelier ci-dessous. Nous finaliserons ton pass très rapidement.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBookingSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Nom complet *</label>
                <Input
                  placeholder="Ex: Grace Mavoungou"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Téléphone (WhatsApp) *</label>
                  <Input
                    type="tel"
                    placeholder="Ex: +242 05 328 7181"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Adresse E-mail *</label>
                  <Input
                    type="email"
                    placeholder="Ex: grace@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Type de Pass *</label>
                  <Select
                    value={formData.pass}
                    onChange={(e) => setFormData({ ...formData, pass: e.target.value })}
                    options={[
                      { value: "bachelier", label: "Pass Classique Class - 15 000 FCFA" },
                      { value: "vip", label: "Pass VIP Prestige - 25 000 FCFA" },
                    ]}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Lycée de provenance *</label>
                  <Input
                    placeholder="Ex: Lycée Victor Augagneur"
                    value={formData.lycee}
                    onChange={(e) => setFormData({ ...formData, lycee: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/10 flex flex-col gap-3">
                <Button type="submit" disabled={isSubmitting} className="w-full py-4 text-center rounded-full font-bold">
                  {isSubmitting ? "Traitement de ta demande..." : "VALIDER MA DEMANDE DE PASS"}
                </Button>
                <a
                  href="https://wa.me/242053287181"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[#1D9E75] hover:bg-[#1D9E75]/15 text-[#1D9E75] py-2.5 text-xs font-bold transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Discuter directement sur WhatsApp</span>
                </a>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
}
