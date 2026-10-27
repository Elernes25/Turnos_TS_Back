import type { Response, Request,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { respuestaEstandar } from "../utils/respuestaEstandar";
import type { ITokenPayload } from "../modules/interfaces/TokenPayload";


//agregar una nueva propiedad al Request de Express para que pueda recibir req.usuario
declare global{
    namespace Express {
        interface Request {
            usuario?: ITokenPayload
        }
    }
}
export const validarJWT = (req:Request,res:Response,next: NextFunction) =>{
    const headerAuth = req.headers.authorization as string;
    if(!headerAuth || !headerAuth.startsWith('Bearer')){
        return respuestaEstandar (res,401, false,'No hay token en la peticion' );
    }
    //en el indice 0 del array va a esta Bearer, en el 1 va a estar el token //
    const token = headerAuth.split(' ')[1] as string;
    try{
        const decodificado = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as ITokenPayload;
        req.usuario = decodificado;
        next();

    }catch(error:any){
        return respuestaEstandar(res,401,false,'El token es inválido o ha expirado');
    }
}
