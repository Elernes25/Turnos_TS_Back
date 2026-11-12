import express from 'express';
const router = express.Router();
import { getMedicos,createMedico,deleteMedico, editarMedico, getConAgenda, getMedicoPorId } from '../medicos/medicos.controller';
import { validarSchema } from '../../middlewares/validarDatos.middleware';
import { CrearMedicoSchema } from '../medicos/dtos/Medico.schema';
import { Rol } from '../interfaces/Rol.enum';
import { validarJWT } from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';

/*ENDPOINTS medicos */
//primero las rutas especificas y despues las dinamicas
router.get('/', validarJWT, verificarRol([Rol.ADMIN,Rol.SUPERVISOR,Rol.RECEPCIONISTA]), getMedicos);
router.get('/conAgenda',validarJWT, verificarRol([Rol.ADMIN,Rol.SUPERVISOR,Rol.RECEPCIONISTA]),getConAgenda); // medicos con o sin agenda
router.get('/:id', validarJWT,verificarRol([Rol.ADMIN,Rol.SUPERVISOR,Rol.RECEPCIONISTA]),getMedicoPorId);

router.post('/', validarJWT, verificarRol([Rol.ADMIN,Rol.SUPERVISOR]), validarSchema(CrearMedicoSchema), createMedico);
// sugenrencia para hacer todo aqui ahora agenda.routes lo hace lo hace

router.delete('/:id', validarJWT, verificarRol([Rol.ADMIN,Rol.SUPERVISOR]), deleteMedico);
router.put('/:id/editar', validarJWT, verificarRol([Rol.ADMIN,Rol.SUPERVISOR]), validarSchema(CrearMedicoSchema), editarMedico);
//TODO:
//router.patch('/:id', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), validarSchema(CrearMedicoSchema), editarMedico);

export default router;