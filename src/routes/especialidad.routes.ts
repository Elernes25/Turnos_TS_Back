//otra opcion:
// import { Router } from 'express';
// const router = Router();

import express from 'express';
const router = express.Router();

import {
  getEspecialidades,
  deleteEspecialidad,
  createEspecialidad
} from '../controllers/especialidad.controller';

router.get('/', getEspecialidades);
router.delete('/:id', deleteEspecialidad);
router.post('/', createEspecialidad);

export default router;