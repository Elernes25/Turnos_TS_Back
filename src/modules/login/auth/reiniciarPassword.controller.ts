import crypto from "crypto";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import Usuario from "./Usuario.model.js";
import { respuestaEstandar } from "../../../utils/respuestaEstandar.js";

export const reiniciarPassword = async ( req: Request<{ id: string }>,res: Response) => {
  try {
    const { id } = req.params;
    const passwordTemporal = crypto.randomBytes(4).toString("hex");
    const passwordHash = await bcrypt.hash(passwordTemporal, 10);

    const usuario = await Usuario.findByIdAndUpdate(
      id,
      {
        password: passwordHash,
        debeCambiarPassword: true
      },
      { returnDocument: "after" }
    );

    if (!usuario) { return respuestaEstandar(res, 404, false, "Usuario no encontrado"); }
    return respuestaEstandar( res, 200, true, "Contraseña reiniciada correctamente",  { passwordTemporal } );
  } catch (error: unknown) {
    console.log("Error al cambiar password", error);
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    return respuestaEstandar(res, 500, false, "Error del servidor", mensaje);
  }
};
