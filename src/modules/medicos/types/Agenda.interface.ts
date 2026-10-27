import { Document, Types } from 'mongoose';

export enum DiaSemana {
    LUNES = 'LUNES',
    MARTES = 'MARTES',
    MIERCOLES = 'MIERCOLES',
    JUEVES = 'JUEVES',
    VIERNES = 'VIERNES',
    SABADO = 'SABADO',
    DOMINGO = 'DOMINGO'
}

export interface IRangoHorario {
  horaInicio: string;
  horaFin: string;
}

export interface IDiaAgenda {
  diaSemana: DiaSemana;
  rangos: IRangoHorario[];
}

export interface IAgenda extends Document {
  id?: Types.ObjectId;
  medicoId: Types.ObjectId;
  dias: IDiaAgenda[];
  duracionTurnoMinutos: number;
}

