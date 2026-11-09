import type { Request, Response } from 'express';
import Agenda from "../medicos/agenda.medicos";
import { respuestaEstandar } from "../../utils/respuestaEstandar";
import type { CrearAgendaMedicoDTO, EditarAgendaDTO } from "./dtos/AgendaMedico.schema";
import { Types } from 'mongoose';


const createAgendaMedico = async (req: Request <unknown, unknown, CrearAgendaMedicoDTO>, res: Response) => {
  try {
    const nuevaAgenda = new Agenda(req.body);
    await nuevaAgenda.save();
    return respuestaEstandar(res, 201, true, "Agenda creada exitosamente", nuevaAgenda);
  } catch (error:any) {
    return respuestaEstandar(res, 400, false, "Error al crear la agenda", error.message);
  }
};

const getAgendaPorId = async (  req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return respuestaEstandar(res, 400, false, 'ID de médico inválido');
  }

  try {
    const agenda = await Agenda.findOne({ medicoId: id }).lean();
    if (!agenda) {
      return respuestaEstandar(res, 404, false, 'el medico seleccionado no tiene agenda para modificar');
    }
    /*
    res.json({ datos: {medicoId: String(agenda.medicoId), duracionTurnoMinutos: agenda.duracionTurnoMinutos, dias: agenda.dias.map(({ _id, ...dia }) => dia),      },
    });*/
    return respuestaEstandar(res, 200, true, 'Agenda obtenida correctamente', agenda);
  } catch (error: any) {
    respuestaEstandar(res, 500, false, 'Error al obtener la agenda',error.message );
  }
};

const editarAgenda = async (req: Request <{ id: string }, unknown, EditarAgendaDTO>, res: Response) =>{
  console.log("ID recibido:", req.params.id);
  console.log("Body recibido:", req.body);
  try {
    // const { id } = req.params;
   // const agenda = await Agenda.findOneAndReplace({ _id: id }, req.body, {
   //   returnDocument: 'after',
   //   runValidators: true
   // });
   const agenda = await Agenda.findOne({ medicoId: req.params.id });

    if (!agenda) {
      return respuestaEstandar(res, 404, false, `Agenda no encontrada para ese medico`);
    }
    agenda.set(req.body);
    await agenda.save();
    return respuestaEstandar(res, 200, true, "Agenda Editada exitosamente", agenda);
  } catch (error:any) {
      return respuestaEstandar(res, 400, false, "ID con formato invalido", error.message);
  }

};

export { createAgendaMedico, getAgendaPorId, editarAgenda};

/*
const agenda = await Agenda.findOne({ medicoId: req.params.id });

if (!agenda) {
  return respuestaEstandar(
    res,
    404,
    false,
    'No existe agenda para este médico'
  );
}

agenda.set(req.body);
await agenda.save(); */