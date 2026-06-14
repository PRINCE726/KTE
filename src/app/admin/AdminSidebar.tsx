"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Ticket, Calendar, Bus, Mail, 
  FileText, Image as ImageIcon, CalendarDays, Settings, 
  LogOut, Menu, X, Plus, Users, Briefcase, Camera 
} from "lucide-react";
import { useAdminTheme } from "@/components/admin/AdminThemeProvider";

const NAV_GROUPS = [
  {
    title: "TABLEAU DE BORD",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ]
  },
  {
    title: "INSCRIPTIONS",
    items: [
      { label: "Gala", href: "/admin/inscriptions-gala", icon: Ticket },
      { label: "JPO", href: "/admin/inscriptions-jpo", icon: Calendar },
      { label: "Caravane", href: "/admin/caravane", icon: Bus },
      { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ]
  },
  {
    title: "CONTENU",
    items: [
      { label: "Articles", href: "/admin/articles", icon: FileText },
      { label: "Galeries", href: "/admin/galeries", icon: ImageIcon },
      { label: "Événements", href: "/admin/evenements", icon: CalendarDays },
      { label: "Partenaires", href: "/admin/partenaires", icon: Users },
      { label: "JPO Sessions", href: "/admin/jpo-sessions", icon: Briefcase },
      { label: "Photos Caravane", href: "/admin/caravane-photos", icon: Camera },
    ]
  },
  {
    title: "PARAMÈTRES",
    items: [
      { label: "Paramètres", href: "/admin/parametres", icon: Settings },
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useAdminTheme();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const closeSidebar = () => setIsOpen(false);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#111111] text-[#F5F5F5] w-full overflow-y-auto font-sans">
      {/* Header */}
      <div className="p-[20px_16px] flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] shrink-0">
        <div className="flex items-center gap-[10px]">
          <div className="w-[32px] h-[32px] bg-[#C9A84C] rounded-[6px] flex items-center justify-center font-serif font-black text-[16px] text-[#0A0A0A]">
            K
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-[#F5F5F5] leading-tight">Kimia Events</span>
            <span className="text-[10px] text-[#666666] uppercase tracking-[0.1em] leading-none mt-0.5">Administration</span>
          </div>
        </div>
        <div className="w-[8px] h-[8px] rounded-full bg-[#1D9E75] animate-pulse shrink-0" />
      </div>

      {/* Button Nouveau */}
      <div className="px-3 pt-4 shrink-0">
        <Link 
          href="/admin/articles/new"
          onClick={closeSidebar}
          className="flex items-center gap-[8px] p-[10px_16px] bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] rounded-[8px] hover:bg-[#252525] transition-colors group w-full"
        >
          <Plus className="w-[14px] h-[14px] text-[#C9A84C] shrink-0" />
          <span className="font-sans font-light text-[13px] text-[#AAAAAA] group-hover:text-[#F5F5F5] transition-colors">
            Création rapide
          </span>
        </Link>
      </div>

      {/* Navigation Groupée */}
      <div className="flex-1 py-4 space-y-6">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="px-3">
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#444444] font-bold px-3 mb-[6px] mt-[24px]">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-[10px] p-[9px_12px] rounded-[6px] text-[13px] font-sans transition-all duration-200 border-l-2 ${
                        isActive
                          ? "bg-[#1A1A1A] text-[#C9A84C] border-l-[#C9A84C]"
                          : "text-[#888888] hover:bg-[#1A1A1A] hover:text-[#F5F5F5] border-l-transparent"
                      }`}
                    >
                      <Icon className="w-[15px] h-[15px] shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Toggle Thème */}
      <div className="p-[12px_16px] flex items-center justify-between border-t border-[rgba(255,255,255,0.06)] shrink-0">
        <span className="font-sans font-light text-[12px] text-[#666666]">Thème sombre</span>
        <div 
          onClick={toggleTheme}
          className={`w-[40px] h-[22px] rounded-full relative cursor-pointer transition-all duration-300 ${
            theme === "dark" ? "bg-[#333333]" : "bg-[#C9A84C]"
          }`}
        >
          <div 
            className={`w-[18px] h-[18px] bg-white rounded-full absolute top-[2px] transition-transform duration-300 ${
              theme === "dark" ? "translate-x-[2px]" : "translate-x-[20px]"
            }`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[rgba(255,255,255,0.06)] p-[16px] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-[10px]">
          <div className="w-[32px] h-[32px] rounded-full bg-[#C9A84C] flex items-center justify-center font-bold text-[14px] text-[#0A0A0A] shrink-0">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-[#F5F5F5] leading-tight">Admin KTE</span>
            <span className="text-[11px] text-[#1D9E75] leading-none mt-0.5">Connecté</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-1 text-[#666666] hover:text-[#C4622D] transition-colors"
          title="Déconnexion"
        >
          <LogOut className="w-[16px] h-[16px]" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 h-12 w-12 bg-[#111111] border border-[rgba(201,168,76,0.3)] text-white rounded-full flex items-center justify-center shadow-xl z-40 cursor-pointer"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen w-[240px] border-r border-[rgba(255,255,255,0.06)] bg-[#111111] z-30">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSidebar} />
          <div className="relative w-[260px] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <button
              onClick={closeSidebar}
              className="absolute top-4 -right-12 h-10 w-10 bg-[#111111] border-r border-t border-b border-[rgba(255,255,255,0.06)] text-white flex items-center justify-center rounded-r-xl cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
