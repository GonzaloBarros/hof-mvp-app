// Importa as ferramentas necessárias do Vercel para a nossa API
import type { VercelRequest, VercelResponse } from '@vercel/node';
// Importa a ferramenta do Google para usar a IA do Gemini
import { GoogleGenerativeAI } from '@google/generative-ai';

// Esta é a função principal da nossa API, que será executada sempre que for chamada
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Usamos um bloco "try...catch" para tentar executar o código.
  // Se algo der errado, o "catch" captura o erro e nos informa.
  try {
    console.log('API /api/ask-ai foi chamada.'); // Um log para sabermos que a função começou

    // Verifica se a chave da API do Gemini está configurada no Vercel
    if (!process.env.GEMINI_API_KEY) {
      console.error('A chave GEMINI_API_KEY não foi encontrada.');
      // Se a chave não existir, retorna um erro claro
      return res.status(500).json({ error: 'Chave da API do Gemini não configurada.' });
    }

    // Pega a pergunta (question) e os dados da análise (analysisData) que o frontend enviou
    const { question, analysisData } = req.body;

    console.log('Pergunta recebida:', question); // Log para ver a pergunta
    console.log('Dados da análise recebidos:', analysisData); // Log para ver os dados da análise

    // Verifica se a pergunta ou os dados da análise estão vazios
    if (!question || !analysisData) {
      console.error('Pergunta ou dados da análise estão em falta.');
      return res.status(400).json({ error: 'A pergunta e os dados da análise são obrigatórios.' });
    }

    // Inicializa a IA do Google com a nossa chave de API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Escolhe o modelo de IA que vamos usar
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // Monta o prompt (a instrução) que vamos enviar para a IA
    const prompt = `Com base nos seguintes dados de análise de pele: ${JSON.stringify(
      analysisData
    )}. Responda à seguinte pergunta: ${question}`;

    console.log('Enviando o seguinte prompt para o Gemini:', prompt); // Log para ver o prompt final

    // Gera o conteúdo com base no nosso prompt
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('Resposta recebida do Gemini:', text); // Log para ver a resposta da IA

    // Envia a resposta da IA de volta para o nosso frontend com sucesso
    res.status(200).json({ response: text });

  } catch (error) {
    // Se qualquer coisa no bloco "try" falhar, o código vem para aqui
    console.error('Ocorreu um erro fatal na API:', error); // Log detalhado do erro

    // Devolve uma mensagem de erro genérica para o frontend, mas o log detalhado fica guardado na Vercel
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
}