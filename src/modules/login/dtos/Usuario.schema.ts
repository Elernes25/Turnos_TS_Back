import {z} from 'zod';
import { Rol } from '../../interfaces/Rol.enum';

export const CrearUsuarioSchema =z.object ({
    body : z.object ({
        email:z.email({error:"Email Inválido"}),
        user:z.string({error:"Usuario NO válido"}),
        dni:z.string({error:"DNI Inválido"}),
        password: z.string({error:"Password Inválido"}),
        rol: z.enum(Rol),
        //activo: z.boolean()               // lo crea el sistema automaticament
        //fechaCreacion: z.date(),          // lo crea el sistema automaticamente
        //debeCambiarPassword: z.boolean(), // lo crea el sistema automaticamente
    })
    
});
export type CrearUsuarioDTO = z.infer <typeof CrearUsuarioSchema>['body'];

export const LoginUsuarioSchema = z.object({
  body: z.object({
    email: z.email({error:"Email Inválido"}),
    password: z.string().min(1, 'La contraseña es obligatoria')
  })
});

export type LoginUsuarioDTO = z.infer<typeof LoginUsuarioSchema>['body'];

