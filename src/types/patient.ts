export interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
  
  // Adicionando os campos opcionais que faltavam
  profilePic?: string;
  birthDate?: string;
  mainComplaint?: string;
  healthHistory?: string;
  comments?: string; // <-- AQUI ESTÁ A CORREÇÃO!
}
