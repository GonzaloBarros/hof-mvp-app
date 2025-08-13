// server.js

// Importamos as bibliotecas necessárias para o nosso servidor.
// 'express' ajuda a criar o servidor web.
// 'axios' é para fazer requisições HTTP para a API da PerfectCorp.
// 'jsencrypt' é para a criptografia que a API exige.
import express from 'express';
import axios from 'axios';
import { JSEncrypt } from 'js-encrypt';

// Criamos uma aplicação do Express.
const app = express();
// Definimos a porta em que o nosso servidor irá rodar.
// A porta 3001 é uma escolha comum para servidores de desenvolvimento.
const PORT = process.env.PORT || 3001;

// Este é um "middleware". Ele diz para o Express que
// o servidor deve entender as requisições que vêm em formato JSON.
app.use(express.json());

// ATENÇÃO: SUBSTITUA COM SUAS CHAVES REAIS!
// A sua chave de API (client_id) e a sua chave secreta (client_secret).
const CLIENT_ID = 'Dpea5i5qQMeOJeHLDR6X3uFi2L97RYAU';

// A chave secreta (CLIENT_SECRET) deve ser formatada como uma chave pública RSA X.509.
// Se a sua chave for apenas uma string, você precisa adicionar os cabeçalhos.
// Você pode obter o valor da sua chave na plataforma da PerfectCorp e colá-lo aqui,
// substituindo a parte 'SUA_CHAVE_SECRETA_AQUI'.
const CLIENT_SECRET = `-----BEGIN PUBLIC KEY-----
SUA_CHAVE_SECRETA_AQUI
-----END PUBLIC KEY-----`;

// Criamos um endpoint (uma "porta de entrada") para o frontend.
// Quando o frontend faz uma requisição para `/api/get-access-token`,
// este código é executado.
app.post('/api/get-access-token', async (req, res) => {
    try {
        // Passo 1: Preparamos a mensagem para ser criptografada.
        // Ela precisa conter o client_id e o horário atual (timestamp).
        const timestamp = new Date().getTime();
        const payload = `client_id=${CLIENT_ID}&timestamp=${timestamp}`;
        
        // Passo 2: Criptografamos a mensagem.
        // Aqui usamos a biblioteca `JSEncrypt` para criptografar a mensagem
        // com a sua chave secreta, que agora está no formato correto.
        let encrypt = new JSEncrypt();
        encrypt.setPublicKey(CLIENT_SECRET);
        const id_token = encrypt.encrypt(payload);

        // Se a criptografia falhar por algum motivo, o servidor retorna um erro.
        if (!id_token) {
            return res.status(500).json({ error: 'Falha na criptografia do id_token. Verifique o formato da chave secreta.' });
        }

        // Passo 3: Enviamos a requisição para a API da PerfectCorp para obter o token final.
        const authResponse = await axios.post('https://yce-api-01.perfectcorp.com/s2s/v1.0/client/auth', {
            client_id: CLIENT_ID,
            id_token: id_token,
        });

        // Se tudo der certo, enviamos o token de acesso (access_token) de volta
        // para o seu aplicativo frontend.
        res.json({ accessToken: authResponse.data.result.access_token });
    } catch (error) {
        // Se algo der errado em qualquer um dos passos, capturamos o erro aqui.
        console.error('Erro ao obter o token de acesso:', error);
        res.status(500).json({ error: 'Erro ao autenticar com a PerfectCorp API.' });
    }
});

// Este comando inicia o servidor para que ele comece a "escutar" as requisições.
app.listen(PORT, () => {
    console.log(`Servidor de autenticação rodando em http://localhost:${PORT}`);
});
