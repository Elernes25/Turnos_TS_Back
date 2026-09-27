import { Schema, model, Document} from 'mongoose';
import type { ITurno } from '../turnos/types/Turno.interface';
import { EstadoTurno } from '../interfaces/TurnoEstado.enum';

const turnoSchema = new Schema<ITurno>({

    paciente: {
	    type: Schema.Types.ObjectId,   // referencia a un ID de Mongo
	    ref: "Paciente",               // nombre del modelo relacionado
	    required: [true,'El ID del paciente es obligatorio']
    },
      
    especialidad:{
        type: Schema.Types.ObjectId,   // referencia a un ID de Mongo
        ref: "Especialidad",           // nombre del modelo relacionado
        required: [true,'La especialidad es obligatoria']
    },

    fechaTurno: {
        type: Date,
        required: [true, 'La fecha del turno es obligatoria'],
        validate: {
            validator: function(value:Date) {   /*validación personalizada en Mongoose */
                return value >= new Date();     
            },
            message: 'La fecha del turno debe ser una fecha futura'
        }
    },
    estado: {
        type: String,
        enum:{ 
            values:Object.values(EstadoTurno),  /*valores permitidos para el campo estado */
            default: 'pendiente',   //opcional
            message: '{VALUE} El estado del turno no es válido' /*{VALUE} o (VALUE) son equivalentes */
        }
    },
    
    observaciones: {
        type: String,
    },

    activo: {
        type: Boolean,
        default: true,
        select: false //para que no se muestre en las consultas por defecto, pero si se puede consultar explícitamente
    }
    
},{
    timestamps: true,
}
);


turnoSchema.set('toJSON', {
    transform: (documento:Document, turnoRetorno: Record<string, any>) => {
        turnoRetorno.id = turnoRetorno._id;
        delete turnoRetorno._id;
        delete turnoRetorno.__v;
        delete turnoRetorno.createdAt; /*borra los campos agregados por el timestamps */
        delete turnoRetorno.updatedAt;
    }
});

/*transform: función para modificar el objeto antes de devolverlo.
virtuals: incluir campos virtuales en el JSON.
getters: aplicar getters definidos en el esquema.
versionKey: mostrar u ocultar el campo __v.
minimize: eliminar objetos vacíos o conservarlos.            <-----
depopulate: convertir documentos populados en ObjectId.
flattenMaps: convertir campos tipo Map en objetos planos.
useProjection: respetar la proyección (select) al convertir a JSON. */


const TurnoModel = model<ITurno>('Turno', turnoSchema);
export default TurnoModel;
