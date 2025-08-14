import axios from 'axios';
import { JSEncrypt } from 'js-encrypt';

// Função auxiliar para converter o texto da imagem (data URL) num ficheiro (File)
const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error('Invalid data URL');
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const API_BASE_URL = 'https://yce-api-01.perfectcorp.com';

const CLIENT_ID = process.env.REACT_APP_PERFECTCORP_CLIENT_ID;
// O "SECRET" é, na verdade, a Chave Pública para encriptação
const PUBLIC_KEY = process.env.REACT_APP_PERFECTCORP_CLIENT_SECRET;

let accessToken: string | null = null;
let accessTokenExpiration: number = 0;

// Esta função usa RSA para ENCRIPTAR, como nos exemplos do Aj Chou
const generateIdToken = (): string | null => {
  if (!CLIENT_ID || !PUBLIC_KEY) {
    console.error("ERRO: Credenciais CLIENT_ID ou CLIENT_SECRET (Chave Pública) não configuradas.");
    return null;
  }
  
  try {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUBLIC_KEY);
    
    const timestamp = new Date().getTime();
    const payload = `client_id=${CLIENT_ID}&timestamp=${timestamp}`;
    
    const encrypted = encrypt.encrypt(payload);

    if (encrypted === false) {
      throw new Error("A encriptação com JSEncrypt falhou. Verifique a Chave Pública.");
    }

    return encrypted;

  } catch (error) {
    console.error("Erro ao gerar o id_token com JSEncrypt:", error);
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
    throw new Error("Credenciais da API não configuradas ou falha na geração do id_token.");
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/s2s/v1.0/client/auth`, {
      client_id: CLIENT_ID,
      id_token: id_token,
    });

    const newAccessToken = response.data.result.access_token;
    if (typeof newAccessToken !== 'string' || newAccessToken.length === 0) {
        throw new Error("A resposta da API de autenticação não continha um access_token válido.");
    }

    accessToken = newAccessToken;
    accessTokenExpiration = Date.now() + 3600 * 1000;
    console.log("Token de acesso obtido com sucesso!");
    return newAccessToken;
    
  } catch (error) {
    console.error("Erro detalhado no Passo 1 (Autenticação):", axios.isAxiosError(error) ? error.response?.data : error);
    throw new Error(`Falha na autenticação (Erro 401). Verifique se as credenciais CLIENT_ID e CLIENT_SECRET (Chave Pública) estão corretas.`);
  }
};

// O resto do fluxo de 5 passos
const getUploadUrl = async (token: string, imageFile: File): Promise<{ upload_url: string; file_id: string }> => {
  console.log("A obter URL de upload...");
  try {
    const response = await axios.post(`${API_BASE_URL}/s2s/v1.1/file/skin-analysis`, 
      { files: [{ file_name: imageFile.name, file_size: imageFile.size }] },
      { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    const { upload_url, file_id } = response.data.result.files[0];
    return { upload_url, file_id };
  } catch (error) {
    console.error("Erro no Passo 2 (Obter URL de Upload):", error);
    throw new Error(`Falha ao obter URL de upload: ${axios.isAxiosError(error) ? error.message : "Erro desconhecido"}`);
  }
};

const uploadImage = async (uploadUrl: string, imageFile: File): Promise<void> => {
  console.log("A fazer upload da imagem...");
  try {
    await axios.put(uploadUrl, imageFile, { headers: { 'Content-Type': imageFile.type } });
    console.log("Upload da imagem concluído com sucesso!");
  } catch (error) {
    console.error("Erro no Passo 3 (Upload da Imagem):", error);
    throw new Error(`Falha no upload da imagem: ${axios.isAxiosError(error) ? error.message : "Erro desconhecido"}`);
  }
};

const startAnalysisTask = async (token: string, fileId: string): Promise<string> => {
  console.log("A iniciar a tarefa de análise...");
  try {
    const response = await axios.post(`${API_BASE_URL}/s2s/v1.0/task/skin-analysis`, 
      {
        request_id: Math.floor(Math.random() * 1000000),
        payload: {
          file_sets: { image: { file_id: fileId } },
          actions: ['wrinkles', 'spots', 'redness', 'dark_circles'],
        },
      },
      { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    return response.data.result.task_id as string;
  } catch (error) {
    console.error("Erro no Passo 4 (Iniciar a Tarefa de Análise):", error);
    throw new Error(`Falha ao iniciar a tarefa de análise: ${axios.isAxiosError(error) ? error.message : "Erro desconhecido"}`);
  }
};

const pollTaskStatus = async (token: string, taskId: string): Promise<any> => {
  console.log("A verificar o status da tarefa...");
  const maxAttempts = 30;
  const interval = 1000;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await axios.get(`${API_BASE_URL}/s2s/v1.0/task/skin-analysis`, {
        params: { task_id: taskId },
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      const taskStatus = response.data.result.status;
      console.log(`Status da tarefa: ${taskStatus}`);

      if (taskStatus === 'success') {
        return response.data.result.results;
      }
      if (taskStatus === 'error') {
        console.error("Tarefa da API retornou um erro:", response.data.result.error_message);
        throw new Error(`Erro na análise: ${response.data.result.error_message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
    } catch (error) {
      console.error("Erro no Passo 5 (Verificar Status da Tarefa):", error);
      throw new Error(`Falha ao verificar o status da tarefa: ${axios.isAxiosError(error) ? error.message : "Erro desconhecido"}`);
    }
  }

  throw new Error("Tempo limite excedido ao verificar o status da tarefa.");
};

export const analyzeImage = async (imageDataUrl: string): Promise<any> => {
  console.log("Iniciando o processo de análise de imagem...");
  
  if (!imageDataUrl) {
    throw new Error("Nenhum dado de imagem fornecido para a análise.");
  }

  try {
    const imageFile = dataURLtoFile(imageDataUrl, 'skin-analysis-image.jpg');
    const token = await authenticate();
    const { upload_url, file_id } = await getUploadUrl(token, imageFile);
    // --- CORREÇÃO DO ERRO DE DIGITAÇÃO ---
    await uploadImage(upload_url, imageFile); // Estava 'image_file'
    const taskId = await startAnalysisTask(token, file_id);
    const analysisResults = await pollTaskStatus(token, taskId);

    console.log("Análise concluída com sucesso! Resultados:", analysisResults);
    return analysisResults;
  } catch (error) {
    console.error("Falha completa no processo de análise:", error);
    throw error;
  }
};
