import { Types, Document } from "mongoose";

export interface IObraSocial extends Document {
    id?: Types.ObjectId;
    nombreObraSocial: string;
}
