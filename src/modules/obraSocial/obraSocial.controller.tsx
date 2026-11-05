import type { Request, Response } from "express";
import ObraSocial from "./obraSocial";
import Paciente from "../pacientes/paciente";
import type { CrearObraSocialDTO, EditarObraSocialDTO } from "./dtos/ObraSocial.schema";
import { respuestaEstandar } from "../../utils/respuestaEstandar";

const getObrasSociales = async (_req: Request, res: Response) => {
    try {
        const obrasSociales = await ObraSocial.find().sort({ nombreObraSocial: 1 });
        return respuestaEstandar(res, 200, true, "Obras sociales obtenidas correctamente", obrasSociales);
    } catch (error: unknown) {
        const mensaje = error instanceof Error ? error.message : "Error desconocido";
        return respuestaEstandar(res, 500, false, "Error al obtener las obras sociales", mensaje);
    }
};

const getObraSocial = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const obraSocial = await ObraSocial.findById(req.params.id);
        if (!obraSocial) {
            return respuestaEstandar(res, 404, false, "Obra social no encontrada");
        }
        return respuestaEstandar(res, 200, true, "Obra social obtenida correctamente", obraSocial);
    } catch (error: unknown) {
        const mensaje = error instanceof Error ? error.message : "Error desconocido";
        return respuestaEstandar(res, 500, false, "Error al obtener la obra social", mensaje);
    }
};

const createObraSocial = async (req: Request<unknown, unknown, CrearObraSocialDTO>, res: Response) => {
    try {
        const obraSocial = await ObraSocial.create(req.body);
        return respuestaEstandar(res, 201, true, "Obra social creada correctamente", obraSocial);
    } catch (error: unknown) {
        const mensaje = error instanceof Error ? error.message : "Error desconocido";
        return respuestaEstandar(res, 400, false, "Error al crear la obra social", mensaje);
    }
};

const editarObraSocial = async (req: Request<{ id: string }, unknown, EditarObraSocialDTO>, res: Response) => {
    try {
        const obraSocial = await ObraSocial.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!obraSocial) {
            return respuestaEstandar(res, 404, false, "Obra social no encontrada");
        }
        return respuestaEstandar(res, 200, true, "Obra social actualizada correctamente", obraSocial);
    } catch (error: unknown) {
        const mensaje = error instanceof Error ? error.message : "Error desconocido";
        return respuestaEstandar(res, 400, false, "Error al actualizar la obra social", mensaje);
    }
};

const deleteObraSocial = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const tienePacientes = await Paciente.exists({ "obraSocial.obraSocialID": req.params.id });
        if (tienePacientes) {
            return respuestaEstandar(res, 409, false, "No se puede eliminar la obra social porque está asociada a pacientes");
        }

        const obraSocial = await ObraSocial.findByIdAndDelete(req.params.id);
        if (!obraSocial) {
            return respuestaEstandar(res, 404, false, "Obra social no encontrada");
        }
        return respuestaEstandar(res, 200, true, "Obra social eliminada correctamente", obraSocial);
    } catch (error: unknown) {
        const mensaje = error instanceof Error ? error.message : "Error desconocido";
        return respuestaEstandar(res, 500, false, "Error al eliminar la obra social", mensaje);
    }
};

export { getObrasSociales, getObraSocial, createObraSocial, editarObraSocial, deleteObraSocial };
