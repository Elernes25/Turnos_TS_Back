import { z } from 'zod';

const datosClinicosObjeto =  z.object ({
    sexo: z.string(""),
    grupoSanguineo:z.string().optional().default("")
})

const antecedentesObjeto = z.object ({
    alergias: z.array(z.string()),
    cirugias: z.array(z.string()),
    enfermedadesCronicas: z.array(z.string()),
    historiaGeneral: z.string().optional().default(""),
})

export const ConsultaClinicaSchema = z.object({
    //fecha: z.iso.date({ message: "Formato de fecha inválido" }), //* forma actualizada  */
    /*errores con fecha */
    fecha:z.coerce.date({ message: "Formato de fecha inválido" }),
    medicoID: z.string({ message: "medico ID invalido" }),
    motivoConsulta: z.string(""),
    diagnostico: z.string(""),
    tratamiento: z.string(""),
    indicaciones: z.string(""),
    observaciones: z.string("").optional().default("")   
});

export const SoloConsultas = z.object({
     body : ConsultaClinicaSchema
});

export const CrearHistoriaClinicaSchema = z.object({
  body: z.object({
    pacienteID: z.string(),
    datosClinicos: datosClinicosObjeto,
    antecedentes: antecedentesObjeto,
    consultas: z.array(ConsultaClinicaSchema),
  }),
});

export type CrearConsultaDTO = z.infer<typeof SoloConsultas>['body'];
export type CrearHistoriaClinicaDTO = z.infer<typeof CrearHistoriaClinicaSchema>['body'];
