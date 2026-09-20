import {Router} from 'express';
import { validarSchema} from "../../middlewares/validarDatos.middleware";
import { CrearTurnoSchema } from './dtos/turno.Schema';
import {getTurnos,createTurnos,deleteTurnos,marcarAtendido} from '../turnos/turnos.controller';

/* especifica que se importan las funciones getTurnos, createTurnos , deleteTurnos,marcarAtendido 
desde el archivo turnos.controllers.ts. 
Estas funciones se utilizarán como controladores para manejar las solicitudes
HTTP relacionadas con los turnos. */

const router = Router();
router.get('/', getTurnos);
//router.get('/:especialidad', getTurnosEspecialidad); //ya no esnecesario, lo hace por filtros en get//
router.post('/', validarSchema(CrearTurnoSchema), createTurnos);
router.delete('/:id', deleteTurnos); 
router.patch('/:id', marcarAtendido);

export default router;