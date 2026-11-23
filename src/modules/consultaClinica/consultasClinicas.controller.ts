import type { Request, Response } from 'express';
import { isValidObjectId, type QueryFilter } from 'mongoose';
import ConsultaClinica from './ConsultasClinicas';
import Paciente from '../pacientes/paciente';
import Medico from '../medicos/medico';
import { respuestaEstandar } from '../../utils/respuestaEstandar';
import type { IConsultaClinica } from './types/ConsultasClinicas.interfase';
import type { ActualizarObservacionesDTO, CrearConsultaDTO } from './dtos/ConsultaClinicaSchema';

type ConsultaIdParams = { id: string };
type PacienteIdParams = { pacienteId: string };
type MedicoIdParams = { medicoId: string };

const camposRelacionados = () => [
  { path: 'pacienteId', select: 'nombre dni' },
  { path: 'medicoId', select: 'nombre especialidad' }
];

const crearConsulta = async ( req: Request<unknown, unknown, CrearConsultaDTO>,  res: Response) => {
  try {
    const { pacienteId, medicoId } = req.body;
    console.log("BODY:", req.body);
    console.log("medicoId:", req.body.medicoId);
    /*
    const [paciente, medico] = await Promise.all([
      Paciente.findById(pacienteId),
      Medico.findById(medicoId)
    ]);*/
    /*
    const paciente = await Paciente.findOne({ pacienteId });
    
    const medico = await Medico.findOne({ usuario: medicoId});
    
    console.log("Paciente encontrado:", paciente?._id);
    console.log("Medico encontrado:", medico);
*/
console.log(
  await Paciente.findById(pacienteId)
);

console.log(
  await Medico.findOne({ usuario: medicoId })
);




   // if (!paciente) { return respuestaEstandar(res, 404, false, 'No se encontró el Paciente');  }
   // if (!medico) { return respuestaEstandar(res, 404, false, 'No se encontró el Médico'); }

    const consulta = await ConsultaClinica.create({ ...req.body,fecha: new Date() });
    await consulta.populate(camposRelacionados());

    return respuestaEstandar(res, 201, true, 'Consulta clínica creada correctamente', consulta);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return respuestaEstandar(res, 500, false, 'Error al crear la consulta clínica', mensaje);
  }
};

const obtenerConsultas = async (_req: Request, res: Response) => {
  try {
    const consultas = await ConsultaClinica.find()
      .populate(camposRelacionados())
      .sort({ fecha: -1 });

    return respuestaEstandar(res, 200, true, 'Consultas clínicas obtenidas correctamente', consultas);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return respuestaEstandar(res, 500, false, 'Error al obtener las consultas clínicas', mensaje);
  }
};

const obtenerConsultasPorPaciente = async ( req: Request<PacienteIdParams>, res: Response
) => obtenerConsultasPorReferencia(res, 'pacienteId', req.params.pacienteId);

const obtenerConsultasPorMedico = async ( req: Request<MedicoIdParams>, res: Response
) => obtenerConsultasPorReferencia(res, 'medicoId', req.params.medicoId);

/* puede ser por medico o paciente */
const obtenerConsultasPorReferencia = async ( res: Response, campo: 'pacienteId' | 'medicoId', id: string
) => {
  if (!isValidObjectId(id)) {
    return respuestaEstandar(res, 400, false, 'El ID no es válido');
  }

  try {
    const filtro: QueryFilter<IConsultaClinica> = { [campo]: id };
    const consultas = await ConsultaClinica.find(filtro)
      .populate(camposRelacionados())
      .sort({ fecha: -1 });

    return respuestaEstandar(res, 200, true, 'Consultas clínicas obtenidas correctamente', consultas);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return respuestaEstandar(res, 500, false, 'Error al obtener las consultas clínicas', mensaje);
  }
};

/*patch para modificar una consulta vieja */
const actualizarObservaciones = async (
  req: Request<ConsultaIdParams, unknown, ActualizarObservacionesDTO>,
  res: Response
) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return respuestaEstandar(res, 400, false, 'El ID de la consulta no es válido');
  }

  try {
    const consulta = await ConsultaClinica.findByIdAndUpdate(
      id,
      { $set: { observaciones: req.body.observaciones } },
      { new: true, runValidators: true }
    ).populate(camposRelacionados());

    if (!consulta) {
      return respuestaEstandar(res, 404, false, 'Consulta clínica no encontrada');
    }

    return respuestaEstandar(res, 200, true, 'Observaciones actualizadas correctamente', consulta);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return respuestaEstandar(res, 500, false, 'Error al actualizar las observaciones', mensaje);
  }
};

export { crearConsulta, obtenerConsultas, obtenerConsultasPorPaciente, obtenerConsultasPorMedico, actualizarObservaciones};

