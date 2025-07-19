export interface Appointment {
    id: string;
    title: string;
    start: Date;
    end: Date;
    patientId?: string; // Para no futuro sabermos a que paciente pertence
    notes?: string;
  }