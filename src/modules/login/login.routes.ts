import express from 'express';
const router = express.Router();
import { loginController } from '../login/login.controller.ts';

router.post("/", loginController); /*ruta para el login, que llama al controlador loginController*/

export default router;
