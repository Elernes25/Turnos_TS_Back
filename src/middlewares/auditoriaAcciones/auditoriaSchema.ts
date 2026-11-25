import mongoose from "mongoose";

const auditoriaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        
    },
    accion: {
        type: String,
        
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    detalle: {
        type: String
    }
});

export default mongoose.model("Auditoria", auditoriaSchema);