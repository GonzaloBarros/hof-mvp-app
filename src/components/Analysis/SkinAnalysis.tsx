import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAnalyses } from '../../context/AnalysisContext';
import { useImage } from '../../context/ImageContext';
import { analyzeImage } from '../../services/analysisService';
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


export const SkinAnalysis: React.FC = () => {
    const { imageData } = useImage();
    const navigate = useNavigate();
    const { addAnalysis } = useAnalyses();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current && imageData) {
            isMounted.current = true;
            // A lógica de análise será movida para a nova página de fluxo.
            // Este componente servirá apenas para exibir o resultado.
        } else if (!imageData) {
            // Se não houver imagem, navega de volta para a câmara.
            navigate('/capture-flow');
        }
    }, [imageData, navigate]);

    // Lógica para simular a análise para fins de teste
    const handleSimulatedAnalyze = async () => {
        if (!imageData) {
            setError("Nenhuma imagem para análise.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Converte a imagem base64 para o formato File
            const imageFile = dataURLtoFile(imageData, `analise_${Date.now()}.jpeg`);
            
            // Chama o nosso serviço de análise real
            const analysisResult = await analyzeImage(imageFile);

            addAnalysis({
                id: `analise_${new Date().getTime()}`,
                patientId: 'paciente_id_placeholder',
                imageUrl: imageData,
                createdAt: new Date().toISOString(),
                data: analysisResult,
            });

            navigate('/analysis-detail', { state: { result: analysisResult } });
        } catch (err) {
            setError(`Falha na análise: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        } finally {
            setIsLoading(false);
        }
    };


    if (!imageData) {
        return <div className="text-center p-8 text-gray-500">A carregar...</div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Análise de Imagem</h2>
                <img src={imageData} alt="Imagem para análise" className="rounded-lg max-w-sm w-full shadow-md mb-4" />
                <button
                    onClick={handleSimulatedAnalyze}
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors ${
                        !isLoading ? 'bg-[#00C4B4] hover:bg-[#00B5A5]' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <SpinnerIcon /> A Analisar...
                        </>
                    ) : (
                        "Iniciar Análise"
                    )}
                </button>
                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};
