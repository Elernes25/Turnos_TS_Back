import type { Request, Response } from 'express';
import Auditoria from '../../middlewares/auditoriaAcciones/auditoriaSchema.js';
import { respuestaEstandar } from '../../utils/respuestaEstandar.js';

export const getAuditorias = async (_req: Request, res: Response) => {
  try {
    const auditorias = await Auditoria.find()
      .sort({ fecha: -1 })
      .populate('usuario', 'user email rol');

    return respuestaEstandar(res, 200, true, 'Auditorías obtenidas correctamente', auditorias);
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : String(error);
    return respuestaEstandar(res, 500, false, 'Error al obtener las auditorías', mensaje);
  }
};
