import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { analyzeImage } from '../services/analysisService';
import { useImage } from '../context/ImageContext';
import { useAnalyses } from '../context/AnalysisContext'; // Adicionado: importação do hook useAnalyses
import { FaSpinner } from 'react-icons/fa';

// Ícone de spinner em SVG para evitar erros de compilação
const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// Função para converter uma URL de dados (base64) para um objeto File
const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

export const AnalysisCapturePage: React.FC = () => {
    const navigate = useNavigate();
    const { addAnalysis } = useAnalyses();
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!capturedImage) {
            setError("Nenhuma imagem capturada para análise.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Converte a imagem capturada (string base64) para um objeto File
            const imageFile = dataURLtoFile(capturedImage, 'analysis_photo.jpeg');

            // Chama o nosso novo serviço de análise
            const analysisResult = await analyzeImage(imageFile);
            
            // Simulação de salvar no contexto
            addAnalysis({
                id: `analise_${new Date().getTime()}`,
                patientId: 'paciente_id_placeholder', // ID do paciente precisa ser passado para esta página
                imageUrl: capturedImage,
                createdAt: new Date().toISOString(),
                data: analysisResult,
            });

            console.log("Resultado do processo de análise:", analysisResult);
            // Navega para a página de detalhes da análise
            navigate('/analysis-detail', { state: { result: analysisResult } });
        } catch (err) {
            setError(`Falha ao analisar a imagem: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImage(imageSrc);
        }
    }, [webcamRef]);

    const retake = () => {
        setCapturedImage(null);
    };

    if (error) {
        return (
            <div className="p-8 text-center text-gray-500">
                <h2 className="text-xl font-bold mb-4 text-red-500">Ocorreu um erro!</h2>
                <p>{error}</p>
                <button onClick={retake} className="mt-4 inline-block px-6 py-3 bg-[#00C4B4] text-white rounded-lg font-semibold">
                    Tentar Novamente
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: 'user' }}
                className="absolute inset-0 w-full h-full object-cover"
            />
            {capturedImage && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
                    <img src={capturedImage} alt="Captured for analysis" className="max-w-full max-h-96 rounded-lg mb-4" />
                    <div className="flex space-x-4">
                        <button onClick={retake} className="px-6 py-3 bg-gray-600 rounded-lg font-bold text-white">Tirar Nova</button>
                        <button onClick={handleAnalyze} disabled={isLoading} className={`px-6 py-3 rounded-lg font-bold text-white ${isLoading ? 'bg-gray-400' : 'bg-[#00C4B4]'}`}>
                            {isLoading ? <SpinnerIcon /> : 'Analisar'}
                        </button>
                    </div>
                </div>
            )}
            <div className="absolute bottom-10">
                {!capturedImage && (
                    <button onClick={capture} className="w-20 h-20 bg-[#00C4B4] rounded-full flex items-center justify-center text-white shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.22c0 4.6-3.73 8.38-8.33 8.38-4.6 0-8.33-3.78-8.33-8.38s3.73-8.38 8.33-8.38c4.6 0 8.33 3.78 8.33 8.38z"/><path d="M2 12h3m14 0h3"/><path d="m19.07 4.93-2.12 2.12M7.05 16.95l-2.12 2.12m14.14 0-2.12-2.12M7.05 7.05 4.93 4.93"/></svg>
                    </button>
                )}
            </div>
        </div>
    );
};
