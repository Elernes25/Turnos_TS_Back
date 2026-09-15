import { Types, Document } from "mongoose";

interface Consulta {
  fecha: Date;
  medicoId: Types.ObjectId; /*referencia al médico que realizó la consulta*/
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
}

export interface HistoriaClinica extends Document {
    id?: Types.ObjectId;
    pacienteId: Types.ObjectId;
    antecedentes: {
        alergias: string[];
        cirugias: string[];
        enfermedadesCronicas: string[];
        historiaGeneral: string;
    };
    consultas: Consulta[];  /*arreglo de consultas */

}