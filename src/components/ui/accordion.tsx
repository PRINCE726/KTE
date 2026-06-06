"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | null; // CORRECTION 1 : Permettre explicitement la valeur null
}

const AccordionContext = React.createContext<{
  activeItem: string | null;
  setActiveItem: (value: string | null) => void;
} | null>(null);

// CORRECTION 2 : L'assignation par défaut = null est désormais acceptée par TypeScript
export function Accordion({ children, defaultValue = null }: AccordionProps) {
  const [activeItem, setActiveItem] = React.useState<string | null>(defaultValue);

  return (
    <AccordionContext.Provider value={{ activeItem, setActiveItem }}>
      <div className="space-y-4">{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const AccordionItemContext = React.createContext<{
  value: string;
  isOpen: boolean;
} | null>(null);

export function AccordionItem({ value, children, className, ...props }: AccordionItemProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be used within Accordion");

  const isOpen = context.activeItem === value;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <div
        className={cn(
          "rounded-xl border border-border bg-card transition-all duration-300 overflow-hidden",
          {
            "border-l-4 border-l-primary border-t-border/40 border-r-border/40 border-b-border/40 bg-[#1a1a1a] shadow-[0_10px_30px_rgba(0,0,0,0.3)]":
              isOpen,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!context || !itemContext) {
    throw new Error("AccordionTrigger must be used within AccordionItem");
  }

  const { activeItem, setActiveItem } = context;
  const { value, isOpen } = itemContext;

  const handleToggle = () => {
    if (isOpen) {
      setActiveItem(null);
    } else {
      setActiveItem(value);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-foreground hover:bg-[#1c1c1c] transition-colors cursor-pointer select-none",
        className
      )}
      {...props}
    >
      <span className="text-base tracking-wide text-foreground/90 font-medium">
        {children}
      </span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-primary"
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </button>
  );
}

export function AccordionContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const itemContext = React.useContext(AccordionItemContext);
  if (!itemContext) {
    throw new Error("AccordionContent must be used within AccordionItem");
  }

  const { isOpen } = itemContext;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className={cn("p-5 pt-0 text-sm leading-relaxed text-muted-foreground", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}