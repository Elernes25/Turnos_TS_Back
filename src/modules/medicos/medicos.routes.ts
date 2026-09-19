import express from 'express';
const router = express.Router();
import {getMedicos,createMedico,deleteMedico} from '../medicos/medicos.controller';

/*ENDPOINTS medicos */
router.get('/', getMedicos);
router.post('/', createMedico);
router.delete('/:id', deleteMedico);    

export default router;