import {Router} from 'express';
import { loginUsuario, registarUsuario } from './auth.controller';

const router  = Router ();

router.post('/register', registarUsuario);
router.post('/login', loginUsuario );

export default router;

