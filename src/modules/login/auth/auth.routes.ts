import {Router} from 'express';
import { loginUsuario, registarUsuario, getUsuarios, primerIngreso, actualizarIngreso, eliminarUsuario} from './auth.controller.js';
import { Rol } from '../../interfaces/Rol.enum.js';

import { validarJWT } from '../../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../../middlewares/verificarRol.middleware.js';
import { CrearUsuarioSchema, LoginUsuarioSchema } from '../dtos/Usuario.schema.js';
import { validarSchema } from '../../../middlewares/validarDatos.middleware.js';
import reiniciarPasswordRoutes from './reiniciarPassword.routes.js';

const router  = Router ();

router.post('/register',validarSchema(CrearUsuarioSchema), registarUsuario);
router.post('/login', validarSchema(LoginUsuarioSchema),loginUsuario );
router.get('/usuarios',validarJWT,verificarRol([Rol.ADMIN,Rol.MEDICO,Rol.SUPERVISOR,Rol.RECEPCIONISTA]),getUsuarios);
router.delete('/usuarios/:id',validarJWT,verificarRol([Rol.ADMIN,Rol.SUPERVISOR]),eliminarUsuario);
router.put('/usuarios/cambiar-password',validarJWT,verificarRol([Rol.ADMIN,Rol.MEDICO,Rol.SUPERVISOR,Rol.RECEPCIONISTA]),primerIngreso);
router.put('/usuarios/actualizar',validarJWT,verificarRol([Rol.ADMIN,Rol.MEDICO,Rol.SUPERVISOR,Rol.RECEPCIONISTA]),actualizarIngreso);
export default router;

