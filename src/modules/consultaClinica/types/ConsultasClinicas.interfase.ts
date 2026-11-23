import { Document, Types } from 'mongoose';

export interface IConsultaClinica extends Document{
  pacienteId: Types.ObjectId | string;
  fecha: Date;
  medicoId: Types.ObjectId; /*referencia al médico que realizó la consulta*/
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  indicaciones: string;
  observaciones?: string;
}