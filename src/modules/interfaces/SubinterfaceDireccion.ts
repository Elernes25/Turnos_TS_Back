import {z} from "zod";

export const SubinterfaceDireccion = z.object ({
    calle: z.string().trim().min(1, { error: "La calle es obligatoria" }),
    numero: z.string().trim().min(1, { error: "El número es obligatorio" }),
    piso: z.string().optional().default(""),
    departamento: z.string().optional().default(""),
    //ciudad: z.string(),
    //provincia: z.string(),
   
});