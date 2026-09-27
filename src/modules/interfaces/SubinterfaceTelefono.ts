import {z} from "zod";
import { TipoTelefono } from './Tipotelefono.enum';

export const SubinterfaceTelefono = z.object ({
  tipo: z.enum(TipoTelefono,{error:""}),
  codigoPais: z.string(),
  codigoArea: z.string(),
  numero: z.string(),
    
})