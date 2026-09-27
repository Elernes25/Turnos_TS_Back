import express from 'express';
const router = express.Router();
import { validarSchema } from '../../middlewares/validarDatos.middleware';
import { createHistoriaClinica, getHistoriasClinicas, agregarConsulta } from './historiaClinica.controller';
import { CrearHistoriaClinicaSchema, SoloConsultas } from './dtos/HistoriaClinica.schema';

/*ENDPOINTS historiaClinica */
router.get('/', getHistoriasClinicas);
router.post('/', validarSchema(CrearHistoriaClinicaSchema),createHistoriaClinica);
//router.get('/paciente/:pacienteId', getHistoriaClinicaByPaciente);
router.patch('/:id', validarSchema(SoloConsultas), agregarConsulta );

export default router;

