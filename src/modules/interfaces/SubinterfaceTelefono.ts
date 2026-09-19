import { TipoTelefono } from './Tipotelefono.enum';

export interface SubinterfaceTelefono {
    tipo: TipoTelefono;
    codigoPais: string;
    codigoArea: string;
    numero: string;
}