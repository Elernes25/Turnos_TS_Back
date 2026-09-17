import { Request, Response } from 'express';
import { PacienteDTO } from '../interfaces/PacientesRequest/PacienteDTO.ts';  
import {respuestaEstandar} from '../utils/respuestaEstandar.ts';

const Paciente = require('../models/paciente.js');


// GET: listar pacientes
const getPacientes = async (req: Request<unknown, unknown, unknown, { obraSocialNombre?: string; dni?: string } >, res: Response) => {
  try {
      // ?obraSocial=OSDE@dni=23074839
      const {obraSocialNombre, dni}=req.query;
      //"Record<string, any>: Un objeto cuyas claves son string y cuyos valores pueden ser de cualquier tipo (any)."
      // No sabes de antemano qué propiedades tendrá filtro (puede tener obraSocialNombre, dni, o ninguna).
      // Tampoco sabes el tipo exacto de cada valor (puede ser string, number, etc.).
      // Por eso se usa Record<string, any>: permite crear un objeto flexible con claves dinámicas.//
      const filtro: Record<string, any> = {}
      
      if (obraSocialNombre){filtro.obraSocialNombre= obraSocialNombre.toUpperCase();}
      if (dni){ filtro.dni=dni; }

      console.log("filtro armado", filtro);
      const pacientes = await Paciente.find(filtro);

      return respuestaEstandar(res, 200, true, "Pacientes obtenidos correctamente", pacientes);
  } catch (error: any) {
    return respuestaEstandar(res, 500, false, "Error al obtener los pacientes", error.message);
  }
};

// POST: guardar paciente
const createPacientes = async (req: Request<unknown, unknown, PacienteDTO>, res: Response) => {
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
      const paciente = await Paciente.findByIdAndDelete(id);
      if (!paciente) {
        return respuestaEstandar(res, 404, false, `Paciente no encontrado ${id}`);
      }
    return respuestaEstandar(res, 200, true, "Paciente eliminado exitosamente", paciente);
  } catch (error: any) {
      return respuestaEstandar(res, 400, false, "ID con formato invalido", error.message);
  }
};


//module.exports = { getPacientes, getPacientesDNI, createPacientes, deletePacientes };
export { getPacientes, createPacientes, deletePacientes };