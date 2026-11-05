
import type { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";
import type { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { Types, Document } from "mongoose";
import type { IObraSocial } from "../../obraSocial/types/ObraSocial.interface";

export interface IPaciente extends Document {
    id?: Types.ObjectId; //el id es opcional porque lo genera MongoDB automáticamente
    nombre: string;
    dni: string;
    fechaDeNacimiento: Date;
    sexo:string;
    telefono?: typeof SubinterfaceTelefono;
    email?: string;
    direccion: typeof SubinterfaceDireccion;
    obraSocial: {
        obraSocialID?: Types.ObjectId | IObraSocial; // por si uso populate //
        numeroAfiliado?: string;
    };
    
}
