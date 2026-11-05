import { z } from "zod";

const obraSocialBody = z.object({
    nombreObraSocial: z.string().trim().min(1, { error: "El nombre de la obra social es obligatorio" }),
});

const obraSocialIdParams = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "ID de obra social inválido" }),
});

export const CrearObraSocialSchema = z.object({
    body: obraSocialBody,
});

export const EditarObraSocialSchema = z.object({
    params: obraSocialIdParams,
    body: obraSocialBody,
});

export const ObraSocialIdSchema = z.object({
    params: obraSocialIdParams,
});

export type CrearObraSocialDTO = z.infer<typeof CrearObraSocialSchema>["body"];
export type EditarObraSocialDTO = z.infer<typeof EditarObraSocialSchema>["body"];
