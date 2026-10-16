import { Types } from "mongoose";

export interface IPerfil {
  _id: Types.ObjectId;
  nombre: string;
  dni: string;
  direccion: string;
  telefono: string;
  email:string;
}