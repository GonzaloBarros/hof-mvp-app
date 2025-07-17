export interface Patient {
  id: string;
  name: string;
  age: number;
  createdAt: string;
  profilePic?: string | null; // Adicionado campo para a foto de perfil
}
