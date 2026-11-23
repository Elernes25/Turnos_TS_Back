import { z } from 'zod';

export const ConsultaClinicaSchema = z.object({
    pacienteId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "ID paciente inválido" }),
    medicoId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "ID medico inválido" }),
    motivoConsulta: z.string().min(1, "El motivo de la consulta es obligatorio"),
    diagnostico: z.string().min(1, "El diagnóstico es obligatorio"),
    tratamiento: z.string().min(1, "El tratamiento es obligatorio"),
    indicaciones: z.string().min(1, "Las indicaciones son obligatorias"),
    observaciones: z.string().optional().default("")
}).strict();

export const CrearConsultaSchema = z.object({
    body: ConsultaClinicaSchema
});

export const ActualizarObservacionesSchema = z.object({
    body: z.object({
        observaciones: z.string()
    }).strict()
});

export type CrearConsultaDTO = z.infer<typeof CrearConsultaSchema>['body'];
export type ActualizarObservacionesDTO = z.infer<typeof ActualizarObservacionesSchema>['body'];