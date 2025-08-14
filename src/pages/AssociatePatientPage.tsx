import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';
import { useImage } from '../context/ImageContext';
import { analyzeImage } from '../services/analysisService';
import { Link } from 'react-router-dom';

// Ícone de spinner em SVG para evitar erros de compilação
const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const AssociatePatientPage: React.FC = () => {
    const navigate = useNavigate();
    const { imageData: imageDataUrl } = useImage();
    const { patients } = usePatients();
    const { addAnalysis } = useAnalyses();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filteredPatients = useMemo(() => {
        return patients.filter(patient =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [patients, searchTerm]);

    const handleAnalyze = async () => {
        if (!selectedPatientId || !imageDataUrl) {
            setError("Por favor, selecione um paciente e certifique-se de que há uma imagem.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // --- AQUI ESTÁ A CORREÇÃO ---
            // A nossa função `analyzeImage` agora espera o `imageDataUrl` (string) diretamente.
            // Removemos a conversão de volta para um ficheiro.
            const analysisResult = await analyzeImage(imageDataUrl);

            addAnalysis({
                id: `analise_${new Date().getTime()}`,
                patientId: selectedPatientId,
                imageUrl: imageDataUrl,
                createdAt: new Date().toISOString(),
                data: analysisResult,
            });
            
            // Navega para a página de detalhes da análise
            // Usamos o ID da análise para que a página de detalhes possa encontrá-la no contexto
            navigate(`/analysis-detail/${`analise_${new Date().getTime()}`}`);

        } catch (err) {
            setError(`Falha ao analisar a imagem: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!imageDataUrl) {
        return (
            <div className="p-8 text-center text-gray-500">
                <h2 className="text-xl font-bold mb-4">Erro: Imagem não encontrada</h2>
                <p>Por favor, volte e capture uma imagem para a análise.</p>
                <Link to="/capture-flow" className="mt-4 inline-block px-6 py-3 bg-[#00C4B4] text-white rounded-lg font-semibold">
                    Voltar para a câmara
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Associar Análise a um Paciente</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col items-center">
                <img src={imageDataUrl} alt="Imagem capturada para análise" className="rounded-lg max-w-sm w-full shadow-md mb-4" />
                <div className="text-center">
                    <p className="text-gray-600 mb-2">Imagem capturada com sucesso!</p>
                    <p className="text-sm text-gray-500">Agora, selecione o paciente para esta análise.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Selecione um Paciente</h3>
                <input
                    type="text"
                    placeholder="Pesquisar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring-[#00C4B4] focus:border-[#00C4B4]"
                />
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map(patient => (
                            <li
                                key={patient.id}
                                className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center space-x-3 ${
                                    selectedPatientId === patient.id ? 'bg-[#E8F5F4] text-[#00C4B4] font-semibold' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                                onClick={() => setSelectedPatientId(patient.id)}
                            >
                                <img
                                    src={patient.profilePic || `https://placehold.co/40x40/E8F5F4/1A3C5E?text=${patient.name.charAt(0)}`}
                                    alt="Foto do Paciente"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span>{patient.name}</span>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">Nenhum paciente encontrado.</p>
                    )}
                </ul>
            </div>
            
            <div className="flex justify-between items-center mt-6">
                <Link to="/patients/new" className="text-[#00C4B4] font-semibold hover:underline">
                    + Adicionar Novo Paciente
                </Link>
                <button
                    onClick={handleAnalyze}
                    disabled={!selectedPatientId || isLoading}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors ${
                        selectedPatientId && !isLoading ? 'bg-[#00C4B4] hover:bg-[#00B5A5]' : 'bg-gray-400 cursor-not-allowed'
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
            </div>
            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}
            </div>
        );
    };
