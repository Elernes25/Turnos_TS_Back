import type { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";
import type { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { Types,Document } from "mongoose";

export interface IMedico extends Document {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    nombre: string;
    apellido: string;
    dni: string;
    direccion: typeof SubinterfaceDireccion;
    email: string;
    telefono: typeof SubinterfaceTelefono;
    especialidad: Types.ObjectId[]; // por si tiene mas de una especialidad
    numeroMatricula:string;
   // activo?: boolean;  //agregar al schema de medico
   
}

