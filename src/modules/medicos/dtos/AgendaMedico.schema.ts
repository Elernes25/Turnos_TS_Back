import { z } from 'zod';
import { DiaSemana } from '../types/Agenda.interface';

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'medico ID inválido');

const hora = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida (HH:mm)');

const rangoSchema = z
  .object({ horaInicio: hora, horaFin: hora })
  .refine((r) => r.horaInicio < r.horaFin, {
    message: 'La hora de fin debe ser posterior a la de inicio',
    path: ['horaFin'],
  });
/***/
const DiaAgendaSchema = z.object({
  diaSemana: z.enum(DiaSemana, {
    error: 'Debe ser un día de la semana válido',
  }),
  rangos: z
    .array(rangoSchema)
    .min(1, 'Debe existir al menos un rango horario')
    .max(3, 'No puede tener más de 3 rangos'),
})
.superRefine((dia, ctx) => {
  const aMinutos = (hora: string): number => {
    const partes = hora.split(':');
    const horas = Number(partes[0] ?? 0);
    const minutos = Number(partes[1] ?? 0);
    return horas * 60 + minutos;
  };

  let finAnterior = -1;
  for (let i = 0; i < dia.rangos.length; i++) {
    const rango = dia.rangos[i];
    if (!rango) continue;
    const inicio = aMinutos(rango.horaInicio);
    if (i > 0 && inicio < finAnterior) {
      ctx.addIssue({
        code: 'custom',
        message: 'La hora de inicio debe ser mayor que la final del rango anterior',
        path: ['rangos', i, 'horaInicio'],
      });
    }
    finAnterior = aMinutos(rango.horaFin);
  }
});


export const agendaBody = z.object({
  medicoId: objectId,//z.string({ error: 'Identificador de médico no válido'}),
  dias: z.array(DiaAgendaSchema).min(1, 'Debe existir al menos un día de atención'),
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







