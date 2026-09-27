import {z} from 'zod';
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";
import { ObraSocial } from "../../interfaces/ObraSocial.enum";
import {Types} from "mongoose";
import { coerce } from 'zod';

export const CrearPacienteSchema = z.object ({
    body : z.object({
       // id: z.string ({error:"El ID del paciente es obligatorio"}), //lo crea solo mongo DB
        nombre: z.string ({error:"El nombre del paciente es obligatorio"}),
        dni: z.string({error:"El DNI del paciente es obligatorio"}),
        fechaDeNacimiento: z.coerce.date({message:"Formato de fecha inválido"}),
        sexo: z.string({error:""}),
        direccion: SubinterfaceDireccion,
        telefono: SubinterfaceTelefono,
        email: z.email({ message: "Formato de email inválido" }).optional().default(""),
        obraSocial: z.object({
            obraSocialNombre: z.enum(ObraSocial,{error:""}),
            numeroAfiliado: z.string({error:""}).optional().default(""),
        })
    })
});

export const QueryPacientesSchema =z.object({
  query: z.object({
    obraSocialNombre: z.string().optional(),
    dni: z.string().optional(),
  })  
});

export type CrearPacienteDTO = z.infer <typeof CrearPacienteSchema>['body']
export type IQueryPacientes = z.infer <typeof QueryPacientesSchema>['query']

