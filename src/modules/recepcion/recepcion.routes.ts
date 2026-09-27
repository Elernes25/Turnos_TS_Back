import express  from 'express';
const router = express.Router();
import { registrarIngreso } from './recepcion.controller';
import { validarSchema} from "../../middlewares/validarDatos.middleware";
import { CrearIngresoSchema } from './dtos/Recepcion.schema';

router.post('/',validarSchema(CrearIngresoSchema), registrarIngreso);

export default router;