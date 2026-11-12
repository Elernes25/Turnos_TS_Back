import Medico from '../medicos/medico';
import {respuestaEstandar} from '../../utils/respuestaEstandar';
import type { Request, Response } from 'express';
import type { CrearMedicoDTO,EditarMedicoDTO } from './dtos/Medico.schema';
import Agenda from '../medicos/agenda.medicos';

// GET: listar medicos
const getMedicos = async (req: Request<unknown, unknown, unknown, { dni?: string} >, res: Response) => {
  try {
    const {dni}=req.query;  /*filtrar por DNI  */
    const filtro: Record<string, any> = {};

    if (dni){ filtro.dni=dni; }
    console.log("filtro armado", filtro);
    //const medicos = await Medico.find(filtro);
    const medicos = await Medico.find(filtro).populate('especialidad');

    return respuestaEstandar(res, 200, true, "Medicos obtenidos correctamente", medicos);
  } catch (error:any) {
    return respuestaEstandar(res, 500, false, "Error al obtener los medicos", error.message);
  
    }
};

const getMedicoPorId = async ( req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const medico = await Medico.findById(id).populate('especialidad');
    if (!medico) {
      return respuestaEstandar( res, 404, false, 'Médico no encontrado' );
    }
    return respuestaEstandar( res, 200,true,'Médico obtenido correctamente', medico);
  } catch (error:any) {
    return respuestaEstandar( res, 500, false, 'Error al obtener el médico', error.message );
  }
};


//getConAgenda
const getConAgenda = async ( req: Request<unknown, unknown, unknown, unknown>,  res: Response) => {
  try {
    const medicos = await Medico.find().populate('especialidad');
    const agendas = await Agenda.find();

    const medicosConAgenda = medicos.map((medico) => {
      const agenda = agendas.find((agenda) => agenda.medicoId.toString() === medico._id.toString());
      //return {  ...medico.toObject(), agenda: agenda ?? null,  };
      return {
          id: medico._id.toString(),
          nombre: medico.nombre,
          numeroMatricula: medico.numeroMatricula,
          especialidad: medico.especialidad.map((esp: any) => ({
            id: esp._id.toString(),
            nombre: esp.nombre,
          })),
          agenda: agenda ? { duracionTurnoMinutos: agenda.duracionTurnoMinutos, }: null,
        };

    });

    return respuestaEstandar( res, 200, true, 'Médicos y Agendas obtenidos correctamente', medicosConAgenda );
  } catch (error: any) {
    return respuestaEstandar( res, 500,false,'Error al obtener los médicos', error.message );
  }
};

// POST: guardar medico
const createMedico = async (req: Request <unknown, unknown, CrearMedicoDTO>, res: Response) => {
  try {
    const nuevoMedico = new Medico(req.body);
    await nuevoMedico.save();
    return respuestaEstandar(res, 201, true, "Medico creado exitosamente", nuevoMedico);
  } catch (error:any) {
    return respuestaEstandar(res, 400, false, "Error al crear el medico", error.message);
  }
};

//DELETE: eliminar medico por ID Ej: http://localhost:3000/api/v1/medicos/6a5945fdf6215d646538767e
const deleteMedico = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;   /*id, definido en la ruta*/
    /*TODO: hacer borrado logico? */
    const medico = await Medico.findByIdAndDelete(id);
    if (!medico) {
      return respuestaEstandar(res, 404, false, `Medico no encontrado ${id}`);
    }
    //elimina agendas si tiene agenda
    await Agenda.deleteOne({ medicoId: id });
    return respuestaEstandar(res, 200, true, "Medico eliminado exitosamente", medico);
  } catch (error:any) {
      return respuestaEstandar(res, 400, false, "ID con formato invalido", error.message);
  }
};

//PUT: 
const editarMedico = async (req: Request <{ id: string }, unknown, EditarMedicoDTO>, res: Response) =>{
  console.log("ID recibido:", req.params.id);
  console.log("Body recibido:", req.body);
  try {
    const { id } = req.params;
    const medico = await Medico.findOneAndReplace({ _id: id }, req.body, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!medico) {
      return respuestaEstandar(res, 404, false, `Medico no encontrado ${id}`);
    }
    return respuestaEstandar(res, 200, true, "Medico Editado exitosamente", medico);
  } catch (error:any) {
      return respuestaEstandar(res, 400, false, "ID con formato invalido", error.message);
  }

};

export { getMedicos, createMedico, deleteMedico, editarMedico, getConAgenda, getMedicoPorId };
