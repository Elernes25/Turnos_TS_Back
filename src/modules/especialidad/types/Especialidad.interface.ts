import { Types,Document } from "mongoose";

export interface Especialidad extends Document {
    id?: Types.ObjectId;
    especialidadNombre: string;
    descripcion?: string;
    //activa?: boolean; // no haria falta el borrado virtual
}
