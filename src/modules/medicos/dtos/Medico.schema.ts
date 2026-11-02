import { z } from 'zod';
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido");

const medicoBody = z.object({
    nombre: z.string({ error: "El nombre es obligatorio" }).min(1, "El nombre es obligatorio"),
    dni: z.string({ error: "El DNI es obligatorio" }).min(1, "El DNI es obligatorio"),
    especialidad: z.array(objectId).min(1, "Seleccioná al menos una especialidad"),
    numeroMatricula: z.string({ error: "Número de matrícula inválido" }).min(1),
    direccion: SubinterfaceDireccion,
    telefono: SubinterfaceTelefono,
    email: z.union([z.email({ error: "Email inválido" }), z.literal("")]).optional(),
});

// CREAR: sin params
export const CrearMedicoSchema = z.object({
    body: medicoBody,
});
export type CrearMedicoDTO = z.infer<typeof CrearMedicoSchema>['body'];

// EDITAR: id obligatorio, body parcial (se puede mandar solo lo que cambia)
export const EditarMedicoSchema = z.object({
    body: medicoBody,
    params: z.object({ id: objectId }),
});
export type EditarMedicoDTO = z.infer<typeof EditarMedicoSchema>['body'];