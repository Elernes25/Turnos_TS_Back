import type { Request, Response } from 'express';
import Agenda from "../medicos/agenda.medicos";
import { respuestaEstandar } from "../../utils/respuestaEstandar";
import type { CrearAgendaMedicoDTO } from "./dtos/AgendaMedico.schema";

const createAgendaMedico = async (req: Request <unknown, unknown, CrearAgendaMedicoDTO>, res: Response) => {
  try {
    const nuevaAgenda = new Agenda(req.body);
    await nuevaAgenda.save();
    return respuestaEstandar(res, 201, true, "Agenda creada exitosamente", nuevaAgenda);
  } catch (error:any) {
    return respuestaEstandar(res, 400, false, "Error al crear la agenda", error.message);
  }
};

export { createAgendaMedico};