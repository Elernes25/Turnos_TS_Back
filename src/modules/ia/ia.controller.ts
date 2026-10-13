import {respuestaEstandar} from "../../utils/respuestaEstandar";
import {modelGemini} from "../../services/ia.service";
import type {Request, Response} from "express";
import {z} from "zod";

const esquemaRespuestaIA = z.object({
  resumenCorto: z.string(),
  gravedad: z.enum(["baja", "media", "alta"]),
  medicamentosmencionados : z.string(),
  
});

