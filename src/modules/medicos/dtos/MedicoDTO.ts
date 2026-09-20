import { Types } from "mongoose";
import type { SubinterfaceDireccion } from "../../interfaces/SubinterfaceDireccion";
import type { SubinterfaceTelefono } from "../../interfaces/SubinterfaceTelefono";

export interface MedicoDTO {
    nombre:string;
    dni: string;
    especialidad:Types.ObjectId[];
    numeroMatricula:string;
    direccion:SubinterfaceDireccion;
    telefono:SubinterfaceTelefono;
    email:string;
};
