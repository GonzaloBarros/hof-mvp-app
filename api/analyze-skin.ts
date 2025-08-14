import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
// --- CORREÇÃO: Mudámos a forma de importar a biblioteca ---
import { JSEncrypt } from 'js-encrypt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    console.log('API /api/analyze-skin foi chamada.');
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Nenhum dado de imagem fornecido.' });
    }
    
    // --- PASSO 1: Obter o Token de Acesso ---
    console.log('Iniciando o Passo 1: Autenticação com a PerfectCorp...');

    const apiKey = process.env.PERFECTCORP_API_KEY;
    const publicKey = process.env.PERFECTCORP_PUBLIC_KEY;

    if (!apiKey || !publicKey) {
      console.error('ERRO: Chaves da PerfectCorp não encontradas no Vercel.');
      return res.status(500).json({ error: 'As chaves da API não estão configuradas.' });
    }

    // A linha abaixo agora funciona por causa da correção na importação
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const dataToEncrypt = `${apiKey}:${Date.now()}`;
    const signature = encrypt.encrypt(dataToEncrypt);

    if (!signature) {
      console.error('ERRO: Falha ao encriptar a assinatura.');
      return res.status(500).json({ error: 'Falha no processo de encriptação.' });
    }

    let accessToken;
    try {
      // Usamos a assinatura encriptada para pedir um token de acesso.
      const authResponse = await axios.post(
        'https://yce-api-01.perfectcorp.com/v1.0/client/auth:1',
        { signature: signature },
        { headers: { 'Content-Type': 'application/json' } }
      );

      accessToken = authResponse.data.access_token;
      if (!accessToken) {
        throw new Error('Token de acesso não foi retornado pela API de autenticação.');
      }
      console.log('Passo 1 concluído: Token de Acesso obtido com sucesso!');

    } catch (authError: any) {
      console.error('ERRO no Passo 1 (Autenticação):', authError.response?.data || authError.message);
      // Retornamos o erro 401 que vimos, pois a autenticação falhou.
      return res.status(401).json({ error: 'Falha na autenticação com a PerfectCorp.' });
    }
    
    // --- PASSO 2: Usar o Token de Acesso para a Análise (Ainda simulado) ---
    /*
    console.log('Iniciando Passo 2: Enviando imagem para análise...');
    const analysisResponse = await axios.post(
      'https://URL_REAL_DA_ANALISE/api/v1/endpoint', // Substituir pelo URL correto
      { image_base64: imageData },
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    */

    // Por enquanto, vamos apenas confirmar que a autenticação funcionou.
    const finalResponse = {
      success: true,
      message: "Autenticação com a PerfectCorp bem-sucedida!",
      analysisResult: {
        // os dados da análise viriam aqui
      }
    };
    
    res.status(200).json(finalResponse);

  } catch (error) {
    console.error('Erro fatal na API analyze-skin:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
}
