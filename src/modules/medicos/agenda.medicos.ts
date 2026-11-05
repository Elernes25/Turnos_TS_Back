import { Schema, model, Document} from 'mongoose';
import type { IAgenda } from './types/Agenda.interface';
import { DiaSemana } from './types/Agenda.interface';

const agendaMedicoSchema = new Schema<IAgenda>({
  medicoId: {
    type: Schema.Types.ObjectId,
    ref: 'Medico',
    required: true,
    unique: true,            // una sola agenda por médico (crea el índice)
  },

  duracionTurnoMinutos: {
    type: Number,
    default: 30,
    min: 1,
    max: 60,
  },

  dias: [
    {
      diaSemana: {
        type: String,
        enum: Object.values(DiaSemana),   // evita días inventados
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

agendaMedicoSchema.set('toJSON', {
    transform: (documento:Document, agendaMedicoRetorno: Record<string,any>) => {
         agendaMedicoRetorno.id =  agendaMedicoRetorno._id;
        delete  agendaMedicoRetorno._id;
        delete  agendaMedicoRetorno.__v;
        delete  agendaMedicoRetorno.createdAt; /*borra los campos agregados por el timestamps */
        delete  agendaMedicoRetorno.updatedAt;
    }
});


export default model<IAgenda>('Agenda', agendaMedicoSchema);
