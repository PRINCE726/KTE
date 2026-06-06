"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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

  const navLinks = [
    { name: "L'Agence", href: "/#agence" },
    { name: "Gala 2026", href: "/gala" },
    { name: "Caravane", href: "/caravane" },
    { name: "JPO & Métiers", href: "/jpo" },
    { name: "Actualités", href: "/actualites" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0A0A0A] border-b border-[#C9A84C]/30 h-16 md:h-20 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Logo */}
          <Logo/>

          {/* Center: Desktop Nav Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-xs uppercase tracking-[0.12em] font-sans font-light text-[#F5F0E8]/70 transition-colors duration-300 hover:text-[#C9A84C]",
                    isActive && "text-[#C9A84C] opacity-100"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Desktop CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* CTA button (always visible) */}
            <Link href="/gala#tickets">
              <span className="inline-block bg-[#C9A84C] text-[#0A0A0A] text-xs font-sans font-semibold py-[10px] px-[24px] rounded-full hover:bg-transparent hover:border-[#C9A84C] hover:text-[#C9A84C] border border-transparent transition-all duration-300 select-none cursor-pointer">
                Obtenir mon Pass
              </span>
            </Link>

            {/* Hamburger Button (Mobile only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#F5F0E8] hover:text-[#C9A84C] transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#0A0A0A] border-t border-[#C9A84C] py-6 px-6 lg:hidden flex flex-col gap-6 shadow-xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href.startsWith("/#") && pathname === "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-sm uppercase tracking-[0.12em] font-sans font-light text-[#F5F0E8]/70 transition-colors duration-300 hover:text-[#C9A84C] py-2",
                    isActive && "text-[#C9A84C] opacity-100"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
