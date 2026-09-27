import type { Request, Response } from 'express';
import type { CrearPacienteDTO, IQueryPacientes } from './dtos/Paciente.schema';  
import {respuestaEstandar} from '../../utils/respuestaEstandar';
import Paciente from '../pacientes/paciente';

// GET: listar pacientes
//const getPacientes = async (req: Request<unknown, unknown, unknown, { obraSocialNombre?: string; dni?: string } >, res: Response) => {
const getPacientes = async (req: Request<unknown, unknown, unknown, IQueryPacientes >, res: Response) => {
  try {
      // ?obraSocial=OSDE@dni=23074839
      const {obraSocialNombre, dni}=req.query;
      // Record<K, T> es un tipo genérico que construye un objeto donde:
      // K = tipo de las claves (keys).
      // T = tipo de los valores (values).
      // Record<string, any>: Un objeto cuyas claves son string y cuyos valores pueden ser de cualquier tipo (any).
      const filtro: Record<string, string> = {}
      
      if (obraSocialNombre) { filtro["obraSocial.obraSocialNombre"]= obraSocialNombre.toUpperCase() };
      if (dni) { filtro.dni= dni };

      console.log("filtro armado", filtro);
      const pacientes = await Paciente.find(filtro);

      return respuestaEstandar(res, 200, true, "Pacientes obtenidos correctamente", pacientes);
  } catch (error: any) {
      return respuestaEstandar(res, 500, false, "Error al obtener los pacientes", error.message);
  }
};

// POST: guardar paciente
const createPacientes = async (req: Request<unknown, unknown, CrearPacienteDTO>, res: Response) => {
  try {
      const nuevoPaciente = new Paciente(req.body);
      await nuevoPaciente.save();
      return respuestaEstandar(res, 201, true, "Paciente creado exitosamente", nuevoPaciente);
  } catch (error: any) {
      console.log(error.message);
      respuestaEstandar(res, 400, false, "Error al crear el paciente", error.message);
  }
};

//DELETE: eliminar paciente por ID Ej: http://localhost:3000/api/v1/pacientes/6a5945fdf6215d646538767e
const deletePacientes = async (req: Request<{ id: string }>, res: Response) => {
  try {
      const { id } = req.params;   /*id, definido en la ruta*/
      const pacienteBorrado = await Paciente.findByIdAndDelete(id);
      if (!pacienteBorrado) {
        return respuestaEstandar(res, 404, false, `Paciente no encontrado ${id}`);
      }
      return respuestaEstandar(res, 200, true, "Paciente eliminado exitosamente", pacienteBorrado);
  } catch (error: any) {
      return respuestaEstandar(res, 400, false, "ID con formato invalido", error.message);
  }
};


//module.exports = { getPacientes, getPacientesDNI, createPacientes, deletePacientes };
export { getPacientes, createPacientes, deletePacientes };