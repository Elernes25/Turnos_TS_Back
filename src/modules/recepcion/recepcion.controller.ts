import mongoose from "mongoose";
import type { Request, Response } from "express";

import Paciente from "../pacientes/paciente";
import Turno from '../turnos/turno';

import { EstadoTurno } from "../interfaces/TurnoEstado.enum";
import type { RegistrarIngresoDTO } from "../recepcion/dtos/Recepcion.schema";
import {respuestaEstandar} from '../../utils/respuestaEstandar';

const registrarIngreso = async ( req: Request<unknown, unknown, RegistrarIngresoDTO>,res: Response) => {
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();
        const {
            datosPaciente,
            especialidadId,
            medicoId,
            fechaTurno,
            estado,
            observaciones
        } = req.body;

        // Crear paciente
        const nuevoPaciente = new Paciente(datosPaciente);

        await nuevoPaciente.save({ session });

        // Crear turno
        const nuevoTurno = new Turno({
            pacienteId: nuevoPaciente._id,
            especialidadId,
            medicoId,
            fechaTurno,
            estado: estado ?? EstadoTurno.PENDIENTE,
            observaciones: observaciones ?? ""
        });
        await nuevoTurno.save({ session });
        await session.commitTransaction();
        const turnoCompleto = await Turno.findById(nuevoTurno._id)
            .populate("pacienteId")
            .populate("especialidadId")
            .populate("medicoId");

        return respuestaEstandar( res,201, true, "Ingreso registrado correctamente",turnoCompleto);
    } catch (error: any) {
        await session.abortTransaction();
        return respuestaEstandar( res, 400, false, "Transacción abortada", error.message );
    } finally {
        await session.endSession();
    }
};

export { registrarIngreso };


/*
import mongoose from 'mongoose';
import Turno from '../turnos/turno';
import Paciente from '../pacientes/paciente';
import {respuestaEstandar} from '../../utils/respuestaEstandar';
import type { Request, Response } from 'express';
import type { RegistrarIngresoDTO } from './dtos/Recepcion.schema';
import { EstadoTurno } from '../interfaces/TurnoEstado.enum';
//import type{ Especialidad } from '../interfaces/Especialidad.interface';

const registrarIngreso = async (req: Request<unknown, unknown, RegistrarIngresoDTO>, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        // se hace transaction porque tiene que traer datos de diferentes esquemas 
        const {datosPaciente, especialidad, fechaTurno, estado, observaciones}=req.body;

        //acá deberia validar si ese paciente es nuevo o uno existente
        dependiendo de como seria el FRONTEND //

        const [nuevoPaciente] = await Paciente.create([datosPaciente], { session });
        if(!nuevoPaciente) { throw new Error('No se pudo crear el paciente') }

        const [nuevoTurno] = await Turno.create([{
            paciente: nuevoPaciente._id,
            especialidad,   //ya le deberia llegar el ID en forma de string
            fechaTurno,
            estado: estado || EstadoTurno.PENDIENTE,
            observaciones: observaciones ?? "",
        }], { session });
        
        if(!nuevoTurno) { throw new Error('No se pudo crear el turno') }

        await session.commitTransaction();
        await session.endSession();

        const turnoCompleto = await Turno.findById(nuevoTurno._id).populate('paciente');
        return respuestaEstandar(res, 201, true, "ingreso paciente nuevo", turnoCompleto);

    } catch (error:any){
        await session.abortTransaction();
        //session.endSession();
        return respuestaEstandar(res, 400, false, "transaccion abortada", error.message);
    } finally {
        await session.endSession();
    }


};
export { registrarIngreso };
*/
