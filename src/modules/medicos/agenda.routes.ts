import {Router} from 'express';
import { validarSchema} from "../../middlewares/validarDatos.middleware.js";
import { CrearAgendaMedicoSchema } from './dtos/AgendaMedico.schema.js';
import { createAgendaMedico } from './agenda.controller.js';
import { validarJWT} from '../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../middlewares/verificarRol.middleware.js';
import { Rol } from '../interfaces/Rol.enum.js';
import { getAgendaPorId, editarAgenda } from './agenda.controller.js';

const router = Router();
router.get('/:id/agenda', validarJWT,verificarRol([Rol.ADMIN, Rol.SUPERVISOR,Rol.MEDICO,Rol.RECEPCIONISTA]),  getAgendaPorId);
router.post('/agenda', validarJWT,verificarRol([Rol.ADMIN, Rol.SUPERVISOR]),validarSchema(CrearAgendaMedicoSchema), createAgendaMedico);
//router.delete('/:id', validarJWT,verificarRol([Rol.ADMIN]),deleteAgenda); 
router.put('/:id/agenda',validarJWT,verificarRol([Rol.ADMIN, Rol.SUPERVISOR, Rol.MEDICO]), editarAgenda );

export default router;