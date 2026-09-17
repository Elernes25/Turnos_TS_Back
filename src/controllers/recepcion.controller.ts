const mongoose=require('mongoose');
const Turno=require('../models/turno.js');
const Paciente=require('../models/paciente.js');
import {respuestaEstandar} from '../utils/respuestaEstandar.ts';
import { Request, Response } from 'express';
import { RegistrarIngresoDTO } from '../interfaces/Recepcion/RecepcionDTO.ts';
import { EstadoTurno } from '../interfaces/TurnoEstado.enum.ts';

const registrarIngreso = async (req: Request<unknown, unknown,RegistrarIngresoDTO>, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        /* se hace transaction porque tiene que traer datos de diferentes esquemas */
        const {datosPaciente, especialidad, fechaTurno, estado, observaciones}=req.body;

        /*acá deberia validar si ese paciente es nuevo o uno existente
        dependiendo de como seria el FRONTEND */

        const [nuevoPaciente]=await Paciente.create([datosPaciente],{session});
        const [nuevoTurno]=await Turno.create([{
            paciente: nuevoPaciente._id,
            especialidad,
            fechaTurno,
            estado: estado || EstadoTurno.PENDIENTE,
            observaciones
        }], {session}
        );
        await session.commitTransaction();
        session.endSession;

        const turnoCompleto = await Turno.findById(nuevoTurno.id).populate('paciente');
        return respuestaEstandar(res, 201, true, "ingreso paciente nuevo", turnoCompleto);

    } catch (error:any){
        await session.abortTransaction();
        session.endSession();

        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err:any) => err.message);
            return respuestaEstandar(res, 400, false, 'Error de validación', errores);
        }
        return respuestaEstandar(res, 400, false, "transaccion abortada", error.message);
    }


};
export { registrarIngreso };
  
