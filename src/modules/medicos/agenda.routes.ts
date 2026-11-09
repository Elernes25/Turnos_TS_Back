import {Router} from 'express';
import { validarSchema} from "../../middlewares/validarDatos.middleware";
import { CrearAgendaMedicoSchema } from './dtos/AgendaMedico.schema';
import { createAgendaMedico } from './agenda.controller';
import { validarJWT} from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';
import { Rol } from '../interfaces/Rol.enum';
import { getAgendaPorId, editarAgenda } from './agenda.controller';

const router = Router();
router.get('/:id/agenda', validarJWT,verificarRol([Rol.ADMIN, Rol.MEDICO,Rol.RECEPCIONISTA]),  getAgendaPorId);
router.post('/agenda', validarJWT,verificarRol([Rol.ADMIN, Rol.MEDICO]),validarSchema(CrearAgendaMedicoSchema), createAgendaMedico);
//router.delete('/:id', validarJWT,verificarRol([Rol.ADMIN]),deleteAgenda); 
router.put('/:id/agenda',validarJWT,verificarRol([Rol.ADMIN, Rol.MEDICO, Rol.RECEPCIONISTA]), editarAgenda );

export default router;