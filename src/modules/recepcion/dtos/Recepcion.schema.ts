import {z} from 'zod';
import { EstadoTurno } from "../../interfaces/TurnoEstado.enum";
import {CrearPacienteSchema} from "../../pacientes/dtos/Paciente.schema";


export const CrearIngresoSchema = z.object ({
    body : z.object ({
        datosPaciente: CrearPacienteSchema.shape.body,
        especialidadId: z.string(),
        medicoId: z.string(),
        fechaTurno: z.coerce.date().refine((fecha) => {
                    return fecha.getTime() > Date.now();
                    }, { message: 'La fecha del turno debe ser una fecha futura'}
                ),
        estado: z.enum(EstadoTurno,{}).optional().default(EstadoTurno.PENDIENTE),
        observaciones: z.string().optional().default("")
    })
    
});

export type RegistrarIngresoDTO = z.infer <typeof CrearIngresoSchema>['body'];