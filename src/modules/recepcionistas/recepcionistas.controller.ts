import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import Usuario from '../login/auth/Usuario.model.js';
import { Rol } from '../interfaces/Rol.enum.js';
import { respuestaEstandar } from '../../utils/respuestaEstandar.js';
import type { CrearRecepcionistaDTO, EditarRecepcionistaDTO } from './dtos/recepcionista.schema.js';
import Recepcionista from './recepcionista.js';

const getRecepcionistas = async (_req: Request, res: Response) => {
  try {
    const recepcionistas = await Recepcionista.find();
    return respuestaEstandar(res, 200, true, 'Recepcionistas obtenidos correctamente', recepcionistas);
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : String(error);
    return respuestaEstandar(res, 500, false, 'Error al obtener las recepcionistas', mensaje);
  }
};

const getRecepcionistaPorId = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const recepcionista = await Recepcionista.findById(req.params.id);
    if (!recepcionista) {
      return respuestaEstandar(res, 404, false, 'Recepcionista no encontrada');
    }
    return respuestaEstandar(res, 200, true, 'Recepcionista obtenida correctamente', recepcionista);
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : String(error);
    return respuestaEstandar(res, 500, false, 'Error al obtener la recepcionista', mensaje);
  }
};

const createRecepcionista = async (   req: Request<unknown, unknown, CrearRecepcionistaDTO>, res: Response) => {
  const session = await mongoose.startSession();
  try {
    const { usuario: credenciales, ...datosRecepcionista } = req.body;
    const nuevaRecepcionista = await session.withTransaction(async () => {
      const passwordHash = await bcrypt.hash(credenciales.password, await bcrypt.genSalt(10));
      const [nuevoUsuario] = await Usuario.create([{
        email: datosRecepcionista.email,
        user: credenciales.user,
        dni: datosRecepcionista.dni,
        password: passwordHash,
        rol: Rol.RECEPCIONISTA,
        activo: true,
        fechaCreacion: new Date(),
        debeCambiarPassword: true,
      }], { session });

      if (!nuevoUsuario) {
        throw new Error('No se pudo crear el usuario de la recepcionista');
      }

      const [recepcionista] = await Recepcionista.create([{
        ...datosRecepcionista,
        usuario: nuevoUsuario._id,
      }], { session });

      if (!recepcionista) {
        throw new Error('No se pudo crear la recepcionista');
      }

      return recepcionista;
    });

    if (!nuevaRecepcionista) {
      throw new Error('No se pudo completar la transacción de creación de la recepcionista');
    }

    return respuestaEstandar(res, 201, true, 'Recepcionista creada exitosamente', nuevaRecepcionista);
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : String(error);
    return respuestaEstandar(res, 400, false, 'Error al crear la recepcionista', mensaje);
  } finally {
    await session.endSession();
  }
};

const editarRecepcionista = async (req: Request<{ id: string }, unknown, EditarRecepcionistaDTO>, res: Response) => {
  try {
    const recepcionista = await Recepcionista.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!recepcionista) {
      return respuestaEstandar(res, 404, false, 'Recepcionista no encontrada');
    }
    return respuestaEstandar(res, 200, true, 'Recepcionista actualizada exitosamente', recepcionista);
  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : String(error);
    return respuestaEstandar(res, 400, false, 'Error al actualizar Recepcionista', mensaje);
  }
};

export { createRecepcionista, editarRecepcionista, getRecepcionistaPorId, getRecepcionistas };
