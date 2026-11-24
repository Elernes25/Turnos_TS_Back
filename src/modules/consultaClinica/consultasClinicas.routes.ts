import { Router } from 'express';
import { validarSchema } from '../../middlewares/validarDatos.middleware.js';
import { validarJWT } from '../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../middlewares/verificarRol.middleware.js';
import { Rol } from '../interfaces/Rol.enum.js';
import { actualizarObservaciones, crearConsulta, obtenerConsultas, obtenerConsultasPorMedico, obtenerConsultasPorPaciente
} from './consultasClinicas.controller.js';
import { ActualizarObservacionesSchema, CrearConsultaSchema} from './dtos/ConsultaClinicaSchema.js';

const router = Router();

router.get('/', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), obtenerConsultas);
router.get('/paciente/:pacienteId', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), obtenerConsultasPorPaciente);
router.get('/medico/:medicoId', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), obtenerConsultasPorMedico);
router.post('/', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), validarSchema(CrearConsultaSchema), crearConsulta);
router.patch('/:id', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), validarSchema(ActualizarObservacionesSchema), actualizarObservaciones);

export default router;