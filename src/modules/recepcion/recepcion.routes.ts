import express  from 'express';
const router = express.Router();
import { registrarIngreso } from './recepcion.controller';
import { validarSchema} from "../../middlewares/validarDatos.middleware";
import { CrearIngresoSchema } from './dtos/Recepcion.schema';
import { validarJWT} from '../../middlewares/validarJWT.middleware';
import { verificarRol } from '../../middlewares/verificarRol.middleware';
import { Rol } from '../login/auth/Usuario.model';  

router.post('/',validarJWT,verificarRol([Rol.ADMIN, Rol.RECEPCIONISTA]),validarSchema(CrearIngresoSchema), registrarIngreso);

export default router;