import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive"
    | "green";
  size?: "default" | "sm" | "lg" | "icon" | "pill";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer",
          {
            // Gold Filled (Default)
            "bg-gold text-[#080808] hover:bg-[#E8C84D] shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_25px_rgba(232,200,77,0.4)]":
              variant === "default",
            // Gold Outlined
            "border border-gold text-gold hover:bg-gold hover:text-[#080808] shadow-[inset_0_0_0_0px_rgba(212,175,55,0)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.15)]":
              variant === "outline",
            // KTE Green Filled
            "bg-[#1D9E75] text-[#F5F0E8] hover:bg-[#25bc8d] shadow-[0_4px_20px_rgba(29,158,117,0.2)]":
              variant === "green",
            // Destructive (Urgency)
            "bg-destructive text-white hover:bg-[#d9743c] shadow-[0_4px_20px_rgba(196,98,45,0.25)]":
              variant === "destructive",
            // Secondary (Dark Card BG)
            "bg-card text-foreground border border-border hover:bg-[#1f1f1f]":
              variant === "secondary",
            // Ghost (Minimalist)
            "text-foreground hover:bg-[#141414] hover:text-foreground":
              variant === "ghost",
            // Link
            "text-gold underline-offset-4 hover:underline bg-transparent p-0":
              variant === "link",
          },
          {
            "h-10 px-4 py-2 rounded-lg": size === "default",
            "h-9 rounded-md px-3 text-xs": size === "sm",
            "h-12 rounded-xl px-8 text-base": size === "lg",
            "h-10 w-10 rounded-full": size === "icon",
            "h-11 px-6 rounded-full text-sm tracking-wider uppercase": size === "pill",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
