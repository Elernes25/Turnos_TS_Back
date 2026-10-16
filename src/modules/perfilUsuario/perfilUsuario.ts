import { Schema, model, Types, Document} from 'mongoose';
import  {IPerfil} from '../perfilUsuario/types/Perfil.interfase'


const perfilSchema = new Schema<IPerfil>({
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
    }
},
    {timestamps: true} 
);
export default model<IPerfil>('Perfil', perfilSchema);