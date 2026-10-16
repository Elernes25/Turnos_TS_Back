import express from 'express';
const router = express.Router();
import { validarSchema} from "../../middlewares/validarDatos.middleware";
import { CrearPacienteSchema } from './dtos/Paciente.schema';

import {getPacientes,createPacientes,deletePacientes} from '../pacientes/pacientes.controller';
//const{getPacientes,getPacientesDNI,createPacientes,deletePacientes}=require('../controllers/pacientes.controller.js');
/* especifica que se importan las funciones getPacientes, getPacientesDNI, createPacientes 
y deletePacientes desde el archivo pacientes.controllers.js ubicado en la carpeta controllers. 
Estas funciones se utilizarán como controladores para manejar las solicitudes HTTP relacionadas
con los pacientes. */

import { Rol } from '../login/auth/Usuario.model';
import { validarJWT } from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';

/*ENDPOINTS PACIENTES */
router.get('/', validarJWT ,verificarRol([Rol.ADMIN,Rol.MEDICO,Rol.RECEPCIONISTA]),getPacientes);
//router.get('/:dni', getPacientesDNI); getPacientes ya maneja la búsqueda por DNI a través de query params
router.post('/', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO,Rol.RECEPCIONISTA]), validarSchema(CrearPacienteSchema),createPacientes);
// probablemente necesite un rol USUARIO, para el que se quiera agregar online
router.delete('/:id', validarJWT , verificarRol([Rol.ADMIN]), deletePacientes); 
   

export default router;