import Medico from '../medicos/medico.ts';
import {respuestaEstandar} from '../../utils/respuestaEstandar.ts';
import { Request, Response } from 'express';
import {MedicoDTO} from '../medicos/dtos/MedicoDTO.ts';

// GET: listar medicos
const getMedicos = async (req: Request<unknown, unknown, unknown, { dni?: string } >, res: Response) => {
  try {
    const {dni}=req.query;  /*filtrar por DNI */
    const filtro: Record<string, any> = {};

    if (dni){
      filtro.dni=dni;
    }
    console.log("filtro armado", filtro);
    const medicos = await Medico.find(filtro);

    return respuestaEstandar(res, 200, true, "Medicos obtenidos correctamente", medicos);
  } catch (error:any) {
    return respuestaEstandar(res, 500, false, "Error al obtener los medicos", error.message);
  
    }
};

// POST: guardar medico
const createMedico = async (req: Request <unknown, unknown, MedicoDTO>, res: Response) => {
  try {
    const nuevoMedico = new Medico(req.body);
    await nuevoMedico.save();
    return respuestaEstandar(res, 201, true, "Medico creado exitosamente", nuevoMedico);
  } catch (error:any) {
    return respuestaEstandar(res, 400, false, "Error al crear el medico", error.message);
  }
};

//DELETE: eliminar medico por ID Ej: http://localhost:3000/api/v1/medicos/6a5945fdf6215d646538767e
const deleteMedico = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;   /*id, definido en la ruta*/
    const medico = await Medico.findByIdAndDelete(id);
    if (!medico) {
      return respuestaEstandar(res, 404, false, `Medico no encontrado ${id}`);
    }
    return respuestaEstandar(res, 200, true, "Medico eliminado exitosamente", medico);
  } catch (error:any) {
      return respuestaEstandar(res, 400, false, "ID con formato invalido", error.message);
  }
};


export { getMedicos, createMedico, deleteMedico };
