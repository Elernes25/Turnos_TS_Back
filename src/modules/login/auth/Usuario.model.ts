import { Schema, model, Document } from "mongoose";  

export enum Rol{
    ADMIN = 'ADMIN',
    SUPERVISOR = 'SUPERVISOR',
    RECEPCIONISTA ='RECEPCIONISTA',
    MEDICO = 'MEDICO',
    //PACIENTE = ´PACIENTE´
}

export interface  IUsuario extends Document {
    email:string;             /*con minuscula string  no se usa en interfaces*/
    user: string;
    password:string;
    rol:Rol;
    activo:boolean;
    //perfilId: ObjectId;
}
/*En interfaces/TypeScript → siempre string (minúscula).
  En schemas/Mongoose → siempre String (mayúscula).
  String (mayúscula) → es el constructor de tipo de Mongoose.
  Cuando definís un esquema, Mongoose espera el tipo como referencia al constructor*/

const usuarioSchema = new Schema <IUsuario>({
    email: { type: String, required: true, unique: true },   //con mayuscula String //
    user: { type: String, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: Object.values(Rol), default: Rol.RECEPCIONISTA },
    activo: {type: Boolean, default: true }
    //perfilId: ObjectId;
})

export default model <IUsuario> ('Usuario',usuarioSchema);