import {z} from 'zod';
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";
//import { ObraSocial } from "../../interfaces/ObraSocial.enum";
//import {Types} from "mongoose";
//import { coerce } from 'zod';

export const CrearPacienteSchema = z.object ({
    body : z.object({
       // id: z.string ({error:"El ID del paciente es obligatorio"}), //lo crea solo mongo DB
        nombre: z.string ({error:"El nombre del paciente es obligatorio"}),
        dni: z.string({error:"El DNI del paciente es obligatorio"}),
        //fechaDeNacimiento: z.coerce.date({message:"Formato de fecha inválido"}),
        fechaDeNacimiento: z
          .string()
          .min(1, { error: "La fecha de nacimiento es obligatoria" })
          .pipe(z.iso.date({ error: "Fecha inválida" }))
          .refine((f) => new Date(f) <= new Date(), { error: "La fecha no puede ser futura" }),
        sexo: z.string({error:""}),
        direccion: SubinterfaceDireccion,
        telefono: SubinterfaceTelefono,
        email: z.union([z.email({ message: "Formato de email inválido" }), z.literal(""),]).default(""),
        obraSocial: z.object({
            obraSocialID: z.string({ error: "Obra social inválida" }).regex(/^[0-9a-fA-F]{24}$/, { error: "Obra social inválida" })
        .or(z.literal("")),
            numeroAfiliado: z.string({error:"Numero de afiliado invalido"}).optional().default(""),
        })
    })
});

export const QueryPacientesSchema =z.object({
  query: z.object({
    //obraSocialID: z.string().regex(OBJECT_ID_REGEX, { error: "Obra social inválida" }).optional(),
    nombreObraSocial: z.string().optional(),
    dni: z.string().optional(),
  })  
});

export type CrearPacienteDTO = z.infer <typeof CrearPacienteSchema>['body']
export type IQueryPacientes = z.infer <typeof QueryPacientesSchema>['query']

