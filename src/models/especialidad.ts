import { Schema, model, Document} from 'mongoose';
import { Especialidad } from '../interfaces/Especialidad.interface.ts'

const especialidadSchema = new Schema<Especialidad>({

    especialidadNombre:{ 
        type: String,
        required: [true,'La especialidad es obligatoria'],
        unique: true,
        uppercase: true
       /*las tengo que llenar cuando se cargan y puede haber muchas mas que esa lista */ 
       // enum: {
       //     values: ['CARDIOLOGÍA', 'NEUROLOGÍA', 'PEDIATRÍA', 
       //            'TRAUMATOLOGÍA','ODONTOLOGÍA','OFTALMOLOGÍA'],
       //    message: '(VALUE) La especialidad no es válida' /*(VALUE) placeholder de Mongoose. */
       //
    },
    descripcion: {
        type: String,
        //required: [true, 'La descripción de la especialidad es obligatoria'],
        trim: true
  }
},
{timestamps: true},
);

especialidadSchema.set('toJSON', {
    transform: (documento:Document, especialidadRetorno: Record<string,any>) => {
        especialidadRetorno.id = especialidadRetorno._id;
        delete especialidadRetorno._id;
        delete especialidadRetorno.__v;
        delete especialidadRetorno.createdAt; /*borra los campos agregados por el timestamps */
        delete especialidadRetorno.updatedAt;
    }
}
);

export default model<Especialidad>('Especialidad', especialidadSchema);
