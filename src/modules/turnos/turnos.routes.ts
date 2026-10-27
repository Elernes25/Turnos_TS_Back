import {Router} from 'express';
import { validarSchema} from "../../middlewares/validarDatos.middleware";
import { CrearTurnoSchema } from './dtos/turno.Schema';
import {getTurnos,createTurnos,deleteTurnos,marcarAtendido} from '../turnos/turnos.controller';
import { validarJWT} from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';
import { Rol } from '../interfaces/Rol.enum';

/* especifica que se importan las funciones getTurnos, createTurnos , deleteTurnos,marcarAtendido 
desde el archivo turnos.controllers.ts. 
Estas funciones se utilizarán como controladores para manejar las solicitudes
HTTP relacionadas con los turnos. */

const router = Router();
router.get('/', validarJWT,  getTurnos);
//router.get('/:especialidad', getTurnosEspecialidad); //ya no es necesario, lo hace por filtros en get//
router.post('/', validarJWT,verificarRol([Rol.ADMIN, Rol.RECEPCIONISTA]),validarSchema(CrearTurnoSchema), createTurnos);
router.delete('/:id', validarJWT,verificarRol([Rol.ADMIN]),deleteTurnos); 
router.patch('/:id',validarJWT,verificarRol([Rol.ADMIN, Rol.RECEPCIONISTA]), marcarAtendido);

export default router;