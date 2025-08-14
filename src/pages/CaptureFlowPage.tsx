import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios'; // 1. Importamos o axios
import { useImage } from '../context/ImageContext';

export const CaptureFlowPage: React.FC = () => {
    const navigate = useNavigate();
    const { setImageData } = useImage();
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    // --- NOVO: Estados para controlar o carregamento e erros ---
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
            setError(null); // Limpa erros antigos ao tirar uma nova foto
        }
    }, [webcamRef]);

    // --- 2. Modificamos a função de confirmação ---
    const handleConfirm = async () => {
        if (!capturedImage) return;

        setIsLoading(true); // Ativa o estado de "a carregar"
        setError(null);

        try {
            // --- AQUI ACONTECE A CHAMADA À API ---
            // Enviamos a imagem capturada (em formato base64) para a nossa API.
            console.log('A enviar imagem para análise...');
            const response = await axios.post('/api/analyze-skin', {
                imageData: capturedImage,
            });

            console.log('Análise recebida da API:', response.data);

            // Guardamos a imagem e o resultado da análise para usar noutras páginas
            setImageData(capturedImage);
            // TODO: Guardar `response.data` num contexto de análise

            // Navega para a próxima página após o sucesso
            navigate('/associate-patient');

        } catch (err: any) {
            console.error("Erro ao realizar a análise:", err);
            setError(err.response?.data?.error || 'Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setIsLoading(false); // Desativa o estado de "a carregar"
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    {capturedImage ? 'Verifique a Foto' : 'Captura Facial'}
                </h1>

                <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                    {/* ... (o código da webcam e da imagem continua igual) ... */}
                    {capturedImage ? (
                        <img src={capturedImage} alt="Foto Capturada" className="w-full h-full object-cover" />
                    ) : (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover"
                            videoConstraints={{ facingMode: "user" }}
                        />
                    )}
                </div>
                
                {/* --- NOVO: Mostra a mensagem de erro se existir --- */}
                {error && (
                    <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {/* --- 3. Os botões agora reagem ao estado de carregamento --- */}
                {capturedImage ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            onClick={handleConfirm} 
                            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                            disabled={isLoading} // O botão é desativado enquanto carrega
                        >
                            {isLoading ? 'A Analisar...' : 'Confirmar e Continuar'}
                        </button>
                        <button 
                            onClick={handleRetake} 
                            className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            disabled={isLoading}
                        >
                            Tirar Outra
                        </button>
                    </div>
                ) : (
                    <button onClick={capture} className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        Capturar Foto
                    </button>
                )}
            </div>
        </div>
    );
};
