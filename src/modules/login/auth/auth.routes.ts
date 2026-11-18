import {Router} from 'express';
import { loginUsuario, registarUsuario, getUsuarios, primerIngreso } from './auth.controller';
import { Rol } from '../../interfaces/Rol.enum';

import { validarJWT } from '../../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../../middlewares/verificarRol.middleware';
import { CrearUsuarioSchema, LoginUsuarioSchema } from '../dtos/Usuario.schema';
import { validarSchema } from '../../../middlewares/validarDatos.middleware';

const router  = Router ();

router.post('/register',validarSchema(CrearUsuarioSchema), registarUsuario);
router.post('/login', validarSchema(LoginUsuarioSchema),loginUsuario );
router.get('/usuarios',validarJWT,verificarRol([Rol.ADMIN]),getUsuarios);
router.put('/usuarios/cambiar-password',validarJWT,verificarRol([Rol.ADMIN,Rol.MEDICO,Rol.SUPERVISOR,Rol.RECEPCIONISTA]),primerIngreso);
export default router;

