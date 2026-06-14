"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- DÉFINITION DES TYPES ---
export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// --- CRÉATION DU CONTEXTE ---
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("kte-admin-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("kte-admin-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div 
        className={`min-h-screen w-full flex font-sans transition-colors duration-200 ${
          mounted 
            ? (theme === "dark" ? "bg-[#0F0F0F] text-[#F5F5F5] dark" : "bg-[#FAFAFA] text-[#1A1A1A] light")
            : "bg-[#0F0F0F] text-[#F5F5F5]"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
}