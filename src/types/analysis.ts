// Por agora, definimos a análise com uma estrutura mais genérica.
// Vamos adicionar os campos corretos depois de vermos a resposta real da API.
export interface Analysis {
  id: string;
  patientId: string;
  createdAt: string;
  imageUrl: string;
  // A propriedade 'data' vai guardar o resultado completo da API.
  data: any; 
}
