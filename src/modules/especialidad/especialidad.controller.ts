import type { Request, Response } from 'express';
import Especialidad from '../especialidad/especialidad';
import {respuestaEstandar} from '../../utils/respuestaEstandar';
import type { CrearEspecialidadDTO } from './dtos/Especialidad.schema';

/* GET */
const getEspecialidades = async (req: Request, res: Response) => {
  try {
    const listaEspecialidades = await Especialidad.find();

    return respuestaEstandar( res, 200, true, 'Especialidades obtenidas exitosamente', listaEspecialidades );
  } catch (error:any) {
    return respuestaEstandar( res, 500, false, 'Error interno del servidor', error.message);
  }
};

/* DELETE */
const deleteEspecialidad = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const especialidad = await Especialidad.findByIdAndDelete(id);

    if (!especialidad) {
      return respuestaEstandar(res, 404, false, 'Especialidad no encontrada', null);
    }
    return respuestaEstandar(res, 200, true, 'Especialidad eliminada exitosamente', especialidad);

  } catch (error:any) {
    return respuestaEstandar(res, 500, false, 'Error interno del servidor', error.message);
  }
};

/* POST */
const createEspecialidad = async (req: Request<unknown, unknown, CrearEspecialidadDTO>, res: Response) => {
  try {
    const nuevaEspecialidad = await Especialidad.create(req.body);
    return respuestaEstandar(res,201, true,'Especialidad creada exitosamente', nuevaEspecialidad);

  } catch (error:any) {
    console.log(error.message);
    return respuestaEstandar(res,500, false,'Error interno del servidor', error.message);

  }
};

//PUT: 
const editarEspecialidad= async (req: Request <{ id: string }, unknown, CrearEspecialidadDTO>, res: Response) =>{
  console.log("ID recibido:", req.params.id);
  console.log("Body recibido:", req.body);
  try {
    const { id } = req.params;
    const especialidad = await Especialidad.findOneAndReplace({ _id: id }, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!especialidad) {
      return respuestaEstandar(res, 404, false, `Medico no encontrado ${id}`);
    }
    return respuestaEstandar(res, 200, true, "Medico Editado exitosamente", especialidad);
  } catch (error:any) {
      return respuestaEstandar(res, 400, false, "ID con formato invalido", error.message);
  }

};


export { getEspecialidades, createEspecialidad, deleteEspecialidad,editarEspecialidad};