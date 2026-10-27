import {z} from 'zod';
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";

export const CrearMedicoSchema =z.object ({
    body : z.object ({
        nombre:z.string({error:""}),
        dni:z.string({error:""}),
        especialidad:z.array(z.string()), //array de IDs
        numeroMatricula:z.string({error:""}),
        direccion: SubinterfaceDireccion,
        telefono: SubinterfaceTelefono,
        email:z.email({error:"Email Inválido"}).optional().default(""),
    }),
    query: z.object({}).optional(),   // si no usás query, lo dejás vacío
    params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/) // validación de ObjectId
    })
    
});
export type CrearMedicoDTO = z.infer <typeof CrearMedicoSchema>['body']