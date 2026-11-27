import express from 'express';
const router = express.Router();
import { validarSchema} from "../../middlewares/validarDatos.middleware.js";
import { CrearPacienteSchema } from './dtos/Paciente.schema.js';
import {getPacientes,createPacientes,deletePacientes,actualizarPaciente} from '../pacientes/pacientes.controller.js';
import { Rol } from '../interfaces/Rol.enum.js';
import { validarJWT } from '../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../middlewares/verificarRol.middleware.js';

/*ENDPOINTS PACIENTES */
router.get('/', validarJWT ,verificarRol([Rol.ADMIN,Rol.MEDICO,Rol.SUPERVISOR,Rol.RECEPCIONISTA]),getPacientes);
//router.get('/:dni', getPacientesDNI); getPacientes ya maneja la búsqueda por DNI a través de query params
router.post('/', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO,Rol.RECEPCIONISTA]), validarSchema(CrearPacienteSchema),createPacientes);
// probablemente necesite un rol USUARIO, para el que se quiera agregar online
router.delete('/:id', validarJWT , verificarRol([Rol.ADMIN]), deletePacientes); 
router.patch('/:id', validarJWT ,verificarRol([Rol.ADMIN,Rol.RECEPCIONISTA]),actualizarPaciente);   

export default router;