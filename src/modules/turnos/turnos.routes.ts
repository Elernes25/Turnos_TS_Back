import {Router} from 'express';
import { validarSchema} from "../../middlewares/validarDatos.middleware.js";
import { CrearTurnoSchema, } from './dtos/turno.Schema.js';
import {getTurnos,createTurnos,deleteTurnos,marcarAtendido,marcarCancelado,marcarEnAtencion} from '../turnos/turnos.controller.js';
import { validarJWT} from '../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../middlewares/verificarRol.middleware.js';
import { Rol } from '../interfaces/Rol.enum.js';


/* especifica que se importan las funciones getTurnos, createTurnos , deleteTurnos,marcarAtendido 
desde el archivo turnos.controllers.ts. 
Estas funciones se utilizarán como controladores para manejar las solicitudes
HTTP relacionadas con los turnos. */

const router = Router();
router.get('/', validarJWT,  getTurnos);
//router.get('/:especialidad', getTurnosEspecialidad); //ya no es necesario, lo hace por filtros en get//
router.post('/', validarJWT,verificarRol([Rol.ADMIN, Rol.RECEPCIONISTA]),validarSchema(CrearTurnoSchema), createTurnos);
router.delete('/:id', validarJWT,verificarRol([Rol.ADMIN]),deleteTurnos); 
router.patch('/:id',validarJWT,verificarRol([Rol.ADMIN, Rol.MEDICO, Rol.RECEPCIONISTA]), marcarAtendido);
router.patch('/enatencion/:id',validarJWT,verificarRol([Rol.ADMIN, Rol.MEDICO, Rol.RECEPCIONISTA]), marcarEnAtencion);
router.patch('/cancelar/:id',validarJWT,verificarRol([Rol.ADMIN, Rol.RECEPCIONISTA]), marcarCancelado);
//router.post('/:id/reprogramar',validarJWT,verificarRol([Rol.ADMIN, Rol.RECEPCIONISTA]),validarSchema(ReprogramarTurnoSchema),reprogramarTurno);

export default router;