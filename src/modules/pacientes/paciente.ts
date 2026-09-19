import { Schema, model, Document} from 'mongoose';
import type { Paciente } from '../pacientes/types/Paciente.interface';
import { ObraSocial } from '../interfaces/ObraSocial.enum';

const pacienteSchema = new Schema<Paciente>({
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
    fechaDeNacimiento:{
	    type: Date,
	    required:true
	},
    sexo:{ 
        type: String,      
	    enum: {
            values: ['FEMENINO', 'MASCULINO'],          //*por motivos estadisticosa*//
            message: '(VALUE) El sexo no es válido'
        },
	    required:true
	},
    direccion: {    /*antes era domicilio */
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
   
    obraSocial: {
        obraSocialNombre: {
            type: String,
            required: [true, 'El nombre de la obra social es obligatorio'],
            enum:{
                values: Object.values(ObraSocial),
                message: '{VALUE} no es una obra social válida. Debe ser una de las siguientes: PAMI, OSPEL, OSDE, SANCOR, OSECAC, SWISS MEDICAL, GALENO, MEDICUS, OMINT, FEMEBA, OTRAS, NINGUNA'
            }
        },
        numeroAfiliado: {
            type: String
        },
    },
//Obra social o prepaga (nombre de la entidad).
//    Número de afiliado 
//    Plan médico (determina el nivel de cobertura).
//    categoría de afiliación (titular o familiar).
//    obraSocial:{
//        nombre: { type: String, required: function() { return this.tieneObraSocial; } },
//        numeroAfiliado: { type: String, required: function() { return this.tieneObraSocial; } },
//        planMedico: { type: String, required: function() { return this.tieneObraSocial; } }
//    }  

},
    {timestamps: true} /*agrega createdAt y updatedAt automáticamente*/
);


/*pacienteSchema.virtual('edad').get(function() 
    { // Calculamos los años de diferencia entre hoy y su fecha de nacimiento const hoy = new Date();
const nacimiento = new Date(this.fechaNacimiento); 
return hoy.getFullYear() - nacimiento.getFullYear(); 
}); // Para que el JSON final incluya estos campos "fantasma",
//  debemos avisarle al toJSON: 
// pacienteSchema.set('toJSON', { virtuals: true });*/


pacienteSchema.set('toJSON', {
    transform: (documento:Document, pacienteRetorno: Record<string, any>) => {
        pacienteRetorno.id = pacienteRetorno._id;
        delete pacienteRetorno._id;
        delete pacienteRetorno.__v;
        delete pacienteRetorno.createdAt; /*borra los campos agregados por el timestamps */
        delete pacienteRetorno.updatedAt;
    }
    //<------- agregar virtuals despues  virtuals: true 
}
);

//nombre del modelo: Paciente con mayuscula//
export default model<Paciente>('Paciente', pacienteSchema);