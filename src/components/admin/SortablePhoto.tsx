"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

export default function SortablePhoto({ photo, onDelete, onUpdateCaption }: any) {
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
        
        {/* Contrôles au survol */}
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