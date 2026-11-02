import {z} from 'zod';
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";
import { ObraSocial } from "../../interfaces/ObraSocial.enum";
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
        sexo: z.string({error:"El sexo del paciente es obligatorio"}),
        direccion: SubinterfaceDireccion,
        telefono: SubinterfaceTelefono,
        //email: z.email({ message: "Formato de email inválido" }).optional().default(""),
        email: z.union([z.email({ message: "Formato de email inválido" }), z.literal(""),]).default(""),
        obraSocial: z.object({
            nombreObraSocial: z.enum(ObraSocial,{error:"Obra Social Invalida"}),
            numeroAfiliado: z.string({error:"Numero de afiliado invalido"}).optional().default(""),
        })
    })
});

export const QueryPacientesSchema =z.object({
  query: z.object({
    nombreObraSocial: z.string().optional(),
    dni: z.string().optional(),
  })  
});

export type CrearPacienteDTO = z.infer <typeof CrearPacienteSchema>['body']
export type IQueryPacientes = z.infer <typeof QueryPacientesSchema>['query']

