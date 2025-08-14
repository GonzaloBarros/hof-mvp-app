import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
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
    
    console.log('Iniciando o Passo 1: Autenticação com a PerfectCorp...');

    const apiKey = process.env.PERFECTCORP_API_KEY;
    const publicKey = process.env.PERFECTCORP_PUBLIC_KEY;

    // --- NOVO: Bloco de Depuração para Verificar as Chaves ---
    // Este bloco vai mostrar um pedaço das chaves nos logs da Vercel para podermos confirmar.
    console.log('--- INÍCIO DA DEPURAÇÃO DE CHAVES ---');
    if (apiKey) {
      console.log('Chave de API (primeiros 5 caracteres):', apiKey.substring(0, 5));
    } else {
      console.log('ERRO: Chave de API (PERFECTCORP_API_KEY) não encontrada!');
    }
    if (publicKey) {
      console.log('Chave Pública (primeiros 20 caracteres):', publicKey.substring(0, 20));
    } else {
      console.log('ERRO: Chave Pública (PERFECTCORP_PUBLIC_KEY) não encontrada!');
    }
    console.log('--- FIM DA DEPURAÇÃO DE CHAVES ---');
    // CUIDADO: É boa prática remover estes logs depois de resolver o problema.

    if (!apiKey || !publicKey) {
      console.error('ERRO: As chaves da PerfectCorp não estão configuradas no Vercel.');
      return res.status(500).json({ error: 'As chaves da API não estão configuradas.' });
    }

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
      return res.status(401).json({ error: 'Falha na autenticação com a PerfectCorp.' });
    }
    
    const finalResponse = {
      success: true,
      message: "Autenticação com a PerfectCorp bem-sucedida!",
      analysisResult: { }
    };
    
    res.status(200).json(finalResponse);

  } catch (error) {
    console.error('Erro fatal na API analyze-skin:', error);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
  }
}
