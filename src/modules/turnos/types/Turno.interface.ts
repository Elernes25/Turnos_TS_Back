/*como tiene que ser la estructura del model turno */

import { EstadoTurno } from "../../interfaces/TurnoEstado.enum"
import { Types,Document } from "mongoose";

export interface ITurno extends Document {
    id?: Types.ObjectId; /*el id es opcional porque lo genera MongoDB automáticamente*/
    especialidad:Types.ObjectId; /*referencia a la especialidad del turno*/
    medicoId:Types.ObjectId,   // referencia a un ID de Mongo
    fechaTurno: Date;
    estado?: EstadoTurno;
    observaciones?: string;
    activo?: boolean;
    paciente?: Types.ObjectId;

}

