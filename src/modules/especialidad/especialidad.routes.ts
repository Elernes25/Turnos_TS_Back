//otra opcion:
// import { Router } from 'express';
// const router = Router();

import express from 'express';
const router = express.Router();
import { validarSchema } from '../../middlewares/validarDatos.middleware.js';
import {CrearEspecialidadSchema} from '../especialidad/dtos/Especialidad.schema.js';
import { validarJWT } from '../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../middlewares/verificarRol.middleware.js';
import { getEspecialidades,deleteEspecialidad, createEspecialidad, editarEspecialidad} from '../especialidad/especialidad.controller.js';
import { Rol } from '../interfaces/Rol.enum.js';

router.get('/', validarJWT,verificarRol([Rol.ADMIN,Rol.SUPERVISOR,Rol.MEDICO,Rol.RECEPCIONISTA]), getEspecialidades);
router.delete('/:id', validarJWT, verificarRol([Rol.ADMIN,Rol.SUPERVISOR]), deleteEspecialidad);
router.post('/',validarJWT,verificarRol([Rol.ADMIN,Rol.SUPERVISOR]),validarSchema(CrearEspecialidadSchema), createEspecialidad);
router.put('/:id',validarJWT,verificarRol([Rol.ADMIN,Rol.SUPERVISOR]),validarSchema(CrearEspecialidadSchema), editarEspecialidad);
export default router;