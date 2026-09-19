import express from 'express';
const router = express.Router();
import {
    createHistoriaClinica,
    getHistoriasClinicas,
    getHistoriaClinicaByPaciente
} from '../historiaClinica/historiaClinica.controller';

/*ENDPOINTS historiaClinica */
router.get('/', getHistoriasClinicas);
router.post('/', createHistoriaClinica);
router.get('/paciente/:pacienteId', getHistoriaClinicaByPaciente);

export default router;

