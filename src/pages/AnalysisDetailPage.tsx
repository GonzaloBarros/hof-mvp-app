import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnalyses } from '../context/AnalysisContext';

export const AnalysisDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { analyses } = useAnalyses();

    const analysis = analyses.find(a => a.id === id);

    if (!analysis) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-600">Análise não encontrada</h2>
                <Link to="/patients" className="text-[#00C4B4] hover:underline mt-4 inline-block">
                    Voltar para a lista de pacientes
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Detalhes da Análise de {new Date(analysis.createdAt).toLocaleDateString('pt-PT')}
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                        <img src={analysis.image} alt="Imagem da análise" className="w-full h-auto" />
                        <div className="p-4 border-t border-gray-200">
                            <h3 className="font-bold text-lg text-gray-800">Imagem Analisada</h3>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-2/3 space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-3">Resumo da Pele</h3>
                        <div className="space-y-4 text-gray-700">
                            <div className="flex justify-between items-center"><span className="font-medium">Tipo de Pele:</span><span className="font-bold text-lg text-[#00B5A5] capitalize">{analysis.skinType.type}</span></div>
                            <div className="flex justify-between items-center"><span className="font-medium">Tom da Pele:</span><span className="font-bold text-lg text-[#00B5A5]">{analysis.skinTone.value}</span></div>
                            <div className="flex justify-between items-center"><span className="font-medium">Idade Aparente:</span><span className="font-bold text-lg text-[#00B5A5]">{analysis.skinAge.apparentAge} anos</span></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-3">Análise de Problemas (Severidade 0-10)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center pt-4">
                            <div className="flex flex-col items-center"><h4 className="font-medium text-gray-600 mb-1">Rugas</h4><p className="font-bold text-4xl text-gray-800">{analysis.skinProblems.wrinkles.severity}</p><p className="text-xs text-gray-400 mt-1">({analysis.skinProblems.wrinkles.areas.join(', ')})</p></div>
                            <div className="flex flex-col items-center"><h4 className="font-medium text-gray-600 mb-1">Manchas</h4><p className="font-bold text-4xl text-gray-800">{analysis.skinProblems.darkSpots.severity}</p><p className="text-xs text-gray-400 mt-1">({analysis.skinProblems.darkSpots.areas.join(', ')})</p></div>
                            <div className="flex flex-col items-center"><h4 className="font-medium text-gray-600 mb-1">Poros</h4><p className="font-bold text-4xl text-gray-800">{analysis.skinProblems.pores.severity}</p><p className="text-xs text-gray-400 mt-1">({analysis.skinProblems.pores.areas.join(', ')})</p></div>
                            <div className="flex flex-col items-center"><h4 className="font-medium text-gray-600 mb-1">Acne</h4><p className="font-bold text-4xl text-gray-800">{analysis.skinProblems.acne.severity}</p><p className="text-xs text-gray-400 mt-1">({analysis.skinProblems.acne.areas.join(', ')})</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
