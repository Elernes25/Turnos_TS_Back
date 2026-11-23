import { Schema, model, Document } from "mongoose";  
import { Rol } from "../../interfaces/Rol.enum";


export interface  IUsuario extends Document {
    email:string;             /*con minuscula string  no se usa en interfaces*/
    user: string;
    dni: string;
    password:string;
    rol: Rol;
    activo:boolean;
    fechaCreacion: Date;
    debeCambiarPassword: boolean;
}

const usuarioSchema = new Schema <IUsuario>({
    email: { type: String, required: true, unique: true ,lowercase: true,trim: true},   //con mayuscula String //
    user: { type: String, required: true  },
    dni: {type: String},
    password: { type: String, required: true },
    rol: { type: String, enum: Object.values(Rol), default: Rol.RECEPCIONISTA },
    activo: {type: Boolean, default: true },
    fechaCreacion: {type: Date},
    debeCambiarPassword: {type: Boolean, default: true }  
},
    {timestamps: true},
);/*agrega createdAt y updatedAt automáticamente*/

usuarioSchema.set('toJSON', {
    transform: (documento:Document, usuarioRetorno: Record<string,any>) => {
        usuarioRetorno.id = usuarioRetorno._id;
        delete usuarioRetorno._id;
        delete usuarioRetorno.__v;
        delete usuarioRetorno.createdAt; /*borra los campos agregados por el timestamps */
        delete usuarioRetorno.updatedAt;
    }}
);

export default model <IUsuario> ('Usuario',usuarioSchema);