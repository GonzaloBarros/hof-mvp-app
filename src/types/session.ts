export interface Session {
    id: string;
    date: string;
    procedures: string; // Onde o dentista descreve o que foi feito
    analysisId?: string; // O ID da análise de IA associada (opcional)
}
