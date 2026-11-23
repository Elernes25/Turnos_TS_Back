import { z } from 'zod';

const datosClinicosObjeto =  z.object ({
    sexo: z.enum(['FEMENINO', 'MASCULINO']),
    grupoSanguineo: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'NO SABE']).optional()
}).strict();

const antecedentesObjeto = z.object ({
    alergias: z.array(z.string()),
    cirugias: z.array(z.string()),
    enfermedadesCronicas: z.array(z.string()),
    historiaGeneral: z.string().optional().default("")
}).strict();

const modificacionObjeto = z.object ({
    medicoId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "ID médico inválido" }),
    fecha: z.coerce.date({ message: "Formato de fecha inválido" })
}).strict();


export const CrearHistoriaClinicaSchema = z.object({
  body: z.object({
    pacienteId: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "ID paciente inválido" }),
    datosClinicos: datosClinicosObjeto,
    antecedentes: antecedentesObjeto,
    modificacion: modificacionObjeto
  }).strict(),
});

export const ActualizarHistoriaClinicaSchema = z.object({
  body: z.object({
    datosClinicos: datosClinicosObjeto.partial().optional(),
    antecedentes: antecedentesObjeto.partial().optional()
  }).strict().refine(
    (body) => body.datosClinicos !== undefined || body.antecedentes !== undefined,
    { message: "Debe enviar datosClinicos o antecedentes para modificar" }
  )
});

export type CrearHistoriaClinicaDTO = z.infer<typeof CrearHistoriaClinicaSchema>['body'];
export type ActualizarHistoriaClinicaDTO = z.infer<typeof ActualizarHistoriaClinicaSchema>['body'];
