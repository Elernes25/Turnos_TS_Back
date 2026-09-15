import { TipoTelefono } from "../interfaces/TipoTelefono.enum.ts";

export interface SubinterfaceTelefono {
    tipo: TipoTelefono;
    codigoPais: string;
    codigoArea: string;
    numero: string;
}