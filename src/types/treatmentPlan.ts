import { Session } from './session';

export interface TreatmentPlan {
    id: string;
    patientId: string;
    title: string; // Ex: "Rejuvenescimento Terço Superior"
    createdAt: string;
    sessions: Session[];
}
