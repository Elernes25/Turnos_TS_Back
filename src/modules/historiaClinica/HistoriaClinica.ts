import { Schema, model, Document} from 'mongoose';
import { type IHistoriaClinica, Sexo, GrupoSanguineo } from './types/HistoriaClinica.interface.js';
//import { required } from 'zod/mini';

const historiaClinicaSchema = new Schema<IHistoriaClinica>({
    pacienteId: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El paciente es obligatorio'],
    },
    datosClinicos: {
        sexo:{ 
            type: String,      
	        enum: Sexo,          //*por motivos estadisticos*//
            required: [true, 'El sexo del paciente es obligatorio']
        },
	    grupoSanguineo:{ type: String, enum: GrupoSanguineo} //, required :[true, 'El Grupo Sanguineo del paciente es obligatorio'] 
    },
    antecedentes: {
        alergias: [{ type: String }], /*arreglo de strings para realizar busquedas refinadas */
        cirugias: [{ type: String }],
        enfermedadesCronicas: [{ type: String }],
        historiaGeneral: { type: String } /* info no especifica pero relevante*/
    },
    modificacion: {
        medicoId: {
            type: Schema.Types.ObjectId,
            ref: 'Medico',
            required: false
        },
        fecha: {
            type: Date,
            required: false
        }
    },
  
}, 
    {timestamps: true}
); 
// Transformación del objeto a JSON
historiaClinicaSchema.set('toJSON', {
    transform: (doc:Document, ret: Record<string,any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


export default model<IHistoriaClinica>('HistoriaClinica', historiaClinicaSchema);