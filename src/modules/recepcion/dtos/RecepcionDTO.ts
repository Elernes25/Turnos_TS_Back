import { Types} from "mongoose";
import type { EstadoTurno } from "../../interfaces/TurnoEstado.enum";
import type {CrearPacienteDTO} from "../../pacientes/dtos/PacienteDTO";

export interface RegistrarIngresoDTO {
    datosPaciente: CrearPacienteDTO;
    especialidad: Types.ObjectId;
    fechaTurno: string | Date;
    estado?: EstadoTurno;
    observaciones?: string;
};
