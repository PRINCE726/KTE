"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const getPageTitle = (pathname: string) => {
  if (pathname === "/admin") return "Vue Générale";
  if (pathname.includes("/admin/inscriptions-gala")) return "Inscriptions Gala";
  if (pathname.includes("/admin/inscriptions-jpo")) return "Inscriptions JPO";
  if (pathname.includes("/admin/caravane")) return "Demandes Caravane";
  if (pathname.includes("/admin/newsletter")) return "Newsletter";
  if (pathname.includes("/admin/articles")) return "Articles & Actualités";
  if (pathname.includes("/admin/galeries")) return "Galeries Photos";
  if (pathname.includes("/admin/evenements")) return "Événements";
  if (pathname.includes("/admin/parametres")) return "Paramètres";
  return "Administration";
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname || "");
  const currentDate = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <header className="h-16 px-6 md:px-10 flex items-center justify-between border-b border-[#E5E3DD] bg-white sticky top-0 z-30 shadow-sm">
      <h1 className="font-serif text-xl md:text-2xl font-bold text-[#1A1A1A] truncate pr-4">
        {title}
      </h1>
      
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-semibold text-[#1A1A1A]">Bonjour Ruth 👋</span>
          <span className="text-[10px] text-[#666666] capitalize">{currentDate}</span>
        </div>
        <div className="h-8 w-px bg-[#E5E3DD] hidden md:block"></div>
        <button className="relative p-2 rounded-full hover:bg-[#F8F7F4] transition-colors text-[#666666]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C4622D] border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
