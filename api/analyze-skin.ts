import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { JSEncrypt } from 'js-encrypt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: 'Nenhum dado de imagem fornecido.' });
    }
    
    const apiKey = process.env.PERFECTCORP_API_KEY;
    const publicKey = process.env.PERFECTCORP_PUBLIC_KEY;

    // --- NOVO: Verificação mais detalhada das chaves ---
    if (!apiKey) {
      // Devolvemos um erro específico se a chave de API estiver em falta
      return res.status(500).json({ error: 'ERRO NO SERVIDOR: A variável de ambiente PERFECTCORP_API_KEY não foi encontrada.' });
    }
    if (!publicKey) {
      // Devolvemos um erro específico se a chave pública estiver em falta
      return res.status(500).json({ error: 'ERRO NO SERVIDOR: A variável de ambiente PERFECTCORP_PUBLIC_KEY não foi encontrada.' });
    }

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const dataToEncrypt = `${apiKey}:${Date.now()}`;
    const signature = encrypt.encrypt(dataToEncrypt);

    if (!signature) {
      return res.status(500).json({ error: 'Falha ao encriptar a assinatura. Verifique se a Chave Pública está correta.' });
    }

    try {
      const authResponse = await axios.post(
        'https://yce-api-01.perfectcorp.com/v1.0/client/auth:1',
        { signature: signature },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const accessToken = authResponse.data.access_token;
      if (!accessToken) {
        throw new Error('Token de acesso não foi retornado pela API de autenticação.');
      }
      
      const finalResponse = {
        success: true,
        message: "Autenticação com a PerfectCorp bem-sucedida!",
        analysisResult: { }
      };
      
      return res.status(200).json(finalResponse);

    } catch (authError: any) {
      // Agora, vamos devolver uma mensagem mais clara
      return res.status(401).json({ error: 'Falha na autenticação com a PerfectCorp (Erro 401). Verifique se as chaves de API e Pública estão corretas na Vercel.' });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Ocorreu um erro fatal e inesperado na API.' });
  }
}
