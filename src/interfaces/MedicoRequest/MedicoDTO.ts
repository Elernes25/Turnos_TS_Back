import { Types } from "mongoose";
import { SubinterfaceDireccion } from "../SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../SubinterfaceTelefono";

export interface MedicoDTO {
    nombre:string;
    dni: string;
    especialidad:Types.ObjectId[];
    numeroMatricula:string;
    direccion:SubinterfaceDireccion;
    telefono:SubinterfaceTelefono;
    email:string;
};
