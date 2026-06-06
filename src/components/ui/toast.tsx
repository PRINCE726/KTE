"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
  duration?: number;
}

type ToastContextType = {
  toast: (toast: Omit<Toast, "id">) => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 4000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, variant, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      {/* Toast Render Node */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm sm:max-w-md pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border pointer-events-auto shadow-2xl glass-card",
                {
                  "border-primary bg-card/95": t.variant === "default",
                  "border-[#1D9E75] bg-[#141414]/95 text-foreground": t.variant === "success",
                  "border-[#C4622D] bg-[#141414]/95 text-foreground": t.variant === "error",
                }
              )}
            >
              {/* Variant Icon */}
              {t.variant === "success" && (
                <CheckCircle2 className="h-5 w-5 text-[#1D9E75] shrink-0 mt-0.5" />
              )}
              {t.variant === "error" && (
                <AlertCircle className="h-5 w-5 text-[#C4622D] shrink-0 mt-0.5" />
              )}
              {t.variant === "default" && (
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              )}

              {/* Text */}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={() => removeToast(t.id)}
                className="text-muted-foreground hover:text-foreground hover:bg-[#222] p-1 rounded-full shrink-0 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
