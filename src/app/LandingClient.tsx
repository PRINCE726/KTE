"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Truck, 
  Scale, 
  Heart, 
  GraduationCap, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight 
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Partners List
const partnersList = [
  "Prescom Media",
  "Dametis",
  "AGL Africa Global Logistics",
  "Edutech Congo",
  "C2 Business Campus",
  "Twins Events",
  "Journal Fondation",
  "Ordre des Avocats du Congo",
  "A3 Services",
  "NTI Media",
  "FEC",
  "AFI-L'UE Business School",
  "Banque Postale du Congo",
  "Vival",
  "Women in Logistics Africa",
  "Africa Campus"
];

// 10 Gala Photos
const galaPhotos = [
  "/images/gala/gala-salle-diner-1.webp",
  "/images/gala/gala-salle-diner-2.webp",
  "/images/gala/gala-networking.webp",
  "/images/gala/gala-remise-bourse-1.webp",
  "/images/gala/gala-remise-bourse-2.webp",
  "/images/gala/gala-remise-laptop.webp",
  "/images/gala/gala-remise-smartphone.webp",
  "/images/gala/gala-remise-tablette.webp",
  "/images/gala/gala-tombola.webp",
  "/images/gala/gala-interview-nti.webp"
];

// Caravane Field Photos (Grid Section 6)
const caravaneGridPhotos = [
  "/images/caravane/caravane-equipe-terrain.webp",
  "/images/caravane/caravane-groupe-lycee.webp",
  "/images/gala/gala-interview-nti.webp",
  "/images/gala/gala-networking.webp",
  "/images/gala/gala-remise-bourse-1.webp",
  "/images/gala/gala-tombola.webp"
];

export default function LandingClient({ initialGalaPhotos }: { initialGalaPhotos?: any[] }) {
  const [activeGalaIdx, setActiveGalaIdx] = useState(0);
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // Auto-advance Gala Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGalaIdx((prev) => (prev + 1) % galaPhotos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch articles from Supabase
  useEffect(() => {
    async function fetchArticles() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("articles")
          .select("id, titre, excerpt, categorie, created_at, published_at, image_url, slug")
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) {
          console.error("Error fetching articles:", error);
        } else if (data && data.length > 0) {
          setArticles(data.map((item: any) => ({
            id: item.id,
            titre: item.titre,
            extrait: item.excerpt || "",
            categorie: item.categorie || "Actualités",
            date: item.published_at 
              ? new Date(item.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
              : new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
            image_url: item.image_url || "/images/gala/gala-salle-diner-1.webp",
            slug: item.slug
          })));
          setLoadingArticles(false);
          return;
        }
      } catch (err) {
        console.error("Failed to load articles:", err);
      }

      // Fallback articles
      setArticles([
        {
          id: "art-1",
          titre: "Partenariat d'excellence: Fondation Horizon × KTE",
          date: "04 Avr 2026",
          categorie: "Partenariats",
          extrait: "La Fondation Horizon s'allie avec Kimia Events Team pour financer 10 bourses d'études complètes pour l'année universitaire 2026-2027.",
          image_url: "/images/gala/gala-salle-diner-1.webp",
          slug: "partenariat-fondation-horizon-kte"
        },
        {
          id: "art-2",
          titre: "Bilan du Gala des Bacheliers - Édition 3 (2024)",
          date: "Août 2024",
          categorie: "Gala",
          extrait: "Retour en images et en chiffres sur la troisième édition du Gala qui a réuni plus de 450 bacheliers de la République du Congo.",
          image_url: "/images/gala/gala-salle-diner-2.webp",
          slug: "bilan-gala-bacheliers-edition-3"
        },
        {
          id: "art-3",
          titre: "La Caravane KTE fait escale à Mvou-Mvou",
          date: "8 Fév 2026",
          categorie: "Caravane",
          extrait: "Plus de 1200 élèves des lycées publics et privés de l'arrondissement 3 Mvou-Mvou ont bénéficié de nos ateliers d'orientation gratuits.",
          image_url: "/images/gala/gala-interview-nti.webp",
          slug: "caravane-kte-escale-mvou-mvou"
        },
        {
          id: "art-4",
          titre: "Bourses Hilaire Mounthault 2026 : Inscris-toi !",
          date: "Avr 2026",
          categorie: "Partenariats",
          extrait: "Le programme spécial de bourses académiques en partenariat avec la famille Hilaire Mounthault est ouvert aux bacheliers de Pointe-Noire.",
          image_url: "/images/gala/gala-remise-bourse-2.webp",
          slug: "bourses-hilaire-mounthault-2026-inscriptions"
        }
      ]);
      setLoadingArticles(false);
    }

    fetchArticles();
  }, []);

  return (
    <div className="w-full bg-[#0A0A0A] min-h-screen text-[#F5F0E8] overflow-x-hidden flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full pt-16 md:pt-20">
        
        {/* SECTION 2 — HERO */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/caravane/caravane-groupe-lycee.webp" 
              alt="Bacheliers KTE" 
              fill 
              className="grayscale-[40%] brightness-[0.5] object-cover rounded-none" 
              priority 
            />
            {/* Dark gradient overlay */}
            <div 
              className="absolute inset-0 z-10" 
              style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.3), rgba(10,10,10,0.95))' }}
            />
          </div>

          {/* Centered content */}
          <div className="relative z-20 max-w-5xl mx-auto px-6 md:px-8 text-center flex flex-col items-center pt-16 md:pt-20">
            <h1 className="font-serif text-[36px] md:text-[56px] font-bold tracking-tight text-[#F5F0E8] leading-tight max-w-4xl">
              On accompagne les bacheliers congolais vers leur avenir.
            </h1>
            <div className="font-serif text-[42px] md:text-[64px] italic text-[#C9A84C] mt-2 block">
              Concrètement.
            </div>
            <p className="text-[16px] md:text-[18px] text-[#F5F0E8]/70 max-w-2xl mt-6 font-sans font-light leading-relaxed">
              Orientation, événements et opportunités pour les étudiants de Pointe-Noire et au-delà.
            </p>

            <div className="text-align: center; margin-top: 20px; flex flex-row items-center justify-center gap-3 w-full mt-6 px-4 ">
              <Link href="/#agence" className="w-full sm:w-auto">
                <span className="inline-block w-full bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold py-3.5 px-8 rounded-full border border-transparent transition-all duration-300 text-center cursor-pointer">
                  Découvrir KTE
                </span>
              </Link>
              <Link href="/gala" className="w-full sm:w-auto">
                <span className="inline-block w-full bg-transparent text-[#C9A84C] text-sm font-semibold py-3.5 px-8 rounded-full border border-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 text-center cursor-pointer">
                  Obtenir mon Pass
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 3 — QUI SOMMES-NOUS */}
        <section id="agence" className="w-full py-12 md:py-20 bg-[#0A0A0A] border-t border-[#C9A84C]">
          <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
            <p className="text-[16px] font-sans font-light uppercase tracking-[0.2em] text-[#C9A84C] mb-8">
              QUI SOMMES-NOUS
            </p>
            <div className="max-w-[680px]">
              <h2 className="font-serif italic text-[13px] md:text-[22px] text-[#F5F0E8] font-normal leading-relaxed">
                Kimia Events Team c'est une agence evenmentielle qui croient que chaque bachelier mérite un accompagnement sérieux.
              </h2>
              <p className="font-sans font-light text-[13px] text-[#F5F0E8]/70 mt-4 leading-relaxed">
                On organise des événements, on va dans les lycées, on connecte les jeunes aux bonnes personnes.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4 — GALA DES BACHELIERS 2026 */}
        <section id="gala" className="w-full py-12 md:py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <p className="text-[12px] font-sans font-light uppercase tracking-[0.2em] text-[#C9A84C] mb-3">
              ÉVÉNEMENT SIGNATURE
            </p>
            <h2 className="font-serif text-[32px] md:text-[48px] font-bold text-[#F5F0E8] mb-10 leading-tight">
              Gala des Bacheliers 2026
            </h2>

            {/* Slider/Carousel */}
            <div className="relative w-full h-[250px] md:h-[400px] overflow-hidden bg-[#141414]">
              <div 
                className="flex h-full w-full transition-transform duration-[700ms] ease-in-out"
                style={{ transform: `translateX(-${activeGalaIdx * 100}%)` }}
              >
                {galaPhotos.map((photo, i) => (
                  <div 
                    key={i} 
                    className="w-full h-full flex-shrink-0 relative"
                  >
                    <Image 
                      src={photo} 
                      alt={`Gala Slide ${i + 1}`} 
                      fill 
                      className="grayscale-[20%] brightness-[0.8] object-cover rounded-none" 
                    />
                  </div>
                ))}
              </div>

              {/* Slider dots overlay */}
              <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                {galaPhotos.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveGalaIdx(i)}
                    className={`h-2 w-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeGalaIdx ? "bg-[#C9A84C] w-6" : "bg-[#F5F0E8]/40"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Content Details Below Slider */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start">
              <div className="lg:col-span-8 space-y-4">
                <h3 className="font-serif text-[18px] font-bold text-[#C9A84C]">
                  11 Juillet 2026 — Pointe-Noire
                </h3>
                <p className="text-base text-[#F5F0E8]/80 font-sans font-light max-w-2xl leading-relaxed">
                  Une soirée pour reconnaître le travail des meilleurs bacheliers. Pas juste une fête — un moment qui compte.
                </p>

                {/* Bullet List */}
                <ul className="space-y-3 pt-4 font-sans font-light text-sm md:text-base text-[#F5F0E8]/70">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Remise de diplômes d'honneur</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dîner de gala gastronomique</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Networking avec des professionnels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Soirée exclusive</span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-4 lg:flex lg:justify-end lg:pt-6 w-full">
                <Link href="/gala" className="w-full sm:w-auto">
                  <span className="inline-block w-full sm:w-auto bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold py-3.5 px-8 rounded-full border border-transparent hover:bg-transparent hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 text-center cursor-pointer">
                    Obtenir mon Pass Gala
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — CARAVANE */}
        <section id="caravane" className="relative h-[70vh] md:h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
          {/* Background image */}
          <div className=" inset-0 z-0">
            <Image 
              src="/images/caravane/caravane-groupe-lycee.webp" 
              alt="Caravane KTE Lycées" 
              fill 
              className="grayscale-[20%] brightness-[0.4] object-cover rounded-none" 
            />
            {/* Dark 65% opacity overlay */}
            <div className="absolute inset-0 bg-[#0A0A0A]/65 z-10" />
          </div>

          {/* Centered content */}
          <div className="relative z-20 max-w-4xl mx-auto px-6 md:px-8 text-center flex flex-col items-center">
            <h2 className="font-serif text-[34px] md:text-[52px] font-bold tracking-tight text-[#F5F0E8] leading-tight">
              On se déplace dans ton lycée.
              <span className="block mt-2">Dans ton lycée.</span>
              <span className="block font-serif italic text-[38px] md:text-[56px] text-[#C9A84C] mt-2">Gratuitement.</span>
            </h2>
            <p className="text-sm md:text-base text-[#F5F0E8]/70 max-w-[560px] mt-6 font-sans font-light leading-relaxed">
              Nos conseillers viennent à toi pour t'aider à choisir ta filière, comprendre les bourses et préparer ton après-bac.
            </p>

            <Link href="/caravane">
              <span className="inline-block bg-transparent text-[#C9A84C] text-sm font-semibold py-3 px-7 rounded-full border border-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 mt-8 cursor-pointer">
                Faire venir la Caravane
              </span>
            </Link>
          </div>
        </section>

        {/* SECTION 6 — GALERIE PHOTOS TERRAIN */}
        <section className="w-full py-8 md:py-12 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {caravaneGridPhotos.map((photo, i) => (
                <div key={i} className="relative aspect-square w-full overflow-hidden bg-[#141414]">
                  <Image 
                    src={photo} 
                    alt={`Field Photo ${i + 1}`} 
                    fill 
                    className="grayscale-[30%] brightness-[0.75] object-cover rounded-none transition-all duration-[400ms] hover:scale-105 hover:grayscale-0 hover:brightness-100" 
                  />
                </div>
              ))}
            </div>
            <div className="h-px bg-[#C9A84C] w-full mt-12" />
          </div>
        </section>

        {/* SECTION 7 — JPO & MÉTIERS 2026 */}
        <section id="jpo" className="w-full py-12 md:py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            {/* Header */}
            <div className="mb-12">
              <div className="text-xs uppercase tracking-[0.15em] text-[#C9A84C] font-semibold mb-3">
                JPO & MÉTIERS
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F0E8] mb-4">
                Viens découvrir les métiers qui recrutent.
              </h2>
              <p className="text-sm sm:text-base text-[#F5F0E8]/70 max-w-xl font-light leading-relaxed mb-2">
                Pose tes questions à des professionnels en face à face.
              </p>
              <p className="text-[14px] font-sans font-light text-[#C9A84C]">
                Socoprise Business Campus — 05 328 71 81
              </p>
            </div>

            {/* 5 Stacked Vertical Cards */}
            <div className="flex flex-col gap-[4px] w-full">
              
              {/* Card 1 */}
              <div className="relative w-full h-[220px] md:h-[280px] overflow-hidden bg-[#141414]">
                <Image 
                  src="/images/caravane/caravane-equipe-terrain.webp" 
                  alt="Logistique" 
                  fill 
                  className="grayscale-[30%] brightness-[0.5] object-cover rounded-none" 
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/70 z-10" />

                {/* Top Left Icon */}
                <div className="absolute top-6 left-6 z-20">
                  <svg className="w-8 h-8 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h10zm0 0h5l4-4v-4h-9v8z" />
                  </svg>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col items-start">
                  <div className="font-sans text-[12px] tracking-[0.15em] text-[#C9A84C] uppercase">
                    10 JUIN 2026 — 9H
                  </div>
                  <h3 className="font-serif text-[20px] md:text-[28px] font-bold text-[#F5F0E8] mt-1 leading-tight">
                    Métiers de la Logistique
                  </h3>
                  <Link href="/jpo">
                    <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-xs font-semibold py-2.5 px-6 rounded-full hover:bg-transparent hover:border-[#C9A84C] hover:text-[#C9A84C] border border-transparent transition-all duration-300 mt-3 cursor-pointer">
                      S'inscrire à la session
                    </span>
                  </Link>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative w-full h-[220px] md:h-[280px] overflow-hidden bg-[#141414]">
                <Image 
                  src="/images/gala/gala-networking.webp" 
                  alt="Gestion, Management & Droit" 
                  fill 
                  className="grayscale-[30%] brightness-[0.5] object-cover rounded-none" 
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/70 z-10" />

                {/* Top Left Icon */}
                <div className="absolute top-6 left-6 z-20">
                  <svg className="w-8 h-8 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M3 7h18M6 7l3 6h-6l3-6zm12 0l3 6h-6l3-6z" />
                  </svg>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col items-start">
                  <div className="font-sans text-[12px] tracking-[0.15em] text-[#C9A84C] uppercase">
                    16 JUIN 2026 — 9H
                  </div>
                  <h3 className="font-serif text-[20px] md:text-[28px] font-bold text-[#F5F0E8] mt-1 leading-tight">
                    Gestion, Management & Droit
                  </h3>
                  <Link href="/jpo">
                    <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-xs font-semibold py-2.5 px-6 rounded-full hover:bg-transparent hover:border-[#C9A84C] hover:text-[#C9A84C] border border-transparent transition-all duration-300 mt-3 cursor-pointer">
                      S'inscrire à la session
                    </span>
                  </Link>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative w-full h-[220px] md:h-[280px] overflow-hidden bg-[#141414]">
                <Image 
                  src="/images/gala/gala-remise-bourse-2.webp" 
                  alt="Santé" 
                  fill 
                  className="grayscale-[30%] brightness-[0.5] object-cover rounded-none" 
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/70 z-10" />

                {/* Top Left Icon */}
                <div className="absolute top-6 left-6 z-20">
                  <svg className="w-8 h-8 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col items-start">
                  <div className="font-sans text-[12px] tracking-[0.15em] text-[#C9A84C] uppercase">
                    20 JUIN 2026 — 9H
                  </div>
                  <h3 className="font-serif text-[20px] md:text-[28px] font-bold text-[#F5F0E8] mt-1 leading-tight">
                    Métiers de la Santé
                  </h3>
                  <Link href="/jpo">
                    <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-xs font-semibold py-2.5 px-6 rounded-full hover:bg-transparent hover:border-[#C9A84C] hover:text-[#C9A84C] border border-transparent transition-all duration-300 mt-3 cursor-pointer">
                      S'inscrire à la session
                    </span>
                  </Link>
                </div>
              </div>

              {/* Card 4 */}
              <div className="relative w-full h-[220px] md:h-[280px] overflow-hidden bg-[#141414]">
                <Image 
                  src="/images/gala/gala-remise-bourse-1.webp" 
                  alt="Education" 
                  fill 
                  className="grayscale-[30%] brightness-[0.5] object-cover rounded-none" 
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/70 z-10" />

                {/* Top Left Icon */}
                <div className="absolute top-6 left-6 z-20">
                  <svg className="w-8 h-8 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6a2 2 0 004 0v-6M3 9v6a1 1 0 001 1h2" />
                  </svg>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col items-start">
                  <div className="font-sans text-[12px] tracking-[0.15em] text-[#C9A84C] uppercase">
                    23 JUIN 2026 — 9H
                  </div>
                  <h3 className="font-serif text-[20px] md:text-[28px] font-bold text-[#F5F0E8] mt-1 leading-tight">
                    Culturel, Social & Éducation
                  </h3>
                  <Link href="/jpo">
                    <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-xs font-semibold py-2.5 px-6 rounded-full hover:bg-transparent hover:border-[#C9A84C] hover:text-[#C9A84C] border border-transparent transition-all duration-300 mt-3 cursor-pointer">
                      S'inscrire à la session
                    </span>
                  </Link>
                </div>
              </div>

              {/* Card 5 */}
              <div className="relative w-full h-[220px] md:h-[280px] overflow-hidden bg-[#141414]">
                <Image 
                  src="/images/gala/gala-salle-diner-1.webp" 
                  alt="Industrie & Technologies" 
                  fill 
                  className="grayscale-[30%] brightness-[0.5] object-cover rounded-none" 
                />
                <div className="absolute inset-0 bg-[#0A0A0A]/70 z-10" />

                {/* Top Left Icon */}
                <div className="absolute top-6 left-6 z-20">
                  <svg className="w-8 h-8 text-[#C9A84C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 flex flex-col items-start">
                  <div className="font-sans text-[12px] tracking-[0.15em] text-[#C9A84C] uppercase">
                    26 JUIN 2026 — 9H
                  </div>
                  <h3 className="font-serif text-[20px] md:text-[28px] font-bold text-[#F5F0E8] mt-1 leading-tight">
                    Industrie & Technologies
                  </h3>
                  <Link href="/jpo">
                    <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-xs font-semibold py-2.5 px-6 rounded-full hover:bg-transparent hover:border-[#C9A84C] hover:text-[#C9A84C] border border-transparent transition-all duration-300 mt-3 cursor-pointer">
                      S'inscrire à la session
                    </span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 8 — ACTUALITÉS */}
        <section id="actualites" className="w-full py-12 md:py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            {/* Header */}
            <div className="mb-12">
              <div className="text-xs uppercase tracking-[0.15em] text-[#C9A84C] font-semibold mb-3">
                ACTUALITÉS
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F0E8] mb-4">
                Ce qui se passe chez KTE
              </h2>
              <div className="h-[1px] bg-[#C9A84C] w-full mt-12" />
            </div>

            {loadingArticles ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 animate-pulse">
                {/* Featured article skeleton */}
                <div className="lg:col-span-7 flex flex-col space-y-4">
                  <div className="w-full h-[240px] md:h-[400px] bg-[#141414]" />
                  <div className="h-4 bg-[#141414] w-1/4" />
                  <div className="h-8 bg-[#141414] w-3/4" />
                  <div className="h-4 bg-[#141414] w-5/6" />
                  <div className="h-4 bg-[#141414] w-2/3" />
                </div>
                {/* Secondary articles skeleton */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-start border-b border-[#C9A84C]/10 pb-5">
                      <div className="w-20 h-20 bg-[#141414] flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[#141414] w-1/5" />
                        <div className="h-5 bg-[#141414] w-4/5" />
                        <div className="h-3 bg-[#141414] w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                
                {/* Left/Top Column: Featured Article (takes 7 cols) */}
                {articles[0] && (
                  <div className="lg:col-span-7 flex flex-col space-y-4 group">
                    <div className="relative aspect-[16/10] w-full h-[240px] md:h-[400px] overflow-hidden bg-[#141414]">
                      <Image 
                        src={articles[0].image_url} 
                        alt={articles[0].titre} 
                        fill 
                        className="grayscale-[20%] brightness-[0.8] object-cover rounded-none transition-transform duration-500 group-hover:scale-[1.02]" 
                      />
                    </div>
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-sans font-light uppercase tracking-[0.2em] text-[#C9A84C] block mt-4">
                        {articles[0].categorie}
                      </span>
                      <h3 className="font-serif text-[24px] md:text-[32px] font-bold text-[#F5F0E8] leading-tight hover:text-[#C9A84C] transition-colors duration-300">
                        <Link href={`/actualites/${articles[0].slug || ''}`}>
                          {articles[0].titre}
                        </Link>
                      </h3>
                      <p className="font-sans font-light text-[16px] text-[#F5F0E8]/60 mt-2 line-clamp-2">
                        {articles[0].extrait}
                      </p>
                      <span className="font-sans text-[12px] text-[#666666] mt-2 block">
                        {articles[0].date}
                      </span>
                    </div>
                  </div>
                )}

                {/* Right/Bottom Column: Secondary list of 3 articles (takes 5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-start mt-8 lg:mt-0">
                  {articles.slice(1, 4).map((art, idx) => (
                    <div 
                      key={art.id || idx} 
                      className="flex gap-4 pb-5 mb-5 border-b border-[#C9A84C]/20 last:border-b-0 last:pb-0 last:mb-0 group items-start"
                    >
                      <div className="relative w-20 h-20 shrink-0 overflow-hidden bg-[#141414]">
                        <Image 
                          src={art.image_url} 
                          alt={art.titre} 
                          fill 
                          className="grayscale-[30%] object-cover rounded-none" 
                        />
                      </div>
                      <div className="flex flex-col justify-between space-y-1">
                        <div>
                          <span className="text-[10px] uppercase font-sans font-semibold text-[#C9A84C] tracking-wider mb-1 block">
                            {art.categorie}
                          </span>
                          <h4 className="font-serif text-[18px] font-bold text-[#F5F0E8] leading-snug hover:text-[#C9A84C] transition-colors duration-300 line-clamp-2">
                            <Link href={`/actualites/${art.slug || ''}`}>
                              {art.titre}
                            </Link>
                          </h4>
                        </div>
                        <span className="font-sans text-[12px] text-[#666666] mt-1 block">
                          {art.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* View journal button */}
            <div className="flex justify-center mt-8">
              <Link href="/actualites">
                <span className="inline-block bg-transparent text-[#C9A84C] text-sm font-semibold py-3 px-7 rounded-full border border-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 cursor-pointer">
                  Voir le journal
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 9 — PARTENAIRES */}
        <section id="partenaires" className="w-full py-10 md:py-16 bg-[#0A0A0A] border-t border-[#C9A84C] overflow-hidden">
          <div className="w-full">
            {/* Tag wrapped in parallel fine lines */}
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-bold text-center">
                ILS NOUS FONT CONFIANCE
              </h2>
              <div className="h-px bg-[#C9A84C] w-48 mt-3 mb-10 mx-auto" />
            </div>

            {/* Loop Marquee */}
            <div className="relative w-full overflow-hidden py-4 bg-[#0A0A0A] flex items-center">
<div className="flex animate-scroll min-w-full shrink-0 items-center justify-around gap-10">
                  {partnersList.map((partner, i) => (
                  <span 
                    key={i} 
                    className="h-10 flex items-center justify-center text-sm md:text-base font-sans font-bold tracking-[0.15em] uppercase text-[#F5F0E8] opacity-60 hover:opacity-100 hover:grayscale-0 hover:brightness-100 transition-all duration-300 select-none grayscale brightness-[2]"
                  >
                    {partner}
                  </span>
                ))}
                {/* Seamless loop duplicates */}
                {partnersList.map((partner, i) => (
                  <span 
                    key={`dup-${i}`} 
                    className="h-10 flex items-center justify-center text-sm md:text-base font-sans font-bold tracking-[0.15em] uppercase text-[#F5F0E8] opacity-60 hover:opacity-100 hover:grayscale-0 hover:brightness-100 transition-all duration-300 select-none grayscale brightness-[2]"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-px bg-[#C9A84C] w-full mt-10" />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
