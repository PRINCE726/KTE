import { z } from "zod";

export const inscriptionGalaSchema = z.object({
  nom: z.string().min(2, "Le nom doit comporter au moins 2 caractères."),
  email: z.string().email("Adresse e-mail invalide."),
  telephone: z.string().min(8, "Numéro de téléphone invalide."),
  pass: z.enum(["bachelier", "vip"]),
  lycee: z.string().optional(),
});

export const inscriptionJPOSchema = z.object({
  nom: z.string().min(2, "Le nom doit comporter au moins 2 caractères."),
  email: z.string().email("Adresse e-mail invalide."),
  telephone: z.string().min(8, "Numéro de téléphone invalide."),
  pole: z.enum(["sante", "tech", "arts", "business"]),
  session: z.string(),
  lycee: z.string().optional(),
  classe: z.string().optional(),
  source: z.string().optional(),
});

export const demandeCaravaneSchema = z.object({
  lycee: z.string().min(2, "Le lycée doit comporter au moins 2 caractères."),
  arrondissement: z.string(),
  responsable: z.string().min(2, "Le nom du responsable est requis."),
  telephone: z.string().min(8, "Numéro de téléphone invalide."),
  email: z.string().email("Adresse e-mail invalide.").optional().or(z.literal('')),
  nb_eleves: z.number().optional().or(z.string().transform(val => (val ? Number(val) : undefined))),
  message: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Adresse e-mail invalide."),
});

export const contactSchema = z.object({
  nom: z.string().min(2, "Le nom doit comporter au moins 2 caractères."),
  email: z.string().email("Adresse e-mail invalide."),
  sujet: z.string().min(2, "Le sujet est requis."),
  message: z.string().min(10, "Le message doit comporter au moins 10 caractères."),
});
