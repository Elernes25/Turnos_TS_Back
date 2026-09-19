import type { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import type { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";
import { ObraSocial } from "../../interfaces/ObraSocial.enum";
import {Types} from "mongoose";

export interface CrearPacienteDTO {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    nombre:string;
    dni: string;
    fechaDeNacimiento:Date;
    sexo: string;
    direccion: SubinterfaceDireccion;
    telefono: SubinterfaceTelefono;
    email?:string;
    obraSocial:{
        obraSocialNombre:ObraSocial;
        numeroAfiliado?:string;
    } 
    
};

export interface IQueryPacientes {
    obraSocialNombre?: string;
    dni?: string;
}