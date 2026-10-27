import {Router} from 'express';
import { loginUsuario, registarUsuario, getUsuarios, primerIngreso } from './auth.controller';
import { Rol } from '../../interfaces/Rol.enum';

import { validarJWT } from '../../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../../middlewares/verificarRol.middleware';

const router  = Router ();

router.post('/register', registarUsuario);
router.post('/login', loginUsuario );
router.get('/usuarios',validarJWT,verificarRol([Rol.ADMIN]),getUsuarios);
router.put('/usuarios/cambiar-password',validarJWT,verificarRol([Rol.ADMIN,Rol.MEDICO,Rol.SUPERVISOR,Rol.RECEPCIONISTA]),primerIngreso);
export default router;

