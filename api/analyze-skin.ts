import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import JSEncrypt from 'js-encrypt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // --- NOVO: Verificar se o método é POST ---
  // Estamos a enviar dados (a imagem), por isso devemos usar o método POST.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    console.log('API /api/analyze-skin foi chamada com o método POST.');

    // --- 1. Receber a imagem do corpo do pedido ---
    const { imageData } = req.body;

    // Verificar se a imagem foi realmente enviada
    if (!imageData) {
      console.error('Nenhum dado de imagem recebido.');
      return res.status(400).json({ error: 'Nenhum dado de imagem fornecido.' });
    }
    
    // Apenas para verificar, vamos mostrar uma pequena parte da imagem (em formato base64) nos logs.
    console.log('Dados da imagem recebidos (primeiros 50 caracteres):', imageData.substring(0, 50));

    const apiKey = process.env.PERFECTCORP_API_KEY;
    const publicKey = process.env.PERFECTCORP_PUBLIC_KEY;

    if (!apiKey || !publicKey) {
      console.error('Chaves da PerfectCorp não configuradas no Vercel.');
      return res.status(500).json({ error: 'As chaves da API da PerfectCorp não estão configuradas corretamente no servidor.' });
    }

    // --- 2. Preparar a encriptação (como antes) ---
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);

    const dataToEncrypt = `${apiKey}:${Date.now()}`;
    const encryptedData = encrypt.encrypt(dataToEncrypt);

    if (!encryptedData) {
      console.error('Falha ao encriptar os dados.');
      return res.status(500).json({ error: 'Ocorreu um erro durante o processo de encriptação.' });
    }
    
    // --- 3. FAZER A CHAMADA REAL PARA A PERFECTCORP ---
    // O próximo passo seria descomentar este bloco e ajustá-lo com o URL e
    // os parâmetros corretos da documentação da PerfectCorp.
    /*
    console.log('Enviando requisição para a PerfectCorp...');
    const perfectCorpResponse = await axios.post(
      'https://URL_REAL_DA_PERFECTCORP/api/v1/analise', // Substituir pelo URL correto
      {
        // O corpo do pedido provavelmente espera a imagem e outros dados
        image_base64: imageData,
        // outros_parametros: '...'
      },
      {
        headers: {
          'Authorization': `Bearer ${encryptedData}`,
          'Content-Type': 'application/json'
        }
      }
    );
    */

    // --- 4. SIMULAR UMA RESPOSTA (ainda estamos a usar isto para testes) ---
    const simulatedResponse = {
      success: true,
      message: "Imagem recebida e autenticação simulada com sucesso!",
      analysis: {
        wrinkles: 0.78,
        spots: 0.60,
        texture: 0.82,
      }
    };
    console.log('Simulação de resposta da PerfectCorp:', simulatedResponse);

    // --- 5. ENVIAR A RESPOSTA DE VOLTA PARA O FRONTEND ---
    res.status(200).json(simulatedResponse);

  } catch (error) {
    console.error('Erro fatal na API analyze-skin:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor ao contactar a PerfectCorp.' });
  }
}
