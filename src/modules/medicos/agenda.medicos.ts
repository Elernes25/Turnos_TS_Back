import { Schema, model, Document} from 'mongoose';
import type { IAgenda } from './types/Agenda.interface';

const agendaMedicoSchema = new Schema<IAgenda>({
  medicoId: {
    type: Schema.Types.ObjectId,
    ref: 'Medico',
    required: true
  },

  duracionTurnoMinutos: {
    type: Number,
    default: 30
  },

  dias: [
    {
      diaSemana: {
        type: String,
        required: true
      },

      rangos: [
        {
          horaInicio: {
            type: String,
            required: true
          },

          horaFin: {
            type: String,
            required: true
          }
        }
      ]
    }
  ]
});

export default model<IAgenda>('Agenda', agendaMedicoSchema);
