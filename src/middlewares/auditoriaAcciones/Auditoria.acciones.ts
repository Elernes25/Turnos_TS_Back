import Auditoria from "../auditoriaAcciones/auditoriaSchema.js";

export const registrarAuditoria = async (
    usuarioId: string,
    accion: string,
    detalle?: string
) => {

    await Auditoria.create({
        usuario: usuarioId,
        accion,
        ...(detalle ? { detalle } : {})
    });
};
