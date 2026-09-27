import { z } from 'zod';


const antecedentesObjeto = z.object ({
        /* grupoSanguineo:{ type: String, required:true, match: /^(A|B|AB|O)[+-]$|^No sabe$/  // acepta A+, A-, B+, B-, AB+, AB-, O+, O- Hay gente que no se acuerda de su grupo sanguíneo, por lo que se permite "No sabe" como valor válido }, */
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
    antecedentes: antecedentesObjeto,
    consultas: z.array(ConsultaClinicaSchema),
  }),
});

export type CrearConsultaDTO = z.infer<typeof SoloConsultas>['body'];
export type CrearHistoriaClinicaDTO = z.infer<typeof CrearHistoriaClinicaSchema>['body'];
