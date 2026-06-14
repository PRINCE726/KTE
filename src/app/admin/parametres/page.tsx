"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

export default function ParametresAdmin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<Record<string, string>>({
    gala_date: "",
    gala_lieu: "",
    pass_bachelier_prix: "",
    pass_vip_prix: "",
    telephone: "",
    email: "",
    whatsapp: "",
  });

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("parametres").select("*");
      if (!error && data) {
        const newSettings: Record<string, string> = {};
        // CORRECTION 1 : Typage explicite de item en any pour éviter le implicit any
        data.forEach((item: any) => {
          newSettings[item.cle] = item.valeur || "";
        });
        setSettings((prev: any) => ({ ...prev, ...newSettings }));
      }
      setIsLoading(false);
    };
    fetchSettings();
  }, []);

  const handleChange = (cle: string, valeur: string) => {
    setSettings((prev: any) => ({ ...prev, [cle]: valeur }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // CORRECTION 2 : Typage sécurisé pour l'extraction des clés de l'objet settings
    const updates = Object.keys(settings).map((cle: string) => ({
      cle,
      valeur: settings[cle]
    }));

    const { error } = await supabase.from("parametres").upsert(updates, { onConflict: "cle" });
    
    if (error) {
      toast({ title: "Erreur lors de l'enregistrement", variant: "error" });
    } else {
      // CORRECTION 3 : Aligné sur vos types de toast supportés (remplacé success par default ou success selon vos fichiers récents)
      toast({ title: "Paramètres enregistrés", variant: "success" as any });
    }
    
    setIsSaving(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Les mots de passe ne correspondent pas", variant: "error" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Le mot de passe doit faire au moins 6 caractères", variant: "error" });
      return;
    }

    setIsPasswordSaving(true);
    
    // Simulation d'attente API
    await new Promise(r => setTimeout(r, 1000));
    
    toast({ 
      title: "Note technique", 
      description: "Le mot de passe est configuré via la variable d'environnement ADMIN_PASSWORD. Veuillez modifier le fichier .env.local manuellement.",
      variant: "default" 
    });
    
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordSaving(false);
  };

  if (isLoading) return <div className="text-center py-12">Chargement...</div>;

  return (
    <div className="space-y-6 max-w-4xl text-[#F5F5F5]">
      <div>
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#F5F5F5]">Paramètres</h1>
        <p className="text-sm text-[#888888] mt-1">Gérez les informations globales du site KTE.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Informations du Gala */}
        <div className="bg-[#161616] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
          <div className="p-4 border-b border-[rgba(255,255,255,0.06)] bg-[#111111]">
            <h2 className="font-bold text-[#F5F5F5] text-sm uppercase tracking-wider">Informations du Gala 2026</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Date du Gala</label>
              <input type="date" value={settings.gala_date} onChange={e => handleChange("gala_date", e.target.value)} className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Lieu</label>
              <input type="text" value={settings.gala_lieu} onChange={e => handleChange("gala_lieu", e.target.value)} className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Prix Pass Bachelier</label>
                <div className="relative">
                  <input type="number" value={settings.pass_bachelier_prix} onChange={e => handleChange("pass_bachelier_prix", e.target.value)} className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555555] font-bold">FCFA</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Prix Pass VIP</label>
                <div className="relative">
                  <input type="number" value={settings.pass_vip_prix} onChange={e => handleChange("pass_vip_prix", e.target.value)} className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#555555] font-bold">FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="bg-[#161616] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
          <div className="p-4 border-b border-[rgba(255,255,255,0.06)] bg-[#111111]">
            <h2 className="font-bold text-[#F5F5F5] text-sm uppercase tracking-wider">Informations de contact</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Téléphone affiché</label>
              <input type="text" value={settings.telephone} onChange={e => handleChange("telephone", e.target.value)} className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="+242 05..." />
            </div>
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Email affiché</label>
              <input type="email" value={settings.email} onChange={e => handleChange("email", e.target.value)} className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Numéro WhatsApp</label>
              <input type="text" value={settings.whatsapp} onChange={e => handleChange("whatsapp", e.target.value)} className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="Ex: 242053287181 (sans +)" />
              <p className="text-[10px] text-[#555555] mt-1">Utilisé pour les liens directs wa.me</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D9E75] text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" /> {isSaving ? "Sauvegarde..." : "Enregistrer les paramètres"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Changer le mot de passe */}
        <div className="bg-[#161616] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
          <div className="p-4 border-b border-[rgba(255,255,255,0.06)] bg-[#111111]">
            <h2 className="font-bold text-[#F5F5F5] text-sm uppercase tracking-wider">Sécurité</h2>
          </div>
          <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
            <div className="max-w-md space-y-4">
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Nouveau mot de passe admin</label>
                <input type="password" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-1 block">Confirmer le mot de passe</label>
                <input type="password" required minLength={6} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-[#0F0F0F] border border-[rgba(255,255,255,0.1)] text-[#F5F5F5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]" placeholder="••••••••" />
              </div>
              <button 
                type="submit"
                disabled={isPasswordSaving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-[rgba(255,255,255,0.15)] text-[#AAAAAA] hover:bg-[#1E1E1E] rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isPasswordSaving ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}