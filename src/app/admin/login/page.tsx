"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasError(false);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast({ title: "Connexion réussie", variant: "success" });
        router.push("/admin");
        router.refresh();
      } else {
        setHasError(true);
        toast({ title: "Mot de passe incorrect", variant: "error" });
      }
    } catch (error) {
      setHasError(true);
      toast({ title: "Erreur serveur", variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-4 font-sans relative">
      {/* Background accents */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-[#080808] to-[#080808] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="h-16 w-16 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.2)] mb-8">
          <span className="font-serif font-black text-3xl text-[#080808]">K</span>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-[#222222] rounded-2xl p-8 w-full shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-serif text-2xl font-bold text-white mb-1">Espace Administration</h1>
            <p className="text-sm text-[#AAAAAA]">Kimia Events Team</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#CCCCCC] uppercase tracking-wider">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-lg border focus:outline-none transition-colors ${
                  hasError 
                    ? "border-[#C4622D] focus:border-[#C4622D]" 
                    : "border-[#333333] focus:border-[#D4AF37]"
                }`}
                required
              />
              {hasError && (
                <p className="text-xs text-[#C4622D] mt-1 font-medium">Mot de passe incorrect</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D4AF37] text-[#080808] font-bold py-3.5 rounded-lg hover:bg-[#E8C84D] transition-colors focus:outline-none disabled:opacity-50"
            >
              {isLoading ? "VÉRIFICATION..." : "SE CONNECTER"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-xs text-[#666666] mt-12">
          © {new Date().getFullYear()} Kimia Events Team
        </p>
      </div>
    </div>
  );
}
