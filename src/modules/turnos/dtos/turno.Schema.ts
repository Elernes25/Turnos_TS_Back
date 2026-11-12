import { z } from "zod";
import {EstadoTurno} from "../../interfaces/TurnoEstado.enum"
//import { queryObjects } from "v8";

/* forma de validar en zod que sea  un string del tipo ObjectID
    paciente: z.string().regex(objectIdRegex, {message: "ID de paciente inválido",}),
    especialidad: z.string().regex(objectIdRegex, {message: "ID de especialidad inválido",}),
*/
export const CrearTurnoSchema = z.object ({
    body: z.object ({
        pacienteId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "ID paciente inválido" }),
        //pacienteID:z.string({error: 'El ID del paciente es obligatorio'}),
        especialidadId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "ID Especialidad inválido" }),
        //especialidadID: z.string({error: 'La especialidad es obligatoria'}),
        medicoId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "ID Medico inválido" }),
        //medicoID: z.string({error: 'El medico ID es obligatorio'}),
        estado: z.enum (EstadoTurno,{ error:"Estado de turno no válido" }),
        //fechaTurno: z.iso.date({message:"Formato de fecha inválido"}),
        //fechaTurno: z.iso.datetime({message:"Formato de fecha inválido"}),
        fechaTurno: z.coerce.date().refine((fecha) => {
            console.log('Fecha recibida:', fecha);
            console.log('ISO:', fecha.toISOString());
            console.log('Ahora:', new Date());
            console.log('Ahora ISO:', new Date().toISOString());

            return fecha.getTime() > Date.now();
            }, {
            message: 'La fecha del turno debe ser una fecha futura'
            }),
        activo: z.boolean(),
        observaciones: z.string()
    })

});

export const QueryUrgenciaSchema= z.object({
    query: z.object({
        urgencia: z.enum(['true','false']).optional()
    }) 
});

export type CrearTurnoDTO = z.infer <typeof CrearTurnoSchema>['body']
export type QueryUrgencia = z.infer <typeof QueryUrgenciaSchema>['query']