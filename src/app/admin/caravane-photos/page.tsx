"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Save } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase";

// Instructions pour Supabase Storage:
// 1. Créez un bucket public nommé 'caravane-photos' dans Supabase Storage.
// 2. Configurez les politiques RLS correspondantes.

const supabase = createClient();

interface CaravanePhoto {
  id: string;
  image_url: string;
  ordre: number;
  legende: string | null;
  created_at?: string;
}

export default function CaravanePhotosAdmin() {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<CaravanePhoto[]>([]);
  const [initialPhotos, setInitialPhotos] = useState<CaravanePhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("caravane_photos")
      .select("*")
      .order("ordre", { ascending: true });

    if (!error && data) {
      setPhotos(data as CaravanePhoto[]);
      // Deep copy to track changes
      setInitialPhotos(JSON.parse(JSON.stringify(data)));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    
    const startIndex = photos.length > 0 ? Math.max(...photos.map(p => p.ordre)) + 10 : 0;
    const newInserts = [];

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        toast({ title: `Téléchargement de ${file.name}...` });

        const { error: uploadError } = await supabase.storage
          .from("caravane-photos")
          .upload(filePath, file);

        if (uploadError) {
          toast({ title: `Erreur d'upload : ${file.name}`, description: uploadError.message, variant: "error" });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage.from("caravane-photos").getPublicUrl(filePath);
        newInserts.push({
          image_url: publicUrl,
          ordre: startIndex + i * 10,
          legende: ""
        });
      }

      if (newInserts.length > 0) {
        const { error: insertError } = await supabase.from("caravane_photos").insert(newInserts);
        if (!insertError) {
          toast({ title: `${newInserts.length} photo(s) ajoutée(s) !`, variant: "success" as any });
          fetchPhotos();
        } else {
          toast({ title: "Erreur en base de données", description: insertError.message, variant: "error" });
        }
      }
    } catch (err: any) {
      toast({ title: "Erreur lors du téléversement", description: err.message, variant: "error" });
    } finally {
      setIsUploading(false);
    }
  }, [photos, fetchPhotos, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] }
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("caravane_photos").delete().eq("id", id);
    if (!error) {
      toast({ title: "Photo supprimée !", variant: "success" as any });
      setPhotos(prev => prev.filter(p => p.id !== id));
      setInitialPhotos(prev => prev.filter(p => p.id !== id));
    } else {
      toast({ title: "Erreur lors de la suppression", variant: "error" });
    }
  };

  const handleLegendChange = (id: string, text: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, legende: text } : p));
  };

  // Compare local state with initial database state to see if save is needed
  const hasChanges = JSON.stringify(photos) !== JSON.stringify(initialPhotos);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Upsert updates
    const updates = photos.map(p => ({
      id: p.id,
      image_url: p.image_url,
      ordre: p.ordre,
      legende: p.legende || ""
    }));

    const { error } = await supabase.from("caravane_photos").upsert(updates);

    if (error) {
      toast({ title: "Erreur lors de l'enregistrement", variant: "error" });
    } else {
      toast({ title: "Modifications enregistrées !", variant: "success" as any });
      setInitialPhotos(JSON.parse(JSON.stringify(photos)));
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-[#F5F5F5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-[#F5F5F5]">Photos Terrain Caravane</h1>
          <p className="text-sm text-[#888888] mt-1">Photos affichées dans la galerie Caravane.</p>
        </div>
        {hasChanges && (
          <button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="h-4 w-4" /> {isSaving ? "Enregistrement..." : "Sauvegarder les modifications"}
          </button>
        )}
      </div>

      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragActive 
            ? "border-[#C9A84C] bg-[rgba(201,168,76,0.05)]" 
            : "border-[rgba(201,168,76,0.3)] bg-[#111111]"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 text-[#C9A84C] mb-3" />
        {isUploading ? (
          <p className="text-sm text-[#888888] animate-pulse">Téléchargement en cours...</p>
        ) : isDragActive ? (
          <p className="text-sm text-[#C9A84C] font-semibold">Déposez les fichiers ici</p>
        ) : (
          <div className="text-center">
            <p className="text-sm text-[#888888] font-medium">Glissez vos photos ici</p>
            <p className="text-xs text-[#555555] mt-1">ou cliquez pour sélectionner (JPG, PNG, WebP)</p>
          </div>
        )}
      </div>

      {/* Grid of photos */}
      {isLoading ? (
        <div className="text-center py-12 text-[#888888]">Chargement de la galerie...</div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {photos.map((photo) => (
            <div 
              key={photo.id}
              className="bg-[#161616] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden flex flex-col relative group"
            >
              {/* Photo preview container */}
              <div className="aspect-square bg-[#111111] overflow-hidden relative">
                <img 
                  src={photo.image_url} 
                  alt="Terrain Caravane" 
                  className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-300" 
                />
                
                {/* Delete Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDelete(photo.id)}
                    className="p-2 bg-red-600/80 hover:bg-red-600 rounded-full text-white backdrop-blur-sm transition-colors cursor-pointer absolute top-2 right-2"
                    title="Supprimer la photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Caption input */}
              <div className="p-3">
                <input 
                  type="text" 
                  value={photo.legende || ""}
                  onChange={e => handleLegendChange(photo.id, e.target.value)}
                  placeholder="Légende optionnelle"
                  className="w-full text-xs text-[#888888] placeholder-[#555555] bg-transparent border-b border-transparent focus:border-[rgba(255,255,255,0.1)] focus:outline-none py-1 font-sans font-light"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#161616] rounded-xl border border-dashed border-[rgba(255,255,255,0.08)] text-[#888888]">
          Aucune photo dans la galerie terrain. Glissez des images ci-dessus pour commencer.
        </div>
      )}
    </div>
  );
}
