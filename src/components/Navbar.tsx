"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEventsSubMenuOpen, setIsEventsSubMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fermer les menus si on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsEventsSubMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Les sous-pages regroupées dans le dropdown "Nos Événements"
  const eventLinks = [
    { name: "Gala 2026", href: "/gala" },
    { name: "Caravane", href: "/caravane" },
    { name: "JPO & Métiers", href: "/jpo" },
  ];

  const isEventActive = eventLinks.some(link => pathname === link.href);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#C9A84C]/15 h-16 md:h-20 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Gauche : Logo */}
          <Logo />

          {/* Centre : Desktop Navigation (4 Piliers épurés) */}
          <div className="hidden lg:flex items-center gap-10">
            {/* 1. Qui nous sommes */}
            <Link
              href="/#agence"
              className={cn(
                "text-xs uppercase tracking-[0.15em] font-sans font-light text-[#F5F0E8]/70 transition-colors duration-300 hover:text-[#C9A84C]",
                pathname === "/" && "text-[#C9A84C]"
              )}
            >
              Qui nous sommes
            </Link>

            {/* 2. Nos Événements (Dropdown) */}
            <div className="relative group py-2">
              <button
                className={cn(
                  "flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-sans font-light text-[#F5F0E8]/70 transition-colors duration-300 group-hover:text-[#C9A84C] cursor-pointer",
                  isEventActive && "text-[#C9A84C]"
                )}
              >
                Nos Événements
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#121212] border border-[#C9A84C]/20 rounded-xl p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50">
                {eventLinks.map((subLink) => (
                  <Link
                    key={subLink.name}
                    href={subLink.href}
                    className={cn(
                      "block px-4 py-2.5 text-xs uppercase tracking-[0.1em] text-[#F5F0E8]/60 hover:text-[#C9A84C] hover:bg-white/5 rounded-lg transition-colors",
                      pathname === subLink.href && "text-[#C9A84C] bg-white/5"
                    )}
                  >
                    {subLink.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. Nos Actualités */}
            <Link
              href="/actualites"
              className={cn(
                "text-xs uppercase tracking-[0.15em] font-sans font-light text-[#F5F0E8]/70 transition-colors duration-300 hover:text-[#C9A84C]",
                pathname === "/actualites" && "text-[#C9A84C]"
              )}
            >
              Nos Actualités
            </Link>

            {/* 4. Nos Partenaires */}
            <Link
              href="/#partenaires"
              className={cn(
                "text-xs uppercase tracking-[0.15em] font-sans font-light text-[#F5F0E8]/70 transition-colors duration-300 hover:text-[#C9A84C]"
              )}
            >
              Nos Partenaires
            </Link>
          </div>

          {/* Droite : CTA & Toggle Mobile */}
          <div className="flex items-center gap-4">
            <Link href="/gala#tickets" className="hidden lg:block">
              <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-xs font-sans font-bold py-[10px] px-[24px] rounded-full hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 select-none cursor-pointer">
                Obtenir mon Pass
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#F5F0E8] hover:text-[#C9A84C] transition-colors focus:outline-none cursor-pointer z-50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 📱 MENU MOBILE PLEIN ÉCRAN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#0A0A0A] pt-24 px-6 lg:hidden flex flex-col justify-between pb-12 overflow-y-auto"
          >
            {/* Liste des Liens Mobile */}
            <div className="flex flex-col gap-4">
              {/* Qui nous sommes */}
              <Link
                href="/#agence"
                className={cn(
                  "text-lg uppercase tracking-[0.12em] font-sans font-light text-[#F5F0E8]/70 py-3 border-b border-white/5",
                  pathname === "/" && "text-[#C9A84C]"
                )}
              >
                Qui nous sommes
              </Link>

              {/* Accordéon Nos Événements */}
              <div className="border-b border-white/5 py-1">
                <button
                  onClick={() => setIsEventsSubMenuOpen(!isEventsSubMenuOpen)}
                  className={cn(
                    "flex w-full items-center justify-between text-lg uppercase tracking-[0.12em] font-sans font-light text-[#F5F0E8]/70 py-2 cursor-pointer",
                    isEventActive && "text-[#C9A84C]"
                  )}
                >
                  <span>Nos Événements</span>
                  <motion.div
                    animate={{ rotate: isEventsSubMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={isEventActive ? "text-[#C9A84C]" : "text-[#F5F0E8]/50"}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isEventsSubMenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden bg-[#121212]/50 rounded-lg px-4 mt-1 mb-2"
                    >
                      <div className="flex flex-col gap-1 py-2">
                        {eventLinks.map((subLink) => (
                          <Link
                            key={subLink.name}
                            href={subLink.href}
                            className={cn(
                              "text-sm uppercase tracking-[0.1em] font-sans text-[#F5F0E8]/50 py-2.5 transition-colors hover:text-[#C9A84C]",
                              pathname === subLink.href && "text-[#C9A84C] font-normal"
                            )}
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Nos Actualités */}
              <Link
                href="/actualites"
                className={cn(
                  "text-lg uppercase tracking-[0.12em] font-sans font-light text-[#F5F0E8]/70 py-3 border-b border-white/5",
                  pathname === "/actualites" && "text-[#C9A84C]"
                )}
              >
                Nos Actualités
              </Link>

              {/* Nos Partenaires */}
              <Link
                href="/#partenaires"
                className="text-lg uppercase tracking-[0.12em] font-sans font-light text-[#F5F0E8]/70 py-3 border-b border-white/5"
              >
                Nos Partenaires
              </Link>
            </div>

            {/* CTA Mobile ancré en bas */}
            <div className="mt-8">
              <Link href="/gala#tickets">
                <span className="block w-full text-center bg-[#C9A84C] text-[#0A0A0A] text-sm uppercase tracking-[0.1em] font-sans font-bold py-4 rounded-xl active:bg-white active:text-[#0A0A0A] transition-all duration-200 select-none cursor-pointer shadow-[0_4px_20px_rgba(201,168,76,0.15)]">
                  Nous Rejoindre
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}