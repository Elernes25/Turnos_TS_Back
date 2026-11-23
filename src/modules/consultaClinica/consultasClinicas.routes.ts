import { Router } from 'express';
import { validarSchema } from '../../middlewares/validarDatos.middleware';
import { validarJWT } from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';
import { Rol } from '../interfaces/Rol.enum';
import { actualizarObservaciones, crearConsulta, obtenerConsultas, obtenerConsultasPorMedico, obtenerConsultasPorPaciente
} from './consultasClinicas.controller';
import { ActualizarObservacionesSchema, CrearConsultaSchema} from './dtos/ConsultaClinicaSchema';

const router = Router();

router.get('/', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), obtenerConsultas);
router.get('/paciente/:pacienteId', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), obtenerConsultasPorPaciente);
router.get('/medico/:medicoId', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), obtenerConsultasPorMedico);
router.post('/', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), validarSchema(CrearConsultaSchema), crearConsulta);
router.patch('/:id', validarJWT, verificarRol([Rol.ADMIN,Rol.MEDICO]), validarSchema(ActualizarObservacionesSchema), actualizarObservaciones);

export default router;