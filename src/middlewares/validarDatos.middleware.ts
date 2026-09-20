import type { Request,Response,NextFunction } from "express";
import { ZodObject,ZodError } from "zod";
import { respuestaEstandar } from "../utils/respuestaEstandar";

//*schema:ZodObject para poder recibir diferentes schemas*/
export const validarSchema = (schema:ZodObject) => (req:Request,res:Response,next:NextFunction) =>{
    try{
        schema.parse({
            body:req.body,
            query:req.body,
            params:req.params
        });
        next();
    }catch (error) {
        if (error instanceof ZodError) {
            respuestaEstandar (res,400,false,"Datos invalidos",error.message)
        }

    }

}