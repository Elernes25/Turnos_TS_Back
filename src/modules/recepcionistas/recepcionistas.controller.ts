import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import Usuario from '../login/auth/Usuario.model';
import { Rol } from '../interfaces/Rol.enum';
import { respuestaEstandar } from '../../utils/respuestaEstandar';
import type { CrearRecepcionistaDTO } from './dtos/recepcionista.schema';
import Recepcionista from './recepcionista';

const createRecepcionista = async (
  req: Request<unknown, unknown, CrearRecepcionistaDTO>,
  res: Response
) => {
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

export { createRecepcionista };
