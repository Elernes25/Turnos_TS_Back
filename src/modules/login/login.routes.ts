import express from 'express';
const router = express.Router();
import { loginController } from '../login/login.controller';

router.post("/", loginController); /*ruta para el login, que llama al controlador loginController*/
/*pregunta hay que validar schema aqui? */

export default router;
