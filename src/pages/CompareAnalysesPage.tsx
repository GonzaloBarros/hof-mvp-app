import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';
import { useAuth } from '../context/AuthContext';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Analysis } from '../types/analysis';
// A importação do ícone foi removida para o nosso teste.

export const CompareAnalysesPage: React.FC = () => {
    const { id: patientId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { patients } = usePatients();
    const { analyses } = useAnalyses();

    const patient = patients.find(p => p.id === patientId);
    const patientAnalyses = analyses.filter(a => a.patientId === patientId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const [beforeAnalysisId, setBeforeAnalysisId] = useState<string | undefined>();
    const [afterAnalysisId, setAfterAnalysisId] = useState<string | undefined>();

    useEffect(() => {
        if (patientAnalyses.length >= 2) {
            setBeforeAnalysisId(patientAnalyses[0].id);
            setAfterAnalysisId(patientAnalyses[patientAnalyses.length - 1].id);
        }
    }, [patientAnalyses]);
    
    const beforeAnalysis = useMemo(() => patientAnalyses.find(a => a.id === beforeAnalysisId), [patientAnalyses, beforeAnalysisId]);
    const afterAnalysis = useMemo(() => patientAnalyses.find(a => a.id === afterAnalysisId), [patientAnalyses, afterAnalysisId]);

    if (!patient) {
        return <div className="text-center p-8">Paciente não encontrado.</div>;
    }
    
    if (patientAnalyses.length < 2) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Comparação de Análises</h2>
                <p className="text-gray-600">Este paciente precisa de pelo menos duas análises para poder comparar a evolução.</p>
                <Link to={`/patient/${patientId}`} className="text-[#00C4B4] hover:underline mt-4 inline-block">
                    Voltar à ficha do paciente
                </Link>
            </div>
        );
    }

    if (!beforeAnalysis || !afterAnalysis) {
        return <div className="p-8 text-center text-gray-500">A carregar dados da comparação...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6 flex justify-between items-center">
                    <Link to={`/patient/${patientId}`} className="inline-flex items-center bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                        {/* SUBSTITUIÇÃO DO ÍCONE POR UM SVG DIRETO */}
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-2" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                        >
                            <path 
                            fillRule="evenodd" 
                            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                            clipRule="evenodd" 
                            />
                        </svg>
                        Voltar à Ficha
                    </Link>
                </div>
                
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Comparador Evolutivo</h1>
                    <p className="text-center text-gray-500 mb-8">Compare a evolução de <span className="font-bold">{patient.name}</span> entre duas sessões.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label htmlFor="before-select" className="block text-sm font-medium text-gray-700 mb-1">Análise de "Antes"</label>
                            <select
                                id="before-select"
                                value={beforeAnalysis?.id || ''}
                                onChange={(e) => setBeforeAnalysisId(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm rounded-md"
                            >
                                {patientAnalyses.map(analysis => (
                                    <option key={analysis.id} value={analysis.id}>
                                        {new Date(analysis.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="after-select" className="block text-sm font-medium text-gray-700 mb-1">Análise de "Depois"</label>
                            <select
                                id="after-select"
                                value={afterAnalysis?.id || ''}
                                onChange={(e) => setAfterAnalysisId(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm rounded-md"
                            >
                                {patientAnalyses.map(analysis => (
                                    <option key={analysis.id} value={analysis.id}>
                                        {new Date(analysis.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="rounded-lg overflow-hidden border-4 border-gray-200 mb-8">
                        <ReactCompareSlider
                            itemOne={<ReactCompareSliderImage src={beforeAnalysis.imageUrl} alt="Imagem Antes" />}
                            itemTwo={<ReactCompareSliderImage src={afterAnalysis.imageUrl} alt="Imagem Depois" />}
                            style={{ width: '100%', height: '50vh' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
