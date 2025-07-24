import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useImage } from '../../context/ImageContext';
import { usePatients } from '../../context/PatientContext';
import { useAnalyses } from '../../context/AnalysisContext';
import { SkinAnalyzerService, SkinAnalysisResponse } from '../../services/skinAnalyzer';
import { generatePdf } from '../../utils/reportGenerator'; // Importar a nossa "impressora"

export const SkinAnalysis: React.FC = () => {
    const { capturedImage } = useImage();
    const { patients, updatePatientProfilePic } = usePatients();
    const { addAnalysis } = useAnalyses();
    const navigate = useNavigate();

    const [analysisResult, setAnalysisResult] = useState<SkinAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');

    useEffect(() => {
        if (patients.length > 0) {
            setSelectedPatientId(patients[0].id);
        }
    }, [patients]);

    useEffect(() => {
        const analyze = async () => {
            if (capturedImage) {
                setLoading(true);
                setError(null);
                const analyzer = new SkinAnalyzerService();
                try {
                    const result = await analyzer.analyzeSkin(capturedImage);
                    setAnalysisResult(result);
                } catch (err) {
                    setError('Ocorreu um erro ao analisar a imagem.');
                    console.error('Analysis error:', err);
                } finally {
                    setLoading(false);
                }
            }
        };
        analyze();
    }, [capturedImage]);

    const handleSaveAnalysis = () => {
        if (!selectedPatientId) {
            alert('Por favor, selecione um paciente.');
            return;
        }
        if (analysisResult && capturedImage) {
            const patient = patients.find(p => p.id === selectedPatientId);
            addAnalysis(analysisResult, selectedPatientId, capturedImage);

            if (patient && !patient.profilePic) {
                updatePatientProfilePic(patient.id, capturedImage);
            }

            alert('Análise guardada com sucesso!');
            navigate(`/patient/${selectedPatientId}`);
        }
    };

    if (!capturedImage) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Nenhuma imagem para analisar</h2>
                <p className="text-gray-600 mb-6">Por favor, volte à página de captura para tirar uma foto primeiro.</p>
                <Link to="/camera" className="bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors">
                    Ir para Captura
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C4B4]"></div>
                <p className="mt-4 text-gray-600 text-lg">Analisando pele, por favor aguarde...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Div que envolve tudo o que será impresso, incluindo o botão que será ocultado */}
            <div id="analysis-report">
                {/* Botão de Gerar PDF */}
                <div className="text-center mb-8 no-print">
                    <button
                        onClick={() => generatePdf('analysis-report', 'relatorio-analise-facial')}
                        className="bg-[#00B5A5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1A3C5E] transition-colors"
                    >
                        Gerar Relatório PDF
                    </button>
                </div>

                {/* Conteúdo do Relatório */}
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Análise Facial Completa</h2>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                            <img src={capturedImage} alt="Imagem analisada" className="w-full h-auto" />
                            <div className="p-4 border-t border-gray-200"><h3 className="font-bold text-lg text-gray-800">Imagem Analisada</h3></div>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/3 space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-3">Resumo da Pele</h3>
                            <div className="space-y-4 text-gray-700">
                                <div className="flex justify-between items-center"><span className="font-medium">Tipo de Pele:</span><span className="font-bold text-lg text-[#00B5A5] capitalize">{analysisResult?.skinType.type}</span></div>
                                <div className="flex justify-between items-center"><span className="font-medium">Tom da Pele:</span><span className="font-bold text-lg text-[#00B5A5]">{analysisResult?.skinTone.value}</span></div>
                                <div className="flex justify-between items-center"><span className="font-medium">Idade Aparente:</span><span className="font-bold text-lg text-[#00B5A5]">{analysisResult?.skinAge.apparentAge} anos</span></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-3">Análise de Problemas (Severidade 0-10)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center pt-4">
                                <div className="flex flex-col items-center"><h4 className="font-medium text-gray-600 mb-1">Rugas</h4><p className="font-bold text-4xl text-gray-800">{analysisResult?.skinProblems.wrinkles.severity}</p><p className="text-xs text-gray-400 mt-1">({analysisResult?.skinProblems.wrinkles.areas.join(', ')})</p></div>
                                <div className="flex flex-col items-center"><h4 className="font-medium text-gray-600 mb-1">Manchas</h4><p className="font-bold text-4xl text-gray-800">{analysisResult?.skinProblems.darkSpots.severity}</p><p className="text-xs text-gray-400 mt-1">({analysisResult?.skinProblems.darkSpots.areas.join(', ')})</p></div>
                                <div className="flex flex-col items-center"><h4 className="font-medium text-gray-600 mb-1">Poros</h4><p className="font-bold text-4xl text-gray-800">{analysisResult?.skinProblems.pores.severity}</p><p className="text-xs text-gray-400 mt-1">({analysisResult?.skinProblems.pores.areas.join(', ')})</p></div>
                                <div className="flex flex-col items-center"><h4 className="font-medium text-gray-600 mb-1">Acne</h4><p className="font-bold text-4xl text-gray-800">{analysisResult?.skinProblems.acne.severity}</p><p className="text-xs text-gray-400 mt-1">({analysisResult?.skinProblems.acne.areas.join(', ')})</p></div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 no-print">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Guardar Análise no Processo</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700">Associar a Paciente:</label>
                                    <select
                                        id="patient-select"
                                        value={selectedPatientId}
                                        onChange={(e) => setSelectedPatientId(e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm rounded-md"
                                    >
                                        {patients.map(patient => (
                                            <option key={patient.id} value={patient.id}>
                                                {patient.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={handleSaveAnalysis}
                                    className="w-full bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors"
                                >
                                    Guardar Análise
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
