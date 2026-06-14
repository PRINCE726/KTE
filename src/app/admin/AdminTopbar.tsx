"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const getPageTitle = (pathname: string) => {
  if (pathname === "/admin") return "Vue Générale";
  if (pathname.includes("/admin/inscriptions-gala")) return "Inscriptions Gala";
  if (pathname.includes("/admin/inscriptions-jpo")) return "Inscriptions JPO";
  if (pathname.includes("/admin/caravane-photos")) return "Photos Terrain Caravane";
  if (pathname.includes("/admin/caravane")) return "Demandes Caravane";
  if (pathname.includes("/admin/newsletter")) return "Newsletter";
  if (pathname.includes("/admin/articles")) return "Articles & Actualités";
  if (pathname.includes("/admin/galeries")) return "Galeries Photos";
  if (pathname.includes("/admin/evenements")) return "Événements";
  if (pathname.includes("/admin/parametres")) return "Paramètres";
  if (pathname.includes("/admin/partenaires")) return "Partenaires";
  if (pathname.includes("/admin/jpo-sessions")) return "JPO Sessions";
  return "Administration";
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname || "");
  const currentDate = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <header className="h-[56px] bg-[#111111] border-b border-[rgba(255,255,255,0.06)] sticky top-0 z-30 px-6 flex items-center justify-between font-sans">
      {/* Gauche : Titre et breadcrumb */}
      <div>
        <h1 className="font-sans font-semibold text-[15px] text-[#F5F5F5] leading-tight">
          {title}
        </h1>
        <p className="text-[11px] text-[#666666] leading-none mt-0.5">
          Administration / {title}
        </p>
      </div>
      
      {/* Droite : Actions */}
      <div className="flex items-center gap-4">
        {/* Bouton Voir le site */}
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-[6px] border border-[rgba(255,255,255,0.1)] bg-transparent rounded-[6px] px-[14px] py-[6px] text-[12px] text-[#AAAAAA] hover:bg-[#1A1A1A] hover:text-[#F5F5F5] transition-all duration-200"
        >
          <ExternalLink className="w-[13px] h-[13px]" />
          <span>Voir le site</span>
        </Link>

        {/* Séparateur */}
        <div className="w-[1px] h-[20px] bg-[rgba(255,255,255,0.08)] hidden md:block" />

        {/* Date et heure */}
        <span className="text-[12px] font-sans font-light text-[#666666] capitalize hidden md:inline">
          {currentDate}
        </span>

        {/* Séparateur */}
        <div className="w-[1px] h-[20px] bg-[rgba(255,255,255,0.08)]" />

        {/* Bouton notification */}
        <button className="relative p-2 text-[#888888] hover:text-[#F5F5F5] transition-colors cursor-pointer">
          <Bell className="w-[16px] h-[16px]" />
          <span className="absolute top-1 right-1 w-[6px] h-[6px] bg-[#C4622D] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-[30px] h-[30px] bg-[#C9A84C] rounded-full flex items-center justify-center font-bold text-[12px] text-[#0A0A0A] shrink-0">
          K
        </div>
      </div>
    </header>
  );
}
