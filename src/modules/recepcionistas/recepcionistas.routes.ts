import { Router } from 'express';
import { validarSchema } from '../../middlewares/validarDatos.middleware.js';
import { validarJWT } from '../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../middlewares/verificarRol.middleware.js';
import { Rol } from '../interfaces/Rol.enum.js';
import { CrearRecepcionistaSchema, EditarRecepcionistaSchema, RecepcionistaPorIdSchema } from './dtos/recepcionista.schema.js';
import { createRecepcionista, editarRecepcionista, getRecepcionistaPorId, getRecepcionistas } from './recepcionistas.controller.js';

const router = Router();

router.get('/', validarJWT, verificarRol([Rol.ADMIN, Rol.SUPERVISOR]), getRecepcionistas);
router.get('/:id', validarJWT, verificarRol([Rol.ADMIN, Rol.SUPERVISOR]), validarSchema(RecepcionistaPorIdSchema), getRecepcionistaPorId);
router.post('/', validarJWT, verificarRol([Rol.ADMIN, Rol.SUPERVISOR]), validarSchema(CrearRecepcionistaSchema), createRecepcionista);
router.put('/:id', validarJWT, verificarRol([Rol.ADMIN, Rol.SUPERVISOR]), validarSchema(EditarRecepcionistaSchema), editarRecepcionista);

export default router;
