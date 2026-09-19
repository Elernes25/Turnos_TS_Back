import { Types } from "mongoose";
import { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";

export interface MedicoDTO {
    nombre:string;
    dni: string;
    especialidad:Types.ObjectId[];
    numeroMatricula:string;
    direccion:SubinterfaceDireccion;
    telefono:SubinterfaceTelefono;
    email:string;
};
