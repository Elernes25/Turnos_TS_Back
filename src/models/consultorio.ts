import { Schema, model, Document} from 'mongoose';
import { Consultorio } from '../interfaces/Consultorio.interface.ts'

const consultorioSchema = new Schema<Consultorio>({
    consultorioNumero:{ 
        type: String,
        required: [true,'El numero de consultorio es obligatorio'],
        match: [/^\d+$/, 'El identificador de consultorio debe ser numerico'],
        unique: [true, 'El número de consultorio ya existe']
    },
    /*pregunta: ¿el consultorio es fijo por especialidad o depende del medico cuya especialidad
    esta atendiendo en ese consultorio en ese momento? */
    /*el medico podria tener mas de una especialidad, en ese caso si
    tal vez convenga guardar la especialidad actual del medico*/
  //  especialidad: {
  //      type: mongoose.Schema.Types.ObjectId,   // referencia a un ID de Mongo
  //      ref: "Especialidad"                        // nombre del modelo relacionado
  //  },

    medicoID: {
        type: Schema.Types.ObjectId,   // referencia a un ID de Mongo
        ref: "Medico"                        // nombre del modelo relacionado
    },
    
    disponible: {
        type: Boolean,
        default: true,
    },
},

{timestamps: true},
);

consultorioSchema.set('toJSON', {
    transform: (documento:Document, consultorioRetorno:Record<string,any>) => {
        consultorioRetorno.id = consultorioRetorno._id;
        delete consultorioRetorno._id;
        delete consultorioRetorno.__v;
        delete consultorioRetorno.createdAt; /*borra los campos agregados por el timestamps */
        delete consultorioRetorno.updatedAt;
    }
}
);
export default model <Consultorio>("Consultorio", consultorioSchema);