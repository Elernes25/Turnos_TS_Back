import express  from 'express';
const router = express.Router();
import { registrarIngreso } from './recepcion.controller.js';
import { validarSchema} from "../../middlewares/validarDatos.middleware.js";
import { CrearIngresoSchema } from './dtos/Recepcion.schema.js';
import { validarJWT} from '../../middlewares/validarJWT.middleware.js';
import { verificarRol } from '../../middlewares/verificarRol.middleware.js';
import { Rol } from '../interfaces/Rol.enum.js'; 

router.post('/',validarJWT,verificarRol([Rol.ADMIN, Rol.RECEPCIONISTA]),validarSchema(CrearIngresoSchema), registrarIngreso);

export default router;