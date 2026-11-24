import express from 'express';
const router = express.Router();
import { validarSchema } from '../../middlewares/validarDatos.middleware.js';
import { createHistoriaClinica, getHistoriasClinicas, actualizarHistoriaClinica } from './historiaClinica.controller.js';
import { CrearHistoriaClinicaSchema, ActualizarHistoriaClinicaSchema } from './dtos/HistoriaClinica.schema.js';
import { Rol } from '../interfaces/Rol.enum.js';
import { validarJWT } from '../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../middlewares/verificarRol.middleware.js';   

/*ENDPOINTS historiaClinica */
router.get('/', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), getHistoriasClinicas); //informacion sensible, solo el medico puede ver la historia clinica de sus pacientes
router.post('/', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), validarSchema(CrearHistoriaClinicaSchema),createHistoriaClinica);
router.patch('/:id/:medicoId', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), validarSchema(ActualizarHistoriaClinicaSchema), actualizarHistoriaClinica);

export default router;

