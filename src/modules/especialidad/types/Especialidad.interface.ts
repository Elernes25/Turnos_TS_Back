import { Types,Document } from "mongoose";

export interface IEspecialidad extends Document {
    id?: Types.ObjectId;
    nombre: string;
    descripcion?: string;
}
