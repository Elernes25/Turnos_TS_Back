import { Types } from 'mongoose';
import type { Request, Response } from 'express';
import HistoriaClinica from './HistoriaClinica';
import Paciente from '../pacientes/paciente';
import Medico from '../medicos/medico';
import { SoloConsultas, type CrearConsultaDTO, type CrearHistoriaClinicaDTO, ConsultaClinicaSchema } from './dtos/HistoriaClinica.schema';
import type { IConsultaClinica } from './types/HistoriaClinica.interface';
import { respuestaEstandar } from '../../utils/respuestaEstandar';

/*POST */
const createHistoriaClinica = async ( req: Request<unknown, unknown, CrearHistoriaClinicaDTO>,res: Response) => {
  try {
    const { pacienteID, antecedentes, consultas } = req.body;

    const existePaciente = await Paciente.findById(pacienteID);
    if (!existePaciente) {
      return respuestaEstandar( res, 404,false,'No se encontró el paciente para asociar la Historia Clínica');
    }

    const existente = await HistoriaClinica.findOne({ pacienteID });
    if (existente) {
      return respuestaEstandar(res,400, false,'El paciente ya tiene una historia clínica registrada' );
    }

    const nuevaHistoria = new HistoriaClinica({ pacienteID, antecedentes, consultas });
    const historiaGuardada = await nuevaHistoria.save();

    return respuestaEstandar(res, 201,true,'Registro de Historia Clínica creado con éxito', historiaGuardada );
  } catch (error: any) {
    return respuestaEstandar( res,500,false,'Error en el servidor al registrar la Historia Clínica', error.message );
  }
};

/*GET */
const getHistoriasClinicas = async ( req: Request<unknown, unknown, unknown, { pacienteId?: string }>, res: Response) => {
  try {
    const { pacienteId } = req.query;
    const filtro: Record<string, any> = {};

    if (pacienteId) {
      filtro.pacienteID = pacienteId;
    }

    const historias = await HistoriaClinica.find(filtro)
      .populate('pacienteID', 'nombre dni email obraSocial.obraSocialNombre')
      .populate('consultas.medicoID', 'nombre especialidad')
      .sort({ fecha: -1 });

    return respuestaEstandar(res,200,true,'Historia Clínica obtenida correctamente',historias );
  } catch (error: any) {
    return respuestaEstandar(res,500,false,'Error al obtener historia clinica del paciente', error.message);
  }
};

/*PATCH  /api/v1/historiaClinica/6ab2890502818188a8625293 */
const agregarConsulta = async ( req: Request<{ id: string }, unknown, CrearConsultaDTO>, res: Response) => {
  try {
    const { id } = req.params;
    
    //const nuevaConsulta = new ConsultaClinicaSchema(req.body)
    //const nuevaConsulta = req.body;
    //const nuevoMedico = new Medico(req.body);
    //const nuevaConsulta : IConsultaClinica =
    //{
    //  ...req.body,    //desestructura campo a campo y transforma el string que viene del body.fecha a Date 
    //  fecha: new Date(req.body.fecha)
    //}
    if (!Types.ObjectId.isValid(req.body.medicoID)) {return respuestaEstandar(res,400,false,"el MedicoID no es un ID valido")}

    const existeMedico=await Medico.findById(req.body.medicoID);
    if (!existeMedico) { return respuestaEstandar(res,404,false,"no se encontro medico para ese ID") }

    const nuevaConsulta: IConsultaClinica = {
        ...req.body,
        fecha: new Date(req.body.fecha),
        medicoID: new Types.ObjectId(req.body.medicoID)
    };

    // 1. Buscar pacienteID para ver su historiaclinica
    //const historia = await HistoriaClinica.findById(id);
    const historia = await HistoriaClinica.findOne({ pacienteID: id });
    if (!historia) {
      return respuestaEstandar(res, 404, false, 'Historia clínica no encontrada');
    }
    // 2. Hacer el push nativo en el array
    historia.consultas.push(nuevaConsulta);

    // 3. Guardar (aquí se ejecutan validaciones)
    await historia.save();
    return respuestaEstandar(res, 200, true,'Consulta agregada correctamente', historia);

} catch (error: any) {
    return respuestaEstandar(res,500,false,'Error al agregar consulta', error.message);
  }
};


export { createHistoriaClinica, getHistoriasClinicas, agregarConsulta };
