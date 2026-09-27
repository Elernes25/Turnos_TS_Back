//otra opcion:
// import { Router } from 'express';
// const router = Router();

import express from 'express';
import { validarSchema } from '../../middlewares/validarDatos.middleware';
import {CrearEspecialidadSchema} from '../especialidad/dtos/Especialidad.schema';

const router = express.Router();

import {
  getEspecialidades,
  deleteEspecialidad,
  createEspecialidad
} from '../especialidad/especialidad.controller';

router.get('/', getEspecialidades);
router.delete('/:id', deleteEspecialidad);
router.post('/',validarSchema(CrearEspecialidadSchema), createEspecialidad);

export default router;