import { z } from "zod";
import {EstadoTurno} from "../../interfaces/TurnoEstado.enum"

/* forma de validar en zod que sea  un string del tipo ObjectID
    paciente: z.string().regex(objectIdRegex, {
      message: "ID de paciente inválido",
    }),
    especialidad: z.string().regex(objectIdRegex, {
      message: "ID de especialidad inválido",
    }),
*/
export const CrearTurnoSchema = z.object ({
    body: z.object ({
        paciente:z.string({error: 'El ID del paciente es obligatorio'}),
        especialidad: z.string({error: 'La especialidad es obligatoria'}),
        estadoTurno: z.enum (EstadoTurno,{
                error:"Estado de turno no válido"
        }),
        fechaTurno: z.iso.date({message:"Formato de fecha inválido"})
    })

});

export type CrearTurnoDTO = z.infer <typeof CrearTurnoSchema>['body']

export interface QueryUrgencia{
    urgencia?: string;
}