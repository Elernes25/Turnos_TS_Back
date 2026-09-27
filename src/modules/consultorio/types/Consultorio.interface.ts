import { Types,Document } from "mongoose";

export interface IConsultorio extends Document {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    consultorioNumero: string;
    medicoID: Types.ObjectId; /*referencia al médico que atiende en el consultorio*/
    disponible: boolean; 
   
}