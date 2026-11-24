import { z } from 'zod';
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion.js";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono.js";

const recepcionistaBody = z.object({
    nombre: z.string({ error: "El nombre es obligatorio" }).min(1, "El nombre es obligatorio"),
    dni: z.string({ error: "El DNI es obligatorio" }).regex(/^[0-9]{7,8}$/, "El DNI debe tener entre 7 y 8 dígitos"),
    direccion: SubinterfaceDireccion,
    telefono: SubinterfaceTelefono,
    email: z.email({ error: "Email inválido" }),
});

const recepcionistaId = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido");

export const CrearRecepcionistaSchema = z.object({
    body: recepcionistaBody.extend({
        usuario: z.object({
            user: z.string().min(1, "El nombre de usuario es obligatorio"),
            password: z.string().min(1, "La contraseña es obligatoria"),
        }),
    }),
});

export const EditarRecepcionistaSchema = z.object({
    body: recepcionistaBody,
    params: z.object({ id: recepcionistaId }),
});

export const RecepcionistaPorIdSchema = z.object({
    params: z.object({ id: recepcionistaId }),
});

export type CrearRecepcionistaDTO = z.infer<typeof CrearRecepcionistaSchema>['body'];
export type EditarRecepcionistaDTO = z.infer<typeof EditarRecepcionistaSchema>['body'];
    