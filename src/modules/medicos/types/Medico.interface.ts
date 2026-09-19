import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono.ts";
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion.ts";
import { Types,Document } from "mongoose";

export interface Medico extends Document {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    nombre: string;
    apellido: string;
    dni: string;
    direccion: SubinterfaceDireccion;
    email: string;
    telefono: SubinterfaceTelefono;
    especialidad: Types.ObjectId[]; // por si tiene mas de una especialidad
    numeroMatricula:string;
   // activo?: boolean;  //agregar al schema de medico
   
}

