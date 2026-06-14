"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Truck, Heart, Laptop, Image as Paintbrush, Scale, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

type PoleKey = "Logistique" | "sante" | "tech" | "arts" | "business";

const poleDetails: Record<PoleKey, any> = {
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
  const [activePole, setActivePole] = useState<PoleKey>("sante");
  const [formData, setFormData] = useState({
    nom: "", telephone: "", email: "", lycee: "", classe: "Terminale D",
    pole: "sante", session: "Matin (09h - 12h)", source: "Facebook"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const currentPole = poleDetails[activePole];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inscription-jpo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) toast({ title: "Validé !", description: "Inscription confirmée." });
      else throw new Error("Erreur serveur");
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen text-foreground pt-20">
      <Navbar />
      <main>
        {/* HERO */}
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold">Passe une journée à te renseigner</h1>
        </section>

        {/* PÔLES */}
        <section className="py-20 bg-[#0F0F0F]">
          <Tabs defaultValue="sante" className="max-w-4xl mx-auto">
            <TabsList className="flex justify-center mb-10">
              {Object.keys(poleDetails).map((key) => (
                <TabsTrigger key={key} value={key} onClick={() => setActivePole(key as PoleKey)}>
                  {poleDetails[key as PoleKey].title}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-card p-8 rounded-3xl border">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">{currentPole.icon} <h3 className="text-2xl font-bold">{currentPole.title}</h3></div>
                <div className="relative pl-6 border-l space-y-4">
                  {currentPole.timeline.map((t: any, i: number) => (
                    <div key={i}><span className="text-xs text-primary">{t.time}</span><p>{t.label}</p></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 space-y-6">
                <Badge>⚠️ {currentPole.spots} places</Badge>
                {currentPole.mentors.map((m: any, i: number) => (
                  <Card key={i} className="p-4 bg-background">{m.name} - {m.role}</Card>
                ))}
                <Button className="w-full" onClick={() => document.getElementById("form")?.scrollIntoView()}>S'INSCRIRE</Button>
              </div>
            </div>
          </Tabs>
        </section>

        {/* FORMULAIRE */}
        <section id="form" className="py-20 max-w-3xl mx-auto">
          <form onSubmit={handleBooking} className="space-y-4 p-8 bg-[#141414] rounded-3xl">
            <Input placeholder="Nom complet" onChange={(e) => setFormData({...formData, nom: e.target.value})} required />
            <Input placeholder="Téléphone" onChange={(e) => setFormData({...formData, telephone: e.target.value})} required />
            <Button type="submit" disabled={isSubmitting}>S'INSCRIRE</Button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}