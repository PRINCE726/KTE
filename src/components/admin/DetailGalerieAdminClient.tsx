"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { createBrowserClient } from "@supabase/ssr";

// Note : Assure-toi que SortablePhoto est bien importé ou défini dans ton projet.
// Si c'est un composant externe, l'import doit être présent.
import SortablePhoto from "./SortablePhoto"; 

interface Props {
  galerieId: string;
  initialGalerie: any;
  initialPhotos: any[];
}

export default function DetailGalerieAdminClient({ galerieId, initialGalerie, initialPhotos }: Props) {
  const [galerie, setGalerie] = useState(initialGalerie);
  const [photos, setPhotos] = useState<any[]>(initialPhotos);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteAllDialog, setDeleteAllDialog] = useState(false);
  
  const { toast } = useToast();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- Gestion du Drop et Upload ---
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const newPhotos: any[] = [];
    const startIndex = photos.length;

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${galerieId}/${fileName}`;

      // Envoi du fichier dans le bucket Storage "galeries"
      const { error: uploadError } = await supabase.storage
        .from("galeries")
        .upload(filePath, file);
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from("galeries")
          .getPublicUrl(filePath);

        newPhotos.push({
          galerie_id: galerieId,
          image_url: publicUrl,
          ordre: startIndex + i,
          legende: ""
        });
      }
    }

    if (newPhotos.length > 0) {
      const { data, error } = await supabase
        .from("galerie_photos")
        .insert(newPhotos)
        .select();

      if (!error && data) {
        // CORRECTION SYNTAXE PREV
        setPhotos((prev: any[]) => [...prev, ...data]);
        toast({ title: `${data.length} photo(s) ajoutée(s)` });
      }
    }
    
    setIsUploading(false);
  }, [galerieId, photos, supabase, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] } 
  });

  // --- Gestion du Réordonnancement ---
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // CORRECTION SYNTAXE ITEMS / PREV
      setPhotos((items: any[]) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // --- Sauvegarde globale (Ordre & Légendes) ---
  const saveOrderAndCaptions = async () => {
    setIsSaving(true);
    
    const updates = photos.map((p, index) => ({
      id: p.id,
      galerie_id: p.galerie_id,
      image_url: p.image_url,
      ordre: index,
      legende: p.legende || ""
    }));

    const { error } = await supabase.from("galerie_photos").upsert(updates);
    
    if (error) {
      toast({ title: "Erreur de sauvegarde", variant: "error" });
    } else {
      toast({ title: "Modifications enregistrées" });
      // Définir la première image comme couverture si disponible
      if (photos.length > 0) {
        await supabase
          .from("galeries")
          .update({ cover_url: photos[0].image_url })
          .eq("id", galerieId);
      }
    }
    setIsSaving(false);
  };

  const deletePhoto = async (id: string) => {
    const { error } = await supabase.from("galerie_photos").delete().eq("id", id);
    if (!error) {
      // CORRECTION SYNTAXE PREV
      setPhotos((prev: any[]) => prev.filter(p => p.id !== id));
      toast({ title: "Photo supprimée" });
    }
  };

  const deleteAllPhotos = async () => {
    const { error } = await supabase.from("galerie_photos").delete().eq("galerie_id", galerieId);
    if (!error) {
      setPhotos([]);
      toast({ title: "Toutes les photos ont été supprimées" });
    }
    setDeleteAllDialog(false);
  };

  const updateCaption = (id: string, legende: string) => {
    // CORRECTION SYNTAXE PREV
    setPhotos((prev: any[]) => prev.map((p: any) => p.id === id ? { ...p, legende } : p));
  };

  const togglePublish = async () => {
    const newStatus = !galerie.published;
    const { error } = await supabase.from("galeries").update({ published: newStatus }).eq("id", galerieId);
    if (!error) {
      // CORRECTION SYNTAXE PREV
      setGalerie((prev: any) => ({ ...prev, published: newStatus }));
      toast({ title: newStatus ? "Galerie publiée" : "Galerie passée en brouillon" });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <Link href="/admin/galeries" className="inline-flex items-center text-sm text-[#666666] hover:text-[#1A1A1A] transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux galeries
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A]">{galerie.titre}</h1>
          <p className="text-sm text-[#666666] mt-1">Édition {galerie.edition} • {photos.length} photos</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePublish}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm ${
              galerie.published ? "bg-gray-100 text-[#1A1A1A] hover:bg-gray-200" : "bg-[#1D9E75] text-white hover:bg-[#157556]"
            }`}
          >
            {galerie.published ? "Passer en brouillon" : "Publier la galerie"}
          </button>
          <button 
            onClick={saveOrderAndCaptions}
            disabled={isSaving || photos.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {isSaving ? "Sauvegarde..." : "Sauvegarder les modifications"}
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-[#E5E3DD] bg-white hover:bg-[#F8F7F4]"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`h-12 w-12 mb-4 ${isDragActive ? "text-[#D4AF37]" : "text-[#AAAAAA]"}`} />
        {isUploading ? (
          <p className="text-sm font-bold text-[#1A1A1A] animate-pulse">Téléchargement en cours...</p>
        ) : (
          <>
            <p className="text-sm font-bold text-[#1A1A1A] mb-1">Glissez vos photos ici</p>
            <p className="text-xs text-[#666666]">ou cliquez pour sélectionner (JPG, PNG, WebP)</p>
          </>
        )}
      </div>

      {/* Action bar for photos */}
      {photos.length > 0 && (
        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#E5E3DD] shadow-sm">
          <p className="text-xs text-[#666666] font-medium px-2">
            Glissez-déposez pour réorganiser. La première image sera la couverture.
          </p>
          <button 
            onClick={() => setDeleteAllDialog(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#C4622D] hover:bg-[#C4622D]/10 rounded-lg transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> Supprimer toutes
          </button>
        </div>
      )}

      {/* Grid Drag-and-Drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
            {photos.map((photo: any) => (
              <SortablePhoto 
                key={photo.id} 
                photo={photo} 
                onDelete={deletePhoto} 
                onUpdateCaption={updateCaption}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {photos.length === 0 && !isUploading && (
        <div className="text-center py-12 text-[#666666] border border-dashed border-[#E5E3DD] rounded-xl">
          Aucune photo dans cette galerie.
        </div>
      )}

      {/* DELETE ALL MODAL */}
      <Dialog open={deleteAllDialog} onOpenChange={setDeleteAllDialog}>
        <DialogContent className="bg-white text-[#1A1A1A] border-[#E5E3DD]">
          <DialogHeader>
            <DialogTitle>Supprimer toutes les photos ?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-[#666666]">Cette action est irréversible. Toutes les images seront retirées.</div>
          <DialogFooter>
            {/* CORRECTION : Suppression de asChild sur DialogClose */}
            <DialogClose>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={deleteAllPhotos} className="bg-[#C4622D] hover:bg-red-700 text-white">Oui, tout supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}