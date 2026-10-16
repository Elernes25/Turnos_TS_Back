import express from 'express';
const router = express.Router();
import { getMedicos,createMedico,deleteMedico, editarMedico } from '../medicos/medicos.controller';
import { validarSchema } from '../../middlewares/validarDatos.middleware';
import { CrearMedicoSchema } from '../medicos/dtos/Medico.schema';
import { Rol } from '../login/auth/Usuario.model';
import { validarJWT } from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';

/*ENDPOINTS medicos */
router.get('/', validarJWT, getMedicos);
router.post('/', validarJWT, verificarRol([Rol.ADMIN]), validarSchema(CrearMedicoSchema), createMedico);
router.delete('/:id', validarJWT, verificarRol([Rol.ADMIN]), deleteMedico);
router.put('/:id', validarJWT, verificarRol([Rol.ADMIN]), validarSchema(CrearMedicoSchema), editarMedico);
//TODO:
//router.patch('/:id', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), validarSchema(CrearMedicoSchema), editarMedico);

export default router;