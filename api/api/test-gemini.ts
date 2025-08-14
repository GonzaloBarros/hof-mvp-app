import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'A chave da API do Gemini não está configurada no servidor.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-1.5-flash-latest' });
    
    const result = await model.generateContent('Qual é o seu propósito?');
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ answer: text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao tentar conectar com a API do Gemini. Verifique sua chave e permissões.' });
  }
}
