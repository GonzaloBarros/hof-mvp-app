export interface Patient {
  id: string;
  name: string;
  age: number;
  createdAt: string;
  profilePic?: string | null;
  isActive: boolean; // NOVO: Adiciona um campo para indicar se o paciente está ativo/visível
}