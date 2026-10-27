import { Schema, model, Document,Types} from 'mongoose';
import type { IRecepcionista } from '../recepcionistas/types/Recepcionista.interface';

const recepcionistaSchema = new Schema<IRecepcionista>({
   nombre:{
        type: String,
        required: [true,'El nombre del paciente es obligatorio'],
        uppercase: true
    },
    dni:{
        type: String,
        unique: true,
        required: [true,'El DNI es obligatorio'],
        match: [/^\d[0-9]{7,8}$/, 'El DNI debe tener entre 7 y 8 dígitos']
    },
    direccion: {   
        calle: {
          type: String,
          required: [true, 'La calle es obligatoria']
         },
        numero: {
          type: String,
          required: [true, 'El número es obligatorio']
         },
        piso: {
          type: String
        },
        departamento: {
          type: String
        },
        barrio: {
          type: String
        }
    },
    telefono: {
        tipo: {
            type: String,
            enum: ['CELULAR', 'FIJO']
        },
        codigoPais: {    /*guardar sin el + */
            type: String,
            required: true,
            trim: true,
            match: [/^[1-9][0-9]{0,2}$/, 'El código de País no es válido']
        },
        codigoArea: {
            type: String,
            required: true,
            match: [/^[0-9]{2,5}$/, 'El código de área no es válido']
        },
        numero: {
            type: String,
            required: true,
            match: [/^[0-9]{6,10}$/, 'El número de teléfono no es válido'] /*620 669 SEIS DIGITOS*/
        }
    },
    email:{
        type: String,
        required: false,
        match: [/\S+@\S+\.\S+/, 'El correo electrónico no es válido'] 
    },
    fechaAlta:{
        type: Date // no lo imgresa el usuario lo ingresa el sistema cuando se da de alta una sola vez
    }
},
    {timestamps: true} /*agrega createdAt y updatedAt automáticamente*/
);

recepcionistaSchema.set('toJSON', {
    transform: (documento:Document, recepcionistaRetorno: Record<string, any>) => {
        recepcionistaRetorno.id = recepcionistaRetorno._id;
        delete recepcionistaRetorno._id;
        delete recepcionistaRetorno.__v;
        delete recepcionistaRetorno.createdAt; /*borra los campos agregados por el timestamps */
        delete recepcionistaRetorno.updatedAt;
    }   
    }
);

export default model<IRecepcionista>('Recepcionista', recepcionistaSchema);