import { Request, Response } from 'express';
import Especialidad from '../models/especialidad';
import {respuestaEstandar} from '../utils/respuestaEstandar';


const getEspecialidades = async (req: Request, res: Response) => {
  try {
    const listaEspecialidades = await Especialidad.find();

    return respuestaEstandar( res, 200, true, 'Especialidades obtenidas exitosamente', listaEspecialidades );
  } catch (error) {
    return respuestaEstandar( res, 500, false, 'Error interno del servidor', error);
  }
};
const deleteEspecialidad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const especialidad = await Especialidad.findByIdAndDelete(id);

    if (!especialidad) {
      return respuestaEstandar(res, 404, false, 'Especialidad no encontrada', null);
    }

    return respuestaEstandar(res, 200, true, 'Especialidad eliminada exitosamente', especialidad);
  } catch (error) {
    return respuestaEstandar(res, 500, false, 'Error interno del servidor', error);
  }
};

const createEspecialidad = async (req: Request, res: Response) => {
  try {
    const nuevaEspecialidad = await Especialidad.create(req.body);

    return respuestaEstandar(res,201, true,'Especialidad creada exitosamente', nuevaEspecialidad);
  } catch (error) {
    return respuestaEstandar(
      res,
      500,
      false,
      'Error interno del servidor',
      error
    );
  }
};

export { getEspecialidades, createEspecialidad, deleteEspecialidad};