import { z } from "zod";

export const createProjectSchema = z
  .object({
    nom: z
      .string()
      .trim()
      .min(1, "Le nom du projet est obligatoire")
      .max(150, "Le nom ne doit pas dépasser 150 caractères"),

    description: z.string().trim().optional(),

    dateDebut: z.string().min(1, "La date de début est obligatoire"),

    dateFin: z.string().optional(),

    nombreMembresMax: z.coerce
      .number()
      .int("Le nombre de membres doit être un entier")
      .min(1, "Le nombre maximum de membres doit être au moins 1"),
  })
  .refine(
    (data) => {
      if (!data.dateFin) {
        return true;
      }

      return new Date(data.dateFin) >= new Date(data.dateDebut);
    },
    {
      message:
        "La date de fin doit être postérieure ou égale à la date de début",
      path: ["dateFin"],
    },
  );

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
