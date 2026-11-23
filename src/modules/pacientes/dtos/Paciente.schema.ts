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

export const ActualizarPacienteSchema = z.object({
  // 1. Validamos el ID de Mongo que viene en la ruta (api/v1/paciente/:id)
  params: z.object({
    id: z.string({ error: "El ID del paciente es obligatorio" }) .regex(/^[0-9a-fA-F]{24}$/, { error: "ID de paciente inválido" }),
  }),
  // 2. Hacemos opcionales los campos del body y eliminamos los .default("")
  body: CrearPacienteSchema.shape.body
    .partial()
    .extend({
      // Sobrescribimos email para quitar el .default("") y evitar que pise datos con vacío si no se envía
      email: z
        .union([z.email({ message: "Formato de email inválido" }), z.literal("")])
        .optional(),

      // Hacemos opcionales también los subcampos de obraSocial
      obraSocial: z
        .object({
          obraSocialID: z
            .string({ error: "Obra social inválida" })
            .regex(/^[0-9a-fA-F]{24}$/, { error: "Obra social inválida" })
            .or(z.literal("")),
          numeroAfiliado: z.string({ error: "Número de afiliado inválido" }),
        })
        .partial()
        .optional(),
    })
    // 3. Evitamos que el front mande un PATCH completamente vacío {}
    .refine((data) => Object.keys(data).length > 0, {
      error: "Debes enviar al menos un campo para actualizar",
    }),
});


export type ActualizarPacienteDTO = z.infer<typeof ActualizarPacienteSchema>['body'];
export type CrearPacienteDTO = z.infer <typeof CrearPacienteSchema>['body']
export type IQueryPacientes = z.infer <typeof QueryPacientesSchema>['query']

