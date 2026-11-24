import { Router } from "express";
import { Rol } from "../../interfaces/Rol.enum.js";
import { validarJWT } from "../../../middlewares/validarJWT.middleware.js";
import { verificarRol } from "../../../middlewares/verificarRol.middleware.js";
import { reiniciarPassword } from "./reiniciarPassword.controller.js";

const router = Router();

router.patch( "/:id/reiniciar-password", validarJWT, verificarRol([Rol.ADMIN, Rol.SUPERVISOR]), reiniciarPassword);

export default router;
