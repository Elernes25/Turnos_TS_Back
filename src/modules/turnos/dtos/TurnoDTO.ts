export interface TurnoDTO {
    paciente: string;
    especialidad: string;
    fechaTurno: string | Date;
};

export interface QueryUrgencia{
    urgencia?: string;
}