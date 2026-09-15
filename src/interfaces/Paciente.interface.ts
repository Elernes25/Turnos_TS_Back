
import { SubinterfaceTelefono } from "./SubinterfaceTelefono";
import { SubinterfaceDireccion} from "./SubinterfaceDireccion";
import { Types, Document } from "mongoose";


export interface Paciente extends Document {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    nombre: string;
    dni: string;
    fechaNacimiento: Date;
    telefono?: SubinterfaceTelefono;
    email?: string;
    direccion: SubinterfaceDireccion;
    obraSocial?: string;
    numeroAfiliado?: string;
    //activo?: boolean; /*opcional, por defecto es true*/
}


