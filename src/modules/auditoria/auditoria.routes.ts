import { Router } from 'express';
import { validarJWT } from '../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../middlewares/verificarRol.middleware.js';
import { Rol } from '../interfaces/Rol.enum.js';
import { getAuditorias } from './auditoria.controller.js';

const router = Router();

router.get('/', validarJWT, verificarRol([Rol.ADMIN, Rol.SUPERVISOR]), getAuditorias);

export default router;
