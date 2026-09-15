/*const respuestaEstandar = (res, status, success,message, data = null) => {
  res.status(status).json({
    success: success,
    timestamp: new Date().toISOString(),
    mensaje: message,
    total: Array.isArray(data) ? data.length : (data ? 1 : 0), //si data es un array, devuelve su longitud; si data es un objeto, devuelve 1; si data es null, devuelve 0
    datos: data
  });
};

module.exports = respuestaEstandar;
*/
import { Response } from "express";

const respuestaEstandar = (res:Response, status:number, success: boolean, message: string, data: unknown = null) => {
    return res.status(status).json({
        success,
        timestamp: new Date().toISOString(),
        message,
        total: Array.isArray(data) ? data.length : data ? 1 : 0,
        data
        });
};

export default respuestaEstandar;
