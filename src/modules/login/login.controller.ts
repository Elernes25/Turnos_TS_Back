import {respuestaEstandar} from '../../utils/respuestaEstandar';
import type { Request, Response } from 'express';

const loginController = (req: Request, res: Response ) => {

  const { email, password } = req.body;
  if (email === "admin@salita.com" && password === "1234") {  
    const token = "Token_seguridad_123"; // Token hardcodeado
    
    respuestaEstandar(res, 200, true, "Login exitoso", token );
    console.log("login exitoso",token);

  } else {
    respuestaEstandar(res, 401, false, "Credenciales inválidas", null);
    console.log("Credenciales inválidas",req.body);
  }
};

export { loginController };