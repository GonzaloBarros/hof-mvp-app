// Importa os tipos necessários para uma função do Vercel
import type { VercelRequest, VercelResponse } from '@vercel/node';
// Importa a ferramenta da Google AI que acabámos de instalar
import { GoogleGenerativeAI } from '@google/generative-ai';

// Esta é a função principal que será executada pelo Vercel
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // 1. Verificar se o método da requisição é POST (mais seguro para enviar dados)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Obter a chave da API do Gemini a partir das variáveis de ambiente
  // Esta chave NUNCA fica exposta no frontend
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'A chave da API do Gemini não está configurada no servidor.' });
  }

  try {
    // 3. Obter os dados enviados do nosso chat (a pergunta e os dados da análise)
    const { question, analysisData } = req.body;

    // Se não houver pergunta, retorna um erro
    if (!question) {
      return res.status(400).json({ error: 'A pergunta é obrigatória.' });
    }

    // 4. Construir o "Prompt" para a IA, seguindo a sua especificação
    const prompt = `
# PERSONA
Você é um 'Assistente de Diagnóstico' especialista em harmonização orofacial e estética, auxiliando profissionais de saúde qualificados. Sua comunicação é técnica, precisa e segura.

# CONTEXTO
Você está a analisar um relatório de pele de um(a) paciente. Os dados brutos da análise são os seguintes:
${JSON.stringify(analysisData, null, 2)}

# TAREFA
Baseado EXCLUSIVAMENTE nos dados do relatório fornecido, responda de forma estruturada à seguinte pergunta feita pelo profissional:
"${question}"

# REGRAS E LIMITAÇÕES
- NÃO faça diagnósticos médicos finais. A sua função é de suporte à decisão.
- NÃO prescreva medicamentos.
- As suas sugestões devem focar-se em procedimentos estéticos (ex: microagulhamento, peelings, toxina botulínica) e protocolos de skincare.
- Sempre inicie as suas sugestões com frases como "Considerando os dados, algumas opções que podem ser exploradas são..."
- Se a pergunta for fora do âmbito dos dados fornecidos, responda educadamente que só pode discutir os resultados desta análise de pele.
- Responda em português do Brasil.
`;

    // 5. Inicializar a IA e enviar o pedido
    const genAI = new GoogleGenerativeAI(apiKey);
    // CORREÇÃO: O modelo foi alterado de 'gemini-pro' para a versão mais recente
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-1.5-flash-latest' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Enviar a resposta da IA de volta para o nosso chat
    res.status(200).json({ answer: text });

  } catch (error) {
    console.error('Erro ao chamar a API do Gemini:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao comunicar com o assistente de IA.' });
  }
}
