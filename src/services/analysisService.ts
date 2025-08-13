import axios from 'axios';
import { JSEncrypt } from 'js-encrypt';

// O endpoint base da API que estávamos a usar estava incorreto.
// O endpoint correto é o que vimos na documentação de autenticação.
const API_BASE_URL = 'https://yce-api-01.perfectcorp.com';

const CLIENT_ID = process.env.REACT_APP_PERFECTCORP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_PERFECTCORP_CLIENT_SECRET;

let accessToken: string | null = null;
let accessTokenExpiration: number = 0;

// Esta função gera o 'id_token' usando a chave secreta, conforme a documentação
const generateIdToken = (): string | null => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("ERRO: Credenciais da API não configuradas no ficheiro .env");
    return null;
  }
  
  try {
    const encrypt = new JSEncrypt();
    // A documentação pode estar a usar a chave secreta como a chave pública para encriptar
    encrypt.setPublicKey(CLIENT_SECRET);
    const timestamp = new Date().getTime();
    const payload = `client_id=${CLIENT_ID}&timestamp=${timestamp}`;
    const encrypted = encrypt.encrypt(payload);
    
    // CORRIGIDO: Verifica se a encriptação falhou e retorna null
    if (encrypted === false) {
      console.error("Erro: Falha na encriptação do id_token.");
      return null;
    }

    return encrypted;

  } catch (error) {
    console.error("Erro ao encriptar o id_token:", error);
    return null;
  }
};

// Passo 1: Autenticar e obter o token de acesso
const authenticate = async (): Promise<string | null> => {
  // Verifica se o token ainda é válido
  if (accessToken && accessTokenExpiration > Date.now()) {
    console.log("Token de acesso existente ainda é válido.");
    return accessToken;
  }
  
  console.log("A obter um novo token de acesso...");
  const id_token = generateIdToken();

  if (!id_token || !CLIENT_ID) {
    // CORRIGIDO: Mensagem de erro mais explícita
    const errorMessage = "Credenciais da API não configuradas. Por favor, verifique o ficheiro .env e reinicie a aplicação.";
    console.error("Falha na comunicação com a API:", errorMessage);
    throw new Error(errorMessage);
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/s2s/v1.0/client/auth`, {
      client_id: CLIENT_ID,
      id_token: id_token,
    });

    accessToken = response.data.result.access_token as string;
    // A API não retorna a expiração, então definimos um prazo de validade (ex: 1 hora)
    accessTokenExpiration = Date.now() + 3600 * 1000; 
    console.log("Token de acesso obtido com sucesso!");
    return accessToken;
  } catch (error) {
    console.error("Erro no Passo 1 (Autenticação):", error);
    throw new Error(`Falha na autenticação: ${axios.isAxiosError(error) ? error.message : "Erro desconhecido"}`);
  }
};

// Passo 2: Obter o URL de upload
const getUploadUrl = async (token: string, imageFile: File): Promise<{ upload_url: string; file_id: string }> => {
  console.log("A obter URL de upload...");
  try {
    const response = await axios.post(`${API_BASE_URL}/s2s/v1.1/file/skin-analysis`, 
      {
        files: [
          {
            file_name: imageFile.name,
            file_size: imageFile.size,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { upload_url, file_id } = response.data.result.files[0];
    return { upload_url, file_id };

  } catch (error) {
    console.error("Erro no Passo 2 (Obter URL de Upload):", error);
    throw new Error(`Falha ao obter URL de upload: ${axios.isAxiosError(error) ? error.message : "Erro desconhecido"}`);
  }
};

// Passo 3: Fazer o upload da imagem
const uploadImage = async (uploadUrl: string, imageFile: File): Promise<void> => {
  console.log("A fazer upload da imagem...");
  try {
    // Usamos o cabeçalho 'image/jpeg' ou o tipo real da imagem
    await axios.put(uploadUrl, imageFile, {
      headers: {
        'Content-Type': imageFile.type,
      },
    });
    console.log("Upload da imagem concluído com sucesso!");
  } catch (error) {
    console.error("Erro no Passo 3 (Upload da Imagem):", error);
    throw new Error(`Falha no upload da imagem: ${axios.isAxiosError(error) ? error.message : "Erro desconhecido"}`);
  }
};

// Passo 4: Iniciar a tarefa de análise
const startAnalysisTask = async (token: string, fileId: string): Promise<string> => {
  console.log("A iniciar a tarefa de análise...");
  try {
    const response = await axios.post(`${API_BASE_URL}/s2s/v1.0/task/skin-analysis`, 
      {
        request_id: Math.floor(Math.random() * 1000000), // Usar um ID de requisição aleatório
        payload: {
          file_sets: {
            image: { file_id: fileId },
          },
          // Exemplo de 4 ações. Pode-se alterar para 7 ou 14.
          actions: ['wrinkles', 'spots', 'redness', 'dark_circles'],
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.result.task_id as string;
  } catch (error) {
    console.error("Erro no Passo 4 (Iniciar a Tarefa de Análise):", error);
    throw new Error(`Falha ao iniciar a tarefa de análise: ${axios.isAxiosError(error) ? error.message : "Erro desconhecido"}`);
  }
};

// Passo 5: Verificar o status da tarefa
const pollTaskStatus = async (token: string, taskId: string): Promise<any> => {
  console.log("A verificar o status da tarefa...");
  const maxAttempts = 30; // Tentar por no máximo 30 segundos
  const interval = 1000; // 1 segundo entre tentativas

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

// Função principal que orquestra todo o processo
export const analyzeImage = async (imageFile: File): Promise<any> => {
  console.log("Iniciando o processo de análise de imagem...");
  
  if (!imageFile) {
    throw new Error("Nenhum ficheiro de imagem fornecido para a análise.");
  }

  try {
    // Orquestra a sequência de passos
    const token = await authenticate();
    if (!token) throw new Error("Falha na autenticação. Impossível continuar.");

    const { upload_url, file_id } = await getUploadUrl(token, imageFile);
    await uploadImage(upload_url, imageFile);
    const taskId = await startAnalysisTask(token, file_id);
    const analysisResults = await pollTaskStatus(token, taskId);

    console.log("Análise concluída com sucesso! Resultados:", analysisResults);
    return analysisResults;
  } catch (error) {
    console.error("Falha completa no processo de análise:", error);
    throw error;
  }
};
