/*import { z } from 'zod';
import { DiaSemana } from '../types/Agenda.interface';

export const CrearAgendaMedicoSchema = z.object({
  body: z.object({
    medicoId: z.string({ error: 'Identificador de médico no válido'}),
    dias: z.array(
      z.object({
        diaSemana: z.enum(DiaSemana, { error: 'Debe ser un día de la semana válido' }),
        rangos: z.array(
          z.object({
            horaInicio: z.string(),
            horaFin: z.string()
          })
        ).min(1, 'Debe existir al menos un rango horario')
      })
    ).min(1, 'Debe existir al menos un día de atención'),

    duracionTurnoMinutos: z.number({error: 'La duración debe ser un número' })
      .min(1, 'La duración debe ser mayor a 0')
      .max(60, 'La duración no puede ser mayor a 60 minutos')
  })
});

export type CrearAgendaMedicoDTO =  z.infer<typeof CrearAgendaMedicoSchema>['body'];
*/

import { z } from 'zod';
import { DiaSemana } from '../types/Agenda.interface';

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida (HH:mm)');

const rangoSchema = z
  .object({ horaInicio: hora, horaFin: hora })
  .refine((r) => r.horaInicio < r.horaFin, {
    message: 'La hora de fin debe ser posterior a la de inicio',
    path: ['horaFin'],
  });

export const agendaBody = z.object({
  medicoId: z.string({ error: 'Identificador de médico no válido'}),
  dias: z
    .array(
      z.object({
        diaSemana: z.enum(DiaSemana, { error: 'Debe ser un día de la semana válido' }),
        rangos: z.array(rangoSchema).min(1, 'Debe existir al menos un rango horario'),
      })
    ).min(1, 'Debe existir al menos un día de atención'),

  duracionTurnoMinutos: z
    .number({ error: 'La duración debe ser un número' })
    .min(1, 'La duración debe ser mayor a 0')
    .max(60, 'La duración no puede ser mayor a 60 minutos'),
  
});

// Agenda suelta: medicoId en el body
export const CrearAgendaMedicoSchema = z.object({
  body: agendaBody, //.extend({ medicoId: objectId }),
});

// Editar solo la agenda: el id viaja por la URL
export const EditarAgendaMedicoSchema = z.object({
  params: z.object({ id: objectId }),
  body: agendaBody,
});

export type EditarAgendaDTO = z.infer<typeof agendaBody>;
export type CrearAgendaMedicoDTO =  z.infer<typeof CrearAgendaMedicoSchema>['body'];