import express from 'express';
const router = express.Router();
import { validarSchema } from '../../middlewares/validarDatos.middleware';
import { createHistoriaClinica, getHistoriasClinicas, agregarConsulta } from './historiaClinica.controller';
import { CrearHistoriaClinicaSchema, SoloConsultas } from './dtos/HistoriaClinica.schema';
import { Rol } from '../login/auth/Usuario.model';  
import { validarJWT } from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';   

/*ENDPOINTS historiaClinica */
router.get('/', validarJWT, verificarRol([Rol.MEDICO]), getHistoriasClinicas); //informacion sensible, solo el medico puede ver la historia clinica de sus pacientes
router.post('/', validarJWT, verificarRol([Rol.MEDICO]), validarSchema(CrearHistoriaClinicaSchema),createHistoriaClinica);
router.patch('/:id', validarJWT, verificarRol([Rol.MEDICO]), validarSchema(SoloConsultas), agregarConsulta );

export default router;

