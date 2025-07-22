export interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  patientId?: string; // Tornar patientId opcional
}
