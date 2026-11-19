import { Router } from 'express';
import { validarSchema } from '../../middlewares/validarDatos.middleware';
import { validarJWT } from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';
import { Rol } from '../interfaces/Rol.enum';
import { CrearRecepcionistaSchema } from './dtos/recepcionista.schema';
import { createRecepcionista } from './recepcionistas.controller';

const router = Router();

router.post('/', validarJWT, verificarRol([Rol.ADMIN, Rol.SUPERVISOR]), validarSchema(CrearRecepcionistaSchema), createRecepcionista);

export default router;
