import { Document, Types } from 'mongoose';

export interface IConsultaClinica {
  fecha: Date;
  medicoID: Types.ObjectId ; /*referencia al médico que realizó la consulta*/
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  indicaciones: string;
  observaciones?: string;
}

export enum GrupoSanguineo {
  'A+'= 'A+',
  'A-'= 'A-',
  'B+'= 'B+',
  'B-'= 'B-',
  'AB+'= 'AB+',
  'AB-'= 'AB-',
  'O+'= 'O+', 
  'O-'= 'O-',
  'NO SABE'='NO SABE'
}

export enum Sexo {
'FEMENINO'='FEMENINO',
'MASCULINO'='MASCULINO'
}

export interface IHistoriaClinica extends Document {
  id?: Types.ObjectId;
  pacienteID: Types.ObjectId | string;
  datosClinicos: {
    sexo: Sexo;
    grupoSanguineo:GrupoSanguineo;
  };
  antecedentes: {
      alergias: string[];
      cirugias: string[];
      enfermedadesCronicas: string[];
      historiaGeneral: string;
  };
  consultas: IConsultaClinica[];  /*arreglo de consultas */
}

