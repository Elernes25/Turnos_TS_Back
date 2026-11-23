import { Schema, model, Document} from 'mongoose';
import { type IConsultaClinica } from './types/ConsultasClinicas.interfase';

const consultaClinicaSchema = new Schema <IConsultaClinica> ({
        pacienteId: {
            type: Schema.Types.ObjectId,
            ref: 'Paciente',
            required: [true, 'El paciente es obligatorio'],
        },
        fecha: {
            type: Date,
            required: [true, 'La fecha es obligatoria'],   
            },
        medicoId: {
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
export default model<IConsultaClinica>('ConsultaClinica', consultaClinicaSchema);