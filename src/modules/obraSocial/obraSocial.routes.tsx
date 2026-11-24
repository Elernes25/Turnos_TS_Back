import express from "express";
import { validarJWT } from "../../middlewares/validarJWT.middleware.js";
import { validarSchema } from "../../middlewares/validarDatos.middleware.js";
import { verificarRol } from "../../middlewares/verificarRol.middleware.js";
import { Rol } from "../interfaces/Rol.enum";
import {
    CrearObraSocialSchema,
    EditarObraSocialSchema,
    ObraSocialIdSchema,
} from "./dtos/ObraSocial.schema";
import { createObraSocial, deleteObraSocial, editarObraSocial, getObraSocial, getObrasSociales} from "./obraSocial.controller";

const router = express.Router();
const rolesObraSocial = [Rol.ADMIN, Rol.RECEPCIONISTA, Rol.SUPERVISOR];

router.get("/", validarJWT, verificarRol(rolesObraSocial), getObrasSociales);
router.get("/:id", validarJWT, verificarRol(rolesObraSocial), validarSchema(ObraSocialIdSchema), getObraSocial);
router.post("/", validarJWT, verificarRol(rolesObraSocial), validarSchema(CrearObraSocialSchema), createObraSocial);
router.put("/:id", validarJWT, verificarRol(rolesObraSocial), validarSchema(EditarObraSocialSchema), editarObraSocial);
router.delete("/:id", validarJWT, verificarRol(rolesObraSocial), validarSchema(ObraSocialIdSchema), deleteObraSocial);

export default router;
