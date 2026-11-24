import mongoose from 'mongoose';
import type { Request, Response } from 'express';
import Paciente from '../pacientes/paciente.js';
import Turno from '../turnos/turno.js';
import { EstadoTurno } from '../interfaces/TurnoEstado.enum.js';
import type { RegistrarIngresoDTO } from '../recepcion/dtos/Recepcion.schema.js';
import {respuestaEstandar} from '../../utils/respuestaEstandar.js';

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


