import { Types, Document } from "mongoose";
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion.js";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono.js";

export interface IRecepcionista extends Document {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    usuario: Types.ObjectId;
    nombre: string;
    dni: string;
    telefono?: typeof SubinterfaceTelefono;
    email?: string;
    direccion: typeof SubinterfaceDireccion;
    fechaAlta: Date;
}