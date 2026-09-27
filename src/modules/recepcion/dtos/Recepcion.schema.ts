import {z} from 'zod';
import { EstadoTurno } from "../../interfaces/TurnoEstado.enum";
import {CrearPacienteSchema} from "../../pacientes/dtos/Paciente.schema";


export const CrearIngresoSchema = z.object ({
    body : z.object ({
        datosPaciente: CrearPacienteSchema.shape.body,
        especialidad: z.string(),
        fechaTurno: z.iso.date({message:"Formato de fecha inválido"}),
        estado: z.enum(EstadoTurno,{}).optional().default(EstadoTurno.PENDIENTE),
        observaciones: z.string().optional().default("")
    })
    
});

export type RegistrarIngresoDTO = z.infer <typeof CrearIngresoSchema>['body'];