import {z} from 'zod';
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";

export const CrearPersonaSchema = z.object ({
    body : z.object({
        nombre: z.string ({error:"El nombre de la persona es obligatorio"}),
        dni: z.string({error:"El DNI de la persona es obligatorio"}),
        direccion: SubinterfaceDireccion,
        telefono: SubinterfaceTelefono,
        email: z.email({ message: "Formato de email inválido" }).optional().default(""),
        fechaAlta: z.iso.date({message:"Formato de fecha inválido"})
    })
});

export type CrearPersonaDTO = z.infer <typeof CrearPersonaSchema>['body']


    