import express from 'express';
const router = express.Router();
import {getMedicos,createMedico,deleteMedico} from '../controllers/medicos.controller.ts';

/*ENDPOINTS medicos */
router.get('/', getMedicos);
router.post('/', createMedico);
router.delete('/:id', deleteMedico);    

module.exports = router;