import { Schema, model, Document } from "mongoose";
import type { IObraSocial } from "./types/ObraSocial.interface";

const obraSocialSchema = new Schema<IObraSocial>(
    {
        nombreObraSocial: {
            type: String,
            required: [true, "El nombre de la obra social es obligatorio"],
            unique: true,
            trim: true,
            uppercase: true,
        },
    },
    { timestamps: true },
);

obraSocialSchema.set("toJSON", {
    transform: (_documento: Document, obraSocialRetorno: Record<string, any>) => {
        obraSocialRetorno.id = obraSocialRetorno._id;
        delete obraSocialRetorno._id;
        delete obraSocialRetorno.__v;
        delete obraSocialRetorno.createdAt;
        delete obraSocialRetorno.updatedAt;
    },
});

export default model<IObraSocial>("ObraSocial", obraSocialSchema);
