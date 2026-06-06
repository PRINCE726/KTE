import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "green" | "destructive" | "gold";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
        {
          // Default: Dark background with subtle gold border
          "border border-primary/30 bg-[#0F0F0F] text-foreground":
            variant === "default",
          // Secondary: Muted gray text
          "bg-[#141414] text-muted-foreground border border-border/10":
            variant === "secondary",
          // Outline: Gold border, no background
          "border border-primary text-primary":
            variant === "outline",
          // KTE Green (Success, Available)
          "bg-[#1D9E75]/10 text-[#1D9E75] border border-[#1D9E75]/30":
            variant === "green",
          // Urgency / Destructive (Complet, Sold Out)
          "bg-destructive/10 text-destructive border border-destructive/30":
            variant === "destructive",
          // Gold Filled Badge
          "bg-primary text-primary-foreground":
            variant === "gold",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
