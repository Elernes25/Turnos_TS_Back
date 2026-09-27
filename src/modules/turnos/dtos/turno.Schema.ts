import { z } from "zod";
import {EstadoTurno} from "../../interfaces/TurnoEstado.enum"
import { queryObjects } from "v8";

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
        pacienteID:z.string({error: 'El ID del paciente es obligatorio'}),
        especialidadID: z.string({error: 'La especialidad es obligatoria'}),
        estadoTurno: z.enum (EstadoTurno,{ error:"Estado de turno no válido" }),
        fechaTurno: z.iso.date({message:"Formato de fecha inválido"})
    })

});

export const QueryUrgenciaSchema= z.object({
    query: z.object({
        urgencia: z.enum(['true','false']).optional()
    }) 
});

export type CrearTurnoDTO = z.infer <typeof CrearTurnoSchema>['body']
export type QueryUrgencia = z.infer <typeof QueryUrgenciaSchema>['query']