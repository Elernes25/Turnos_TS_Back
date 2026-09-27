import {z} from "zod";

export const SubinterfaceDireccion = z.object ({
    calle: z.string(),
    numero: z.string(),
    piso: z.string().optional().default(""),
    departamento: z.string().optional().default(""),
    //ciudad: z.string(),
    //provincia: z.string(),
   
});