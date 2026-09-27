import {z} from 'zod';

export const CrearConsultorioSchema = z.object ({
    body:z.object ({
        consultorioNumero: z.string({error:""}),
        medicoID: z.string({error:"El ID del medico es obligatorio"}),
        disponible: z.boolean(), 
    })

});

export type CrearConsultorioDTO = z.infer <typeof CrearConsultorioSchema>['body']
