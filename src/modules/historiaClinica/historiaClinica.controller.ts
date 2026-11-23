import { Types } from 'mongoose';
import type { Request, Response } from 'express';
import HistoriaClinica from './HistoriaClinica';
import Paciente from '../pacientes/paciente';
import Medico from '../medicos/medico';

import type { CrearHistoriaClinicaDTO, ActualizarHistoriaClinicaDTO } from './dtos/HistoriaClinica.schema';
import { respuestaEstandar } from '../../utils/respuestaEstandar';

/*POST */
const createHistoriaClinica = async ( req: Request<unknown, unknown, CrearHistoriaClinicaDTO>,res: Response) => {
  try {
    const { pacienteId, datosClinicos, antecedentes, modificacion } = req.body;

    const existePaciente = await Paciente.findById(pacienteId);
    if (!existePaciente) {
      return respuestaEstandar( res, 404,false,'No se encontró el paciente para asociar la Historia Clínica');
    }

    const existente = await HistoriaClinica.findOne({ pacienteId  });
    if (existente) {
      return respuestaEstandar(res,400, false,'El paciente ya tiene una historia clínica registrada' );
    }

    const nuevaHistoria = new HistoriaClinica({
      pacienteId: pacienteId,
      datosClinicos,
      antecedentes,
      modificacion
    });
    const historiaGuardada = await nuevaHistoria.save();

    return respuestaEstandar(res, 201,true,'Registro de Historia Clínica creado con éxito', historiaGuardada );
  } catch (error: any) {
    console.log("error historia clinica", error);
    return respuestaEstandar( res,500,false,'Error en el servidor al registrar la Historia Clínica', error.message );
  }
};

/*GET */
const getHistoriasClinicas = async ( req: Request<unknown, unknown, unknown, { pacienteId?: string }>, res: Response) => {
  try {
    const { pacienteId } = req.query;
    const filtro: Record<string, any> = {};

    if (pacienteId) { filtro.pacienteId = pacienteId; }

    const historia = await HistoriaClinica.find(filtro);
    /* 
    .populate({
        path: 'pacienteId',
        select: 'nombre dni email obraSocial',
        populate: { path: 'obraSocial.obraSocialID', select: 'nombreObraSocial' },
      })
      .populate('consultas.medicoId', 'nombre especialidad')
      .sort({ fecha: -1 });
    */
    return respuestaEstandar(res,200,true,'Historia Clínica obtenida correctamente',historia );
  } catch (error: any) {
    console.error(error);
    return respuestaEstandar(res,500,false,'Error al obtener historia clinica del paciente', error.message);
  }
};


/*PATCH /api/v1/historiaClinica/:id/:medicoId */
const actualizarHistoriaClinica = async (
  req: Request<{ id: string; medicoId: string }, unknown, ActualizarHistoriaClinicaDTO>,
  res: Response
) => {
  const { id, medicoId } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return respuestaEstandar(res, 400, false, 'El ID de la historia clínica o del paciente no es válido');
  }
  if (!Types.ObjectId.isValid(medicoId)) {
    return respuestaEstandar(res, 400, false, 'El ID del médico no es válido');
  }

  try {
    const existeMedico = await Medico.findById(medicoId);
    if (!existeMedico) {
      return respuestaEstandar(res, 404, false, 'No se encontró el médico');
    }

    const historiaPorId = await HistoriaClinica.findById(id);
    const historia = historiaPorId ?? await HistoriaClinica.findOne({ pacienteID: id });

    if (!historia) {
      return respuestaEstandar(res, 404, false, 'Historia clínica no encontrada');
    }

    const datosActualizados: Record<string, unknown> = {
      modificacion: {
        medicoId: new Types.ObjectId(medicoId),
        fecha: new Date()
      }
    };

    if (req.body.datosClinicos) {
      datosActualizados.datosClinicos = {
        ...historia.datosClinicos,
        ...req.body.datosClinicos
      };
    }

    if (req.body.antecedentes) {
      datosActualizados.antecedentes = {
        ...historia.antecedentes,
        ...req.body.antecedentes
      };
    }

    const historiaActualizada = await HistoriaClinica.findByIdAndUpdate(
      historia._id,
      { $set: datosActualizados },
      { new: true, runValidators: true }
    );

    return respuestaEstandar(res, 200, true, 'Historia clínica modificada correctamente', historiaActualizada);
  } catch (error: any) {
    return respuestaEstandar(res, 500, false, 'Error al modificar la historia clínica', error.message);
  }
};


export { createHistoriaClinica, getHistoriasClinicas, actualizarHistoriaClinica };
