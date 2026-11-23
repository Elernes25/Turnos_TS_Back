import { Document, Types } from 'mongoose';

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
  pacienteId: Types.ObjectId | string;
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
  modificacion: {
      medicoId: Types.ObjectId | string;
      fecha: Date;
  };

  //consultas: IConsultaClinica[];  /*arreglo de consultas */ lo pase a un documento aparte
}

