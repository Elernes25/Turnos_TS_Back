import express from 'express';
const router = express.Router();
import { getMedicos,createMedico,deleteMedico, editarMedico } from '../medicos/medicos.controller';
import { validarSchema } from '../../middlewares/validarDatos.middleware';
import { CrearMedicoSchema } from '../medicos/dtos/Medico.schema';

/*ENDPOINTS medicos */
router.get('/', getMedicos);
router.post('/', validarSchema(CrearMedicoSchema), createMedico);
router.delete('/:id', deleteMedico);    
router.put('/:id', validarSchema(CrearMedicoSchema), editarMedico);

export default router;