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


export interface IHistoriaClinica extends Document {
  id?: Types.ObjectId;
  pacienteID: Types.ObjectId | string;
   antecedentes: {
        alergias: string[];
        cirugias: string[];
        enfermedadesCronicas: string[];
        historiaGeneral: string;
    };
  consultas: IConsultaClinica[];  /*arreglo de consultas */
}

