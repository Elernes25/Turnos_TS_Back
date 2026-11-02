import {z} from "zod";
import { TipoTelefono } from './Tipotelefono.enum';

export const SubinterfaceTelefono = z.object({
  tipo: z.enum(TipoTelefono, { error: "Tipo de teléfono inválido" }),
  codigoPais: z.string().trim().min(1, { error: "Código de país obligatorio" }).default("54"),
  codigoArea: z.string().trim().min(1, { error: "Código de área obligatorio" }).default("3777"),
  numero: z.string().min(1, { error: "El número es obligatorio" }),
});




