import { Types, Document } from "mongoose";
import type { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono.js";
import type { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion.js";
import type { IObraSocial } from "../../obraSocial/types/ObraSocial.interface.js";

export interface IPaciente extends Document {
    id?: Types.ObjectId; //el id es opcional porque lo genera MongoDB automáticamente
    nombre: string;
    dni: string;
    fechaDeNacimiento: Date;
    telefono?: typeof SubinterfaceTelefono;
    email?: string;
    direccion: typeof SubinterfaceDireccion;
    obraSocial: {
        obraSocialID?: Types.ObjectId | IObraSocial; // por si uso populate //
        numeroAfiliado?: string;
    };
    
}
