import { Schema, model, Document} from 'mongoose';
import { type IHistoriaClinica,type IConsultaClinica, Sexo, GrupoSanguineo } from './types/HistoriaClinica.interface';
import { required } from 'zod/mini';


const consultaSchema = new Schema <IConsultaClinica> ({
        fecha: {
            type: Date,
            required: [true, 'La fecha es obligatoria'],   
            },
        medicoID: {
            type: Schema.Types.ObjectId,   /*deberia ser un ObjectId que referencia al modelo Medico */
            ref: 'Medico',
            required: [true, 'El ID del médico es obligatorio']
        },
        motivoConsulta: { /*dolor de rodilla */
            type: String,
            required: [true, 'El motivo de la consulta es obligatorio'] 
        },
        diagnostico: {    /*tendinitis */        
            type: String,
            required: [true, 'El diagnóstico es obligatorio']
        },
        tratamiento: {    /*ibuprofeno cada 8 hs x 3 dias */
            type: String,
            required: [true, 'El tratamiento es obligatorio']
        },
        indicaciones:{    /*radiografia de rodilla/bajar de peso */
            type: String,
            required: [true, 'Las indicaciones son obligatorias']
        },
        observaciones: {  /*informacion adicional relevante */
            type: String,
            required: false
        }
    }
);

const historiaClinicaSchema = new Schema<IHistoriaClinica>({
    pacienteID: {
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
    consultas: [consultaSchema]
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