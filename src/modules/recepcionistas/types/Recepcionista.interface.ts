import { Types, Document } from "mongoose";
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";

export interface IRecepcionista extends Document {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    nombre: string;
    dni: string;
    telefono?: typeof SubinterfaceTelefono;
    email?: string;
    direccion: typeof SubinterfaceDireccion;
    fechaAlta: Date;
}