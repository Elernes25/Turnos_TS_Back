import express from 'express';
const router = express.Router();
const{getTurnos,createTurnos,deleteTurnos,marcarAtendido}=require('../controllers/turnos.controller.ts');
/* especifica que se importan las funciones getTurnos, createTurnos , deleteTurnos,marcarAtendido 
desde el archivo turnos.controllers.js ubicado en la carpeta controllers. 
Estas funciones se utilizarán como controladores para manejar las solicitudes
HTTP relacionadas con los turnos. */

router.get('/', getTurnos);
//router.get('/:especialidad', getTurnosEspecialidad); //ya no esnecesario, lo hace por filtros en get//
router.post('/', createTurnos);
router.delete('/:id', deleteTurnos); 
router.patch('/:id', marcarAtendido);

export default router;