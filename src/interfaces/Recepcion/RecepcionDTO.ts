export interface RegistrarIngresoDTO {
    datosPaciente:[];
    especialidad: string;
    fechaTurno: string | Date;
    estado?: string;
    observaciones?: string;
};
