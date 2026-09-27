import { Types,Document } from "mongoose";

export interface IEspecialidad extends Document {
    id?: Types.ObjectId;
    especialidadNombre: string;
    descripcion?: string;
}
