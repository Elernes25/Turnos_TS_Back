import { z } from 'zod';
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";

export const CrearRecepcionistaSchema = z.object({
    body: z.object({
        usuario: z.object({
            user: z.string().min(1, "El nombre de usuario es obligatorio"),
            password: z.string().min(1, "La contraseña es obligatoria"),
        }),
        nombre: z.string({ error: "El nombre es obligatorio" }).min(1, "El nombre es obligatorio"),
        dni: z.string({ error: "El DNI es obligatorio" }).regex(/^[0-9]{7,8}$/, "El DNI debe tener entre 7 y 8 dígitos"),
        direccion: SubinterfaceDireccion,
        telefono: SubinterfaceTelefono,
        email: z.email({ error: "Email inválido" }),
    }),
});

export type CrearRecepcionistaDTO = z.infer<typeof CrearRecepcionistaSchema>['body'];
    