import { GoogleGenerativeAI } from "@google/generative-ai";

// Pega na nossa chave de API guardada no ficheiro .env
// A chave fornecida pelo utilizador é usada aqui.
const apiKey = 'AIzaSyCBM1fs2YfkLyF_x9-4VirRPZ8zAemZXi0'; // Esta chave está agora diretamente no código para teste.

if (!apiKey) {
    throw new Error("Chave de API do Gemini não encontrada. Verifique o ficheiro .env");
}

// Inicializa o cliente da IA da Google com a nossa chave
const genAI = new GoogleGenerativeAI(apiKey);

// Pega no modelo de IA que queremos usar (gemini-2.0-flash é um bom modelo para texto)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"}); // <-- ALTERAÇÃO AQUI

// Função principal que envia a pergunta para a IA e devolve a resposta
export const runAiQuery = async (prompt: string): Promise<string> => {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error: any) { // Adicionado 'any' para facilitar o log do erro
        console.error("Erro ao comunicar com a API do Gemini:", error);
        // Tenta extrair uma mensagem de erro mais específica, se disponível
        if (error.message) {
            console.error("Mensagem de erro da API:", error.message);
            return `Desculpe, ocorreu um erro: ${error.message}. Por favor, tente novamente.`;
        }
        return "Desculpe, ocorreu um erro ao tentar obter uma resposta da IA. Por favor, tente novamente.";
    }
};
