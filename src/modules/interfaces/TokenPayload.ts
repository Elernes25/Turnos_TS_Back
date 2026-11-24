import type{Rol} from './Rol.enum.js';

export interface ITokenPayload {
    id: string;
    user: string;
    rol: Rol;
    activo: boolean;
    debeCambiarPassword: boolean;
}
