export interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  patientId?: string; // <-- AQUI ESTÁ A CORREÇÃO!
}
