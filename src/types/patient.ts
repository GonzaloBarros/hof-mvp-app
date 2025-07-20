export interface Patient {
  id: string;
  name: string;
  age: number;
  birthDate: string;
  phone: string;
  email: string;
  mainComplaint: string;
  healthHistory: string;
  comments?: string; // NOVO: Campo para comentários/observações adicionais
  createdAt: string;
  profilePic?: string | null;
  isActive: boolean;
}