//otra opcion:
// import { Router } from 'express';
// const router = Router();

import express from 'express';
import { validarSchema } from '../../middlewares/validarDatos.middleware';
import {CrearEspecialidadSchema} from '../especialidad/dtos/Especialidad.schema';
import { validarJWT } from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';

const router = express.Router();

import {
  getEspecialidades,
  deleteEspecialidad,
  createEspecialidad
} from '../especialidad/especialidad.controller';
import { Rol } from '../login/auth/Usuario.model';

router.get('/', validarJWT,getEspecialidades);
router.delete('/:id', validarJWT, verificarRol([Rol.ADMIN]), deleteEspecialidad);
router.post('/',validarJWT,verificarRol([Rol.ADMIN]),validarSchema(CrearEspecialidadSchema), createEspecialidad);
//TODO:
//router.patch('/',validarJWT,verificarRol([Rol.ADMIN]),validarSchema(CrearEspecialidadSchema), editarEspecialidad);
export default router;