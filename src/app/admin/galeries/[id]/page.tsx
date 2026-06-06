"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, UploadCloud, X, Save, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@supabase/ssr";

// --- Composant SortablePhoto ---
function SortablePhoto({ photo, onDelete, onUpdateCaption }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group bg-white rounded-lg border border-[#E5E3DD] overflow-hidden shadow-sm flex flex-col">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img src={photo.image_url} alt="Photo" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
          <div className="flex justify-between items-start">
            <button {...attributes} {...listeners} className="p-1 bg-white/20 hover:bg-white/40 rounded text-white backdrop-blur-sm cursor-grab">
              <GripVertical className="h-4 w-4" />
            </button>
            <button onClick={() => onDelete(photo.id)} className="p-1 bg-red-500/80 hover:bg-red-500 rounded text-white backdrop-blur-sm">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-2">
        <input 
          type="text" 
          value={photo.caption || ""}
          onChange={(e) => onUpdateCaption(photo.id, e.target.value)}
          placeholder="Légende (optionnel)" 
          className="w-full text-xs text-[#666666] bg-transparent border-b border-transparent focus:border-[#E5E3DD] focus:outline-none placeholder:text-[#AAAAAA]"
        />
      </div>
    </div>
  );
}

// --- Composant Principal ---
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GaleriePhotosAdmin({ params }: PageProps) {
  const { id: galerieId } = use(params);
  const { toast } = useToast();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [galerie, setGalerie] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteAllDialog, setDeleteAllDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchGalerie = useCallback(async () => {
    if (!galerieId) return;
    setIsLoading(true);
    try {
      const { data: galData } = await supabase.from("galeries").select("*").eq("id", galerieId).single();
      if (galData) setGalerie(galData);

      const { data: photoData } = await supabase.from("galerie_photos").select("*").eq("galerie_id", galerieId).order("ordre", { ascending: true });
      if (photoData) setPhotos(photoData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [galerieId, supabase]);

  useEffect(() => {
    fetchGalerie();
  }, [fetchGalerie]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    
    const newPhotos = [];
    const startIndex = photos.length;

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const fileExt = file.name.split('.').pop();
        
        // 🔥 Correction du nom de fichier sans Math.random() brut (évite les erreurs de points)
        const cleanRandomId = Math.random().toString(36).substring(2, 15);
        const fileName = `${Date.now()}-${cleanRandomId}.${fileExt}`;
        const filePath = `${galerieId}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("galeries").upload(filePath, file);
        
        if (uploadError) {
          toast({ title: `Erreur Storage: ${file.name}`, description: uploadError.message, variant: "error" });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage.from("galeries").getPublicUrl(filePath);
        newPhotos.push({
          galerie_id: galerieId,
          image_url: publicUrl,
          ordre: startIndex + i,
          caption: ""
        });
      }

      if (newPhotos.length > 0) {
        const { error: insertError } = await supabase.from("galerie_photos").insert(newPhotos);
        if (!insertError) {
          // 🔄 Rechargement instantané
          await fetchGalerie();
          toast({ title: `${newPhotos.length} photo(s) ajoutée(s)`, variant: "success" });
        } else {
          toast({ title: "Erreur Base de données", description: insertError.message, variant: "error" });
        }
      }
    } catch (err: any) {
      toast({ title: "Erreur critique", description: err.message, variant: "error" });
    } finally {
      setIsUploading(false);
    }
  }, [galerieId, photos.length, supabase, fetchGalerie, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] } 
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const saveOrderAndCaptions = async () => {
    setIsSaving(true);
    const updates = photos.map((p, index) => ({
      id: p.id,
      galerie_id: p.galerie_id,
      image_url: p.image_url,
      ordre: index,
      caption: p.caption || ""
    }));

    const { error } = await supabase.from("galerie_photos").upsert(updates);
    if (error) {
      toast({ title: "Erreur de sauvegarde", variant: "error" });
    } else {
      toast({ title: "Modifications enregistrées", variant: "success" });
      if (photos.length > 0) {
        await supabase.from("galeries").update({ cover_url: photos[0].image_url }).eq("id", galerieId);
      }
    }
    setIsSaving(false);
  };

  const deletePhoto = async (id: string) => {
    const { error } = await supabase.from("galerie_photos").delete().eq("id", id);
    if (!error) {
      setPhotos(prev => prev.filter(p => p.id !== id));
      toast({ title: "Photo supprimée", variant: "success" });
    }
  };

  const deleteAllPhotos = async () => {
    const { error } = await supabase.from("galerie_photos").delete().eq("galerie_id", galerieId);
    if (!error) {
      setPhotos([]);
      toast({ title: "Toutes les photos ont été supprimées", variant: "success" });
    }
    setDeleteAllDialog(false);
  };

  const updateCaption = (id: string, legende: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, legende } : p));
  };

  const togglePublish = async () => {
    if (!galerie) return;
    const newStatus = !galerie.published;
    const { error } = await supabase.from("galeries").update({ published: newStatus }).eq("id", galerieId);
    if (!error) {
      setGalerie((prev: any) => ({ ...prev, published: newStatus }));
      toast({ title: newStatus ? "Galerie publiée" : "Galerie passée en brouillon", variant: "success" });
    }
  };

  if (isLoading) return <div className="text-center py-12">Chargement...</div>;
  if (!galerie) return <div className="text-center py-12">Galerie introuvable.</div>;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
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
              galerie.published ? "bg-gray-100 text-[#1A1A1A] hover:bg-gray-200" : "bg-[#1D9E75] text-white hover:bg-green-700"
            }`}
          >
            {galerie.published ? "Passer en brouillon" : "Publier la galerie"}
          </button>
          <button 
            onClick={saveOrderAndCaptions}
            disabled={isSaving || photos.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#080808] rounded-lg text-sm font-bold hover:bg-[#E8C84D] transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {isSaving ? "Sauvegarde..." : "Sauvegarder les modifications"}
          </button>
        </div>
      </div>

      <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragActive ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-[#E5E3DD] bg-white hover:bg-[#F8F7F4]"}`}>
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

      {photos.length > 0 && (
        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#E5E3DD] shadow-sm">
          <p className="text-xs text-[#666666] font-medium px-2">Glissez-déposez pour réorganiser. La première image sera la couverture.</p>
          <button onClick={() => setDeleteAllDialog(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#C4622D] hover:bg-[#C4622D]/10 rounded transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Supprimer toutes
          </button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
            {photos.map(photo => (
              <SortablePhoto key={photo.id} photo={photo} onDelete={deletePhoto} onUpdateCaption={updateCaption} />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {photos.length === 0 && !isUploading && (
        <div className="text-center py-12 text-[#666666] border border-dashed border-[#E5E3DD] rounded-xl">Aucune photo dans cette galerie.</div>
      )}

      <Dialog open={deleteAllDialog} onOpenChange={setDeleteAllDialog}>
        <DialogContent className="bg-white text-[#1A1A1A] border-[#E5E3DD]">
          <DialogHeader><DialogTitle>Supprimer toutes les photos ?</DialogTitle></DialogHeader>
          <div className="text-sm text-[#666666]">Cette action est irréversible. Toutes les images seront retirées.</div>
          <DialogFooter>
            <DialogClose><Button variant="outline">Annuler</Button></DialogClose>
            <Button onClick={deleteAllPhotos} className="bg-[#C4622D] hover:bg-red-700 text-white">Oui, tout supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}