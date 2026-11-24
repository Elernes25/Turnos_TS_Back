import type { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono.js";
import type { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion.js";
import { Types,Document } from "mongoose";

export interface IMedico extends Document {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    usuario: Types.ObjectId;
    nombre: string;
    apellido: string;
    dni: string;
    direccion: typeof SubinterfaceDireccion;
    email: string;
    telefono: typeof SubinterfaceTelefono;
    especialidad: Types.ObjectId[]; // por si tiene mas de una especialidad
    numeroMatricula:string;
    activo?: boolean; 
}

