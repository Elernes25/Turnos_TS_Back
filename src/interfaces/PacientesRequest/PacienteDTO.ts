import { SubinterfaceDireccion } from "../SubinterfaceDireccion";
import { SubinterfaceTelefono } from "../SubinterfaceTelefono";

export interface PacienteDTO {
    nombre:string;
    dni: string;
    fechaDeNacimiento:Date;
    sexo: string;
    direccion: SubinterfaceDireccion;
    telefono: SubinterfaceTelefono;
    email?:string;
    obraSocial:{
        obraSocialNombre?: string;
        numeroAfiliado?:string;
    }
    
};

export interface IQueryPacientes {
    obraSocial?: string;
    dni?: string;
}