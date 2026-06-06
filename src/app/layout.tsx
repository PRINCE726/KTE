import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kimia Events Team (KTE) | L'avenir commence ici",
  description: "Orientation académique et professionnelle des bacheliers congolais à Pointe-Noire, République du Congo. KTE t'accompagne vers ton succès avec des bourses d'études, salons d'orientation et galas de prestige.",
  keywords: [
    "Kimia Events Team",
    "KTE",
    "Orientation académique Congo",
    "Bacheliers Pointe-Noire",
    "Gala des Bacheliers",
    "Caravane de l'Orientation",
    "JPO Congo",
    "Bourses études Congo"
  ],
  authors: [{ name: "Kimia Events Team" }],
  openGraph: {
    title: "Kimia Events Team (KTE) | L'avenir commence ici",
    description: "Orientation académique et professionnelle des bacheliers congolais à Pointe-Noire, République du Congo.",
    url: "https://www.kimiaeventsteam.com",
    siteName: "KTE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground" suppressHydrationWarning={true}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}


