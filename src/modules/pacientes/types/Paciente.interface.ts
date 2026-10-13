
import type { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";
import type { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { ObraSocial } from "../../interfaces/ObraSocial.enum";
import { Types, Document } from "mongoose";

export interface IPaciente extends Document {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    nombre: string;
    dni: string;
    fechaDeNacimiento: Date;
    sexo:string;
    telefono?: typeof SubinterfaceTelefono;
    email?: string;
    direccion: typeof SubinterfaceDireccion;
    obraSocial: {
        obraSocialNombre: ObraSocial;   
        numeroAfiliado?: string;
    };
    
}


