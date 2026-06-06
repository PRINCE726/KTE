"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Ticket, Calendar, Bus, Mail, 
  FileText, Image as ImageIcon, CalendarDays, Settings, LogOut, Menu, X 
} from "lucide-react";

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

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const closeSidebar = () => setIsOpen(false);

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0F0F0F] text-[#F8F7F4] w-[260px] overflow-y-auto font-sans">
      <div className="p-6 border-b border-[#222]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-[#D4AF37] rounded flex items-center justify-center font-serif font-black text-[#080808]">
            K
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg leading-tight tracking-wide text-[#F8F7F4]">Administration</h2>
            <p className="text-[10px] text-[#1D9E75] font-semibold flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75] animate-pulse"></span>
              Connecté
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 space-y-8">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="px-4">
            <h3 className="text-[10px] font-bold text-[#666666] uppercase tracking-widest mb-3 px-2">
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
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-[#141414] text-[#D4AF37] border-l-2 border-[#D4AF37]"
                          : "text-[#AAAAAA] hover:bg-[#141414] hover:text-[#F8F7F4] border-l-2 border-transparent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#222]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg text-sm text-[#C4622D] hover:bg-[#C4622D]/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 h-12 w-12 bg-[#0F0F0F] text-white rounded-full flex items-center justify-center shadow-xl z-40"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen border-r border-[#E5E3DD]">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSidebar} />
          <div className="relative w-[260px] h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <button
              onClick={closeSidebar}
              className="absolute top-4 -right-12 h-10 w-10 bg-[#0F0F0F] text-white flex items-center justify-center rounded-r-xl"
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
