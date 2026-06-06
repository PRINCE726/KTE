"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-[#C9A84C] py-10 md:py-16 text-[#F5F0E8]/60 font-sans font-light text-sm">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Logo */}
          <div className="col-span-2 lg:col-span-1 flex flex-col justify-start">
                        <Logo/>

            <p className="font-sans font-light text-sm text-[#F5F0E8]/50 mt-4 leading-relaxed">
              L'agence de référence pour l'orientation et l'excellence académique congolaise.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-sans font-normal mb-4 block">
              NAVIGATION
            </span>
            <ul className="space-y-2.5 font-sans font-light text-sm text-[#F5F0E8]/60">
              <li>
                <Link href="/#agence" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  L'Agence
                </Link>
              </li>
              <li>
                <Link href="/gala" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  Gala 2026
                </Link>
              </li>
              <li>
                <Link href="/caravane" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  Caravane
                </Link>
              </li>
              <li>
                <Link href="/jpo" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  JPO & Métiers
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  Actualités
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Légal */}
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-sans font-normal mb-4 block">
              LÉGAL
            </span>
            <ul className="space-y-2.5 font-sans font-light text-sm text-[#F5F0E8]/60">
              <li>
                <Link href="/legal" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] font-sans font-normal mb-4 block">
              CONTACT
            </span>
            <ul className="space-y-2.5 font-sans font-light text-sm text-[#F5F0E8]/60">
              <li>Pointe-Noire, Congo</li>
              <li>
                <a href="mailto:kimiaprimeevents@gmail.com" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  kimiaprimeevents@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+242053287181" className="hover:text-[#F5F0E8] hover:opacity-100 transition-opacity duration-300">
                  +242 05 328 7181
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/5 pt-5 mt-10 flex justify-center items-center">
          <span className="text-xs text-[#F5F0E8]/30 tracking-wider font-sans">
            © 2026 Kimia Events Team. Tous droits réservés.
          </span>
        </div>
      </div>
    </footer>
  );
}