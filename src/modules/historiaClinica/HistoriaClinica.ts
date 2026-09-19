import { Schema, model, Document} from 'mongoose';
import type { HistoriaClinica } from '../historiaClinica/types/HistoriaClinica.interface';

const historiaClinicaSchema = new Schema<HistoriaClinica>({
    pacienteID: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente',
        required: [true, 'El paciente es obligatorio'],
    },
 
    antecedentes: {
        /* grupoSanguineo:{ type: String, required:true,
	    match: /^(A|B|AB|O)[+-]$|^No sabe$/  // acepta A+, A-, B+, B-, AB+, AB-, O+, O- Hay gente que no se acuerda de su grupo sanguíneo, por lo que se permite "No sabe" como valor válido   
	    }, */
        alergias: [{ type: String }], /*arreglo de strings para realizar busquedas refinadas */
        cirugias: [{ type: String }],
        enfermedadesCronicas: [{ type: String }],
        historiaGeneral: { type: String } /* info no especifica pero relevante*/
    },
    consultas: [{       /*arreglo de consultas cada vez que viene el paciente se registra una distinta */
        fecha: {
            type: Date,
            required: [true, 'La fecha es obligatoria'],   
            validate: {
                validator: function(value) {
                    return value >= new Date();
                },
                message: 'La fecha del turno debe ser una fecha futura',
            }, 
        },
         /*puede ser un medico de otro nosocomio?
        no porque es el medico que ingresa al sistema el que puede escribir
        en caso de traer resultados de diagnosticos previos se pone en observaciones o algo asi*/
        medico: {
            type: Schema.Types.ObjectId,   /*deberia ser un ObjectId que referencia al modelo Medico */
            required: [true, 'El nombre del médico es obligatorio'] 
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
        
    }]
}, 
    {timestamps: true}
); 

    //historiaClinica:{ //genero objetos separados para tener un mejor acceso y 
                        //ordenamiento de la información ante consultas puntuales, 
                        //ya que la historia clínica puede ser extensa y compleja.
                        //otros campos a considerar podrian ser: antecedentes familiares, medicación actual, alergias a medicamentos, etc.
                        //podria haber datos relevantes segun la especialidad medica, por ej.: antecedentes obstetricos para ginecologia,
                        //antecedentes cardiacos para cardiologia, etc.
	//   alergias: [{ type: String }], /*arreglo de strings para realizar busquedas refinadas */
    //   cirugias: [{ type: String }],
    //   enfermedadesCronicas: [{ type: String }],
    //   historiaGeneral: { type: String } /* info no especifica pero relevante*/
	//}


// Transformación del objeto a JSON
historiaClinicaSchema.set('toJSON', {
    transform: (doc:Document, ret: Record<string,any>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

export default model<HistoriaClinica>('HistoriaClinica', historiaClinicaSchema);
