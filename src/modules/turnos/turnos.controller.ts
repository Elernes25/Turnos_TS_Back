import mongoose, { type QueryFilter, isValidObjectId } from 'mongoose';
import type {Request, Response} from 'express';
import {EstadoTurno} from '../interfaces/TurnoEstado.enum.js';
import Turno from '../turnos/turno.js';
import {respuestaEstandar} from '../../utils/respuestaEstandar.js';
import type { CrearTurnoDTO, QueryUrgencia, ReprogramarTurnoDTO } from '../turnos/dtos/turno.Schema.js';
import type { ITurno } from '../turnos/types/Turno.interface.js';
import { emitirTurnoAtendido } from './turnos.websocket.js';


/*En Express, el tipo genérico Request<ParamsDictionary, ResBody, ReqBody, ReqQuery>  
      ParamsDictionary → corresponde a req.params  
      Ejemplo: en la ruta /paciente/:id, el id está en req.params.id.

      ResBody → corresponde al tipo de la respuesta que vas a devolver con res.json(...).
      No se usa mucho en el req, pero sirve para tipar qué estructura tendrá la respuesta.

      ReqBody → corresponde a req.body  
      Ejemplo: datos enviados en un POST con JSON ({ nombre: "Ernesto", dni: "123" }).

      ReqQuery → corresponde a req.query  
      Ejemplo: en /paciente?activo=true, el activo está en req.query.activo.
*/

// GET: listar turnos con filtros dinámicos
interface GetTurnosQuery {
  id?: string;
  especialidadId?: string;
  pacienteId?: string;
  medicoId?: string;
  activo?: 'true' | 'false';
}

const getTurnos = async (req: Request<unknown, unknown, unknown, GetTurnosQuery>, res: Response) => {
  try {
    const { id, especialidadId, pacienteId, medicoId, activo } = req.query;

    // Validar IDs para evitar un CastError (500) con IDs mal formados
    const idsAValidar = { id, especialidadId, pacienteId, medicoId };
    for (const [campo, valor] of Object.entries(idsAValidar)) {
      if (valor !== undefined && !isValidObjectId(valor)) {
        return respuestaEstandar(res, 400, false, `El parámetro ${campo} no es un ID válido`);
      }
    }

    // Validar el flag activo
    if (activo !== undefined && activo !== 'true' && activo !== 'false') {
      return respuestaEstandar(res, 400, false, "El parámetro activo debe ser 'true' o 'false'");
    }

    // Construir filtros dinámicamente
    const filtros: QueryFilter<ITurno> = {};
    if (id) filtros._id = id;
    if (especialidadId) filtros.especialidadId = especialidadId;
    if (pacienteId) filtros.pacienteId = pacienteId;
    if (medicoId) filtros.medicoId = medicoId;
    if (activo !== undefined) filtros.activo = activo === 'true';

    console.log(filtros);
    
    const turnos = await Turno.find(filtros)
      .select('+activo')
      .populate('pacienteId')
      .populate('especialidadId')
      .populate('medicoId');

    if (turnos.length === 0) {
      return respuestaEstandar(res, 404, false, "No se encontraron turnos con esos filtros");
    }

    return respuestaEstandar<ITurno[]>(res, 200, true, "Turnos obtenidos correctamente", turnos);
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return respuestaEstandar(res, 500, false, "Error al obtener los turnos", mensaje);
  }
};


// POST: guardar turno
const createTurnos = async (req: Request<unknown, unknown, CrearTurnoDTO, QueryUrgencia>, res: Response) => {
  try {
    const origenPeticion=req.headers['x-origen'];
    console.log("peticion realizada desde",origenPeticion);
   
    // ?urgencia=true
    const esUrgente=req.query.urgencia ==='true';
    const datosDelTurno = {
     //*   paciente:req.body.pacienteID, especialidad:req.body.especialidadID, fechaTurno:req.body.fechaTurno, *//
        ...req.body, /*Referencia: toma todo lo que esta en el body del Request
                      /*En el caso de ...req.body, lo que haces es desestructurar y copiar todas las propiedades que vienen en el body */
        estado: esUrgente ? EstadoTurno.ATENDIDO : EstadoTurno.PENDIENTE,
        observaciones: esUrgente ? 'ingreso por Guardia Medica' : ""
    };
    if (esUrgente){ console.log("🚨 ALERTA: registrado un turno de urgencia"); }

    //const nuevoTurno = new Turno(req.body);
    //await nuevoTurno.save();
    const nuevoTurno = await Turno.create(datosDelTurno);
    //const turnoCompleto = (await nuevoTurno.populate("paciente")).toObject();
    /*POPULATE PARA vincular el id pero para mostrar el nombre del paciente*//*es decir formatear la salida */
    await nuevoTurno.populate("pacienteId"); /*populate con await*/

    return respuestaEstandar(res, 201, true, "Turno creado exitosamente", nuevoTurno ); 
  } catch (error:any) {
    if(error.name === 'ValidationError') {
      console.error("ERROR COMPLETO:", error);
      const errores=Object.values(error.errors).map( (err:any) => err.message);
      return respuestaEstandar(res, 400, false, "Error de validación", errores);
    } 
    console.error(error);
    return respuestaEstandar(res, 400, false, "Error al crear el turno", error.message);
  }
};

//DELETE: eliminar turno por ID Ej: http://localhost:3000/api/v1/turnos/6a5945fdf6215d646538767e
const deleteTurnos = async (req: Request<{id: string}>, res: Response) => {
  try {
    const { id } = req.params;
    const turnoBorrado = await Turno.findByIdAndUpdate(
        id,
        {activo: false, estado:EstadoTurno.CANCELADO }, //*cambios*/
        { new: true }      /*{new:true} devuelve el documento actualizado en lugar del original. */                               
      ); 
    if (!turnoBorrado) {
        return respuestaEstandar(res, 404, false, `Turno no encontrado ${id}`);
    }
      respuestaEstandar(res, 200, true, "Turno eliminado exitosamente", turnoBorrado);
    } catch (error:any) {
      return respuestaEstandar(res, 400, false, "ID con formato invalido", error.message);
    }
};

const marcarAtendido = async (req: Request<{id: string}>, res: Response)=>{
  try{
    const {id} =req.params;
    console.log("turno ID", id);
    const turnoActualizado = await Turno.findByIdAndUpdate (
      id,
      { estado: EstadoTurno.ATENDIDO },
      { returnDocument: 'after' }
    );

    if (!turnoActualizado) return respuestaEstandar(res, 404,false,'turno no encontrado ',id);
      emitirTurnoAtendido(turnoActualizado);
      return respuestaEstandar(res, 200,true,'turno Actualizado', turnoActualizado);

  } catch (error:any) {
    return respuestaEstandar(res, 500,false,'ID con formato no valido',error.message);
  }
};
/**********llamado en atencion..... */
const marcarEnAtencion = async (req: Request<{id: string}>, res: Response)=>{
  try{
    const {id} =req.params;
    console.log("turno ID", id);
    const turnoActualizado = await Turno.findByIdAndUpdate (
      id,
      { estado: EstadoTurno.ENATENCION },
      { returnDocument: 'after' }
    );

    if (!turnoActualizado) return respuestaEstandar(res, 404,false,'turno no encontrado ',id);
      return respuestaEstandar(res, 200,true,'turno Actualizado', turnoActualizado);

  } catch (error:any) {
    return respuestaEstandar(res, 500,false,'ID con formato no valido',error.message);
  }
};


//****CANCELADOS no atendidos */
const marcarCancelado = async (req: Request<{id: string}>, res: Response)=>{
  try{
    const {id} =req.params;
    const turnoCancelado = await Turno.findByIdAndUpdate (
      id,
      { estado: EstadoTurno.CANCELADO },
      { new: true }   //le indica a Mongoose que te devuelva el documento después de la actualización.
    );

    if (!turnoCancelado) return respuestaEstandar(res, 404,false,'Turno no encontrado ',id);
      return respuestaEstandar(res, 200,true,'Turno Cancelado', turnoCancelado);
  } catch (error:any) {
    return respuestaEstandar(res, 500,false,'ID con formato no valido',error.message);
  }
};

///**TODO **********VEMOS ************************ */
/*
const reprogramarTurno = async (
  req: Request<{id: string}, unknown, ReprogramarTurnoDTO>,
  res: Response
) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return respuestaEstandar(res, 400, false, 'ID con formato invalido', id);
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const turnoOriginal = await Turno.findById(id).session(session);
    if (!turnoOriginal) {
      await session.abortTransaction();
      return respuestaEstandar(res, 404, false, 'Turno no encontrado', id);
    }

    const turnoCancelado = await Turno.findByIdAndUpdate(
      id,
      {
        estado: EstadoTurno.CANCELADO,
        observaciones: 'REPROGRAMADO'
      },
      { session, new: true, runValidators: true }
    );
    if (!turnoCancelado) {
      throw new Error('No se pudo actualizar el turno original');
    }

    const nuevoTurno = new Turno({
      pacienteId: turnoOriginal.pacienteId,
      medicoId: turnoOriginal.medicoId,
      especialidadId: turnoOriginal.especialidadId,
      fechaTurno: req.body.fechaTurno,
      estado: EstadoTurno.PENDIENTE,
      observaciones: turnoOriginal.observaciones
    });
    await nuevoTurno.save({ session });

    await session.commitTransaction();
    return respuestaEstandar(res, 201, true, 'Turno reprogramado exitosamente', {
      turnoOriginal: turnoCancelado,
      nuevoTurno
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    const mensaje = error instanceof Error ? error.message : 'Error desconocido';
    return respuestaEstandar(res, 500, false, 'Error al reprogramar el turno', mensaje);
  } finally {
    await session.endSession();
  }
}; */

export  { getTurnos, createTurnos, deleteTurnos, marcarAtendido, marcarCancelado, marcarEnAtencion };