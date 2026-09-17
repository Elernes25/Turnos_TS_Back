import express  from 'express';
const router = express.Router();
import { registrarIngreso } from '../controllers/recepcion.controller';

router.post('/', registrarIngreso);

export default router;