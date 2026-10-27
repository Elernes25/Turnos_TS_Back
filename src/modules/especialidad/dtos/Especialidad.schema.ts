import {z} from 'zod';

export const CrearEspecialidadSchema = z.object ({
    body : z.object({
        nombre: z.string ({error:"El nombre de la especialidad es obligatoria"}),
        descripcion: z.string().optional().default(""),
    })
});

export type CrearEspecialidadDTO = z.infer <typeof CrearEspecialidadSchema>['body']
