import type { Response, Request,NextFunction } from "express";  //todos los middlewares reciben estos tres parametros//
import { respuestaEstandar } from "../utils/respuestaEstandar";
import { Rol } from "../modules/login/auth/Usuario.model";

// export const verificarRol = (...{rolesPermitidos}: String[]) => { 
// en el routes seria: verificarRol(Rol.ADMIN, Rol.RECEPCIONISTA) 
// en el caso siguiente el routes seria: verificarRol([Rol.ADMIN, Rol.RECEPCIONISTA]) 
export const verificarRol = (rolesPermitidos: Rol[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const usuario = req.usuario;
        if (!usuario) {
            return respuestaEstandar(res, 401, false, 'No se encontró información del usuario en la solicitud');
            //return respuestaEstandar(res, 500, false, 'Se intento verificar rol, pero no se encontro el token');
        }
        if (!usuario.activo) {
            return respuestaEstandar(res, 403, false, 'El usuario esta deshabilitado') 
        }

        if (!rolesPermitidos.includes(usuario.rol)) {
            return respuestaEstandar(res, 403, false, 'No tiene el rol correcto para acceder a este recurso');
        }
        next();
    };
};