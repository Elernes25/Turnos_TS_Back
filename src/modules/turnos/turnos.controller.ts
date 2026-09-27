import type {Request, Response} from 'express';
import {EstadoTurno} from '../interfaces/TurnoEstado.enum';
import Turno from '../turnos/turno';
import {respuestaEstandar} from '../../utils/respuestaEstandar';
import type { CrearTurnoDTO, QueryUrgencia } from '../turnos/dtos/turno.Schema';
import type { ITurno } from '../turnos/types/Turno.interface';
import { mainModule } from 'node:process';

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
const getTurnos = async (req: Request <unknown, unknown, unknown, { especialidad?: string; activo?: string; paciente?: string; id?: string }>, res: Response) => {
  try {
    // Extraer los query params
    const { especialidad, activo, paciente, id } = req.query;

    // Construir objeto de filtros dinámicamente
    const filtros: Record<string, any> = {};
    if (id) {filtros._id = id; 
      console.log("filtro por id", filtros._id);
    };
    if (especialidad) filtros.especialidad = especialidad;
    if (activo !== undefined) filtros.activo = activo === 'true'; // convertir string a boolean
    if (paciente) filtros.paciente = paciente; // si quieres filtrar por id de paciente

    // Consulta con filtros
    const turnos = await Turno.find(filtros).select('+activo').populate('paciente');

    if (turnos.length === 0) {        // if (!turnos)
      return respuestaEstandar(res, 404, false, "No se encontraron turnos con esos filtros");
    }
//*****probar *********/
//*** */    return respuestaEstandar<ITurno[]>(res, 200, true, "Turnos obtenidos correctamente", turnos); ***//
      return respuestaEstandar (res, 200, true, "Turnos obtenidos correctamente", turnos);
  } catch (error:any) {
    return respuestaEstandar(res, 500, false, "Error al obtener los turnos", error.message);
  }
};


// POST: guardar turno
const createTurnos = async (req: Request<unknown, unknown, CrearTurnoDTO, QueryUrgencia>, res: Response) => {
  try {
    const origenPeticion=req.headers['x-origen'];
    const tokenSeguridad=req.headers['authorization'];
    console.log("peticion realizada desde",origenPeticion);
    if (tokenSeguridad!="Token_seguridad_123"){
        return respuestaEstandar(res,401,false,'No tiene permisos')
    };

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
    return respuestaEstandar(res, 201, true, "Turno creado exitosamente", nuevoTurno.populate("paciente")); /*populate*/

  } catch (error:any) {
    if(error.name === 'ValidationError') {
      const errores=Object.values(error.errors).map( (err:any) => err.message);
      return respuestaEstandar(res, 400, false, "Error de validación", errores);
    } 
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
    const turnoActualizado = await Turno.findByIdAndUpdate (
      id,
      { estado: EstadoTurno.ATENDIDO },
      { new: true }
    );

    if (!turnoActualizado) return respuestaEstandar(res, 404,false,'turno no encontrado ',id);
      return respuestaEstandar(res, 200,true,'turno Actualizado', turnoActualizado);

  } catch (error:any) {
    return respuestaEstandar(res, 500,false,'ID con formato no valido',error.message);

  }

};

export  { getTurnos, createTurnos, deleteTurnos, marcarAtendido };