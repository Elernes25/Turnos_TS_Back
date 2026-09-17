import express from 'express';
const router = express.Router();
import { loginController } from '../controllers/login.controller.ts';

router.post("/", loginController); /*ruta para el login, que llama al controlador loginController*/

export default router;
