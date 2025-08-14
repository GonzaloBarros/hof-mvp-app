import axios from 'axios';
// --- NOVO: Importamos a biblioteca de criptografia correta ---
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

// O endpoint base da API.
const API_BASE_URL = 'https://yce-api-01.perfectcorp.com';

// Lemos as credenciais do ambiente. Estas devem estar no Vercel.
const CLIENT_ID = process.env.REACT_APP_PERFECTCORP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_PERFECTCORP_CLIENT_SECRET;

let accessToken: string | null = null;
let accessTokenExpiration: number = 0;

// --- CORRIGIDO: Esta função agora usa HMAC-SHA256, como a documentação exige ---
const generateIdToken = (): string | null => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("ERRO: Credenciais REACT_APP_PERFECTCORP_CLIENT_ID ou CLIENT_SECRET não configuradas.");
    return null;
  }
  
  try {
    const timestamp = new Date().getTime();
    const payload = `client_id=${CLIENT_ID}&timestamp=${timestamp}`;
    
    // Criamos a assinatura usando a chave secreta.
    const signature = HmacSHA256(payload, CLIENT_SECRET);
    // Convertemos a assinatura para o formato Base64, que é o padrão para envio.
    const id_token = Base64.stringify(signature);

    return id_token;

  } catch (error) {
    console.error("Erro ao gerar o id_token com HMAC-SHA256:", error);
    return null;
  }
};

// Passo 1: Autenticar e obter o token de acesso
const authenticate = async (): Promise<string> => {
  if (accessToken && accessTokenExpiration > Date.now()) {
    return accessToken;
  }
  
  console.log("A obter um novo token de acesso...");
  const id_token = generateIdToken();

  if (!id_token || !CLIENT_ID) {
    throw new Error("Credenciais da API não configuradas. Verifique as variáveis de ambiente e reinicie a aplicação.");
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/s2s/v1.0/client/auth`, {
      client_id: CLIENT_ID,
      id_token: id_token,
    });

    const newAccessToken = response.data.result.access_token;
    if (!newAccessToken) {
        throw new Error("A resposta da API de autenticação não continha um access_token.");
    }
    accessToken = newAccessToken;
    accessTokenExpiration = Date.now() + 3600 * 1000; // Validade de 1 hora
    console.log("Token de acesso obtido com sucesso!");
    return accessToken;
  } catch (error) {
    console.error("Erro detalhado no Passo 1 (Autenticação):", axios.isAxiosError(error) ? error.response?.data : error);
    throw new Error(`Falha na autenticação (Erro 401). Verifique se as credenciais CLIENT_ID e CLIENT_SECRET estão corretas.`);
  }
};

// ... (O resto do seu código de 5 passos continua aqui, ele já estava bem estruturado)

// Passo 2: Obter o URL de upload
const getUploadUrl = async (token: string, imageFile: File): Promise<{ upload_url: string; file_id: string }> => {
    // ... (código inalterado)
};

// Passo 3: Fazer o upload da imagem
const uploadImage = async (uploadUrl: string, imageFile: File): Promise<void> => {
    // ... (código inalterado)
};

// Passo 4: Iniciar a tarefa de análise
const startAnalysisTask = async (token: string, fileId: string): Promise<string> => {
    // ... (código inalterado)
};

// Passo 5: Verificar o status da tarefa
const pollTaskStatus = async (token: string, taskId: string): Promise<any> => {
    // ... (código inalterado)
};


// Função principal que orquestra todo o processo
export const analyzeImage = async (imageFile: File): Promise<any> => {
  console.log("Iniciando o processo de análise de imagem...");
  
  if (!imageFile) {
    throw new Error("Nenhum ficheiro de imagem fornecido para a análise.");
  }

  try {
    const token = await authenticate();
    const { upload_url, file_id } = await getUploadUrl(token, imageFile);
    await uploadImage(upload_url, imageFile);
    const taskId = await startAnalysisTask(token, file_id);
    const analysisResults = await pollTaskStatus(token, taskId);

    console.log("Análise concluída com sucesso! Resultados:", analysisResults);
    return analysisResults;
  } catch (error) {
    console.error("Falha completa no processo de análise:", error);
    // Lançamos o erro para que a página que chamou esta função possa apanhá-lo e mostrar uma mensagem ao utilizador.
    throw error;
  }
};
