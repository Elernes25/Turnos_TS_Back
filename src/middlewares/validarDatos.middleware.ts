import type { Request,Response,NextFunction } from "express";
import { ZodObject,ZodError } from "zod";
import { respuestaEstandar } from "../utils/respuestaEstandar";

/*recibe un objeto Zod como parámetro y devuelve una función nueva (el middleware).
Es un patrón llamado currying (o "función que devuelve función"),
muy común para crear middlewares configurables en Express. */

//*schema:ZodObject para poder recibir diferentes schemas*/
export const validarSchema = (schema:ZodObject) => (req:Request,res:Response,next:NextFunction) =>{
    try{
        console.log("📥 Body recibido:", req.body);
        console.log("📥 Params recibidos:", req.params);
        console.log("📥 Query recibida:", req.query);

        schema.parse({
            body:req.body,
            query: req.query,
            params:req.params
        });
        next();
    }catch (error:any) {
        if (error instanceof ZodError) {
            return respuestaEstandar (res,400,false,"Datos invalidos desde validarDatos",error.message)
        }
        next(error);
    }

}
/*Datos:  Mongoose no valida "solo lo que cambió" en un .save() — valida el documento completo,
 de punta a punta, cada vez.
 Con documentos independientes, un insertOne de una consulta nueva solo valida esa consulta,
 sin arrastrar problemas de consultas viejas de otros pacientes o de antes de un cambio de schema. 
 Con un array embebido, cualquier "basura" histórica en el array te puede trabar futuras escrituras
 sobre ese mismo documento, aunque la basura no tenga nada que ver con lo que estás agregando ahora.*/