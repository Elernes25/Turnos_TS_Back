/*para que los desarrolladores sepan cual es el error que estamos capturando */
import { Request,Response,NextFunction } from "express";

export const rutaNoEncontrada = (req:Request, res:Response, next:NextFunction) => {
  res.status(404).json({
    success: false,
    timestamp: new Date().toISOString(),    
    error: 'Ruta no encontrada (404)',
    message: `La ruta ${req.originalUrl} no existe en el servidor`
  });
}

//module.exports = rutaNoEncontrada;
