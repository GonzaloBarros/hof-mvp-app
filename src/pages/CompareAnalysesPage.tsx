import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Analysis } from '../types/analysis';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generatePdf } from '../utils/reportGenerator'; // Importar a nossa "impressora" de PDF
import { useAuth } from '../context/AuthContext'; // Importar o hook de autenticação

// Componente para mostrar os detalhes de uma análise na comparação
const AnalysisDetailsCard = ({ analysis }: { analysis: Analysis | null }) => {
  if (!analysis) return <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">Selecione uma análise</div>;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h4 className="font-bold text-lg mb-2 text-center">{new Date(analysis.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span>Rugas:</span> <span className="font-semibold">{analysis.skinProblems.wrinkles.severity}</span></div>
        <div className="flex justify-between"><span>Manchas:</span> <span className="font-semibold">{analysis.skinProblems.darkSpots.severity}</span></div>
        <div className="flex justify-between"><span>Poros:</span> <span className="font-semibold">{analysis.skinProblems.pores.severity}</span></div>
        <div className="flex justify-between"><span>Acne:</span> <span className="font-semibold">{analysis.skinProblems.acne.severity}</span></div>
      </div>
    </div>
  );
};


export const CompareAnalysesPage: React.FC = () => {
  const { id: patientId } = useParams<{ id: string }>();
  const { patients } = usePatients();
  const { analyses } = useAnalyses();
  const { user } = useAuth(); // Usar o hook de autenticação para pegar o nome do doutor

  const patient = patients.find(p => p.id === patientId);
  const patientAnalyses = analyses.filter(a => a.patientId === patientId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const [beforeAnalysis, setBeforeAnalysis] = useState<Analysis | null>(null);
  const [afterAnalysis, setAfterAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    // Define as análises padrão: a primeira e a última
    if (patientAnalyses.length >= 2) {
      setBeforeAnalysis(patientAnalyses[0]);
      setAfterAnalysis(patientAnalyses[patientAnalyses.length - 1]);
    }
  }, [patientAnalyses]);
  

  // Prepara os dados para o gráfico
  const chartData = [
    { name: 'Rugas', Antes: beforeAnalysis?.skinProblems.wrinkles.severity, Depois: afterAnalysis?.skinProblems.wrinkles.severity },
    { name: 'Manchas', Antes: beforeAnalysis?.skinProblems.darkSpots.severity, Depois: afterAnalysis?.skinProblems.darkSpots.severity },
    { name: 'Poros', Antes: beforeAnalysis?.skinProblems.pores.severity, Depois: afterAnalysis?.skinProblems.pores.severity },
    { name: 'Acne', Antes: beforeAnalysis?.skinProblems.acne.severity, Depois: afterAnalysis?.skinProblems.acne.severity },
  ];

  if (!patient) {
    return (
      <div className="text-center p-8">
        Paciente não encontrado.
      </div>
    );
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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Botão de Voltar à Ficha do Paciente */}
      <div className="mb-6">
        <Link to={`/patient/${patientId}`} className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
          Voltar à Ficha do Paciente
        </Link>
      </div>

      {/* Botão de Gerar Relatório de Evolução (Visível no navegador, escondido na impressão) */}
      {/* Removido print:hidden do div pai e adicionado no-print ao botão para ser controlado por JS */}
      <div className="text-center mb-8"> 
        <button
          onClick={() => generatePdf('comparison-report', `relatorio-evolucao-${patient.name.replace(/\s/g, '-')}-${Date.now()}`, user?.name || 'Doutor', '/Logo Medanalis.png')}
          className="bg-[#00B5A5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1A3C5E] transition-colors no-print" // Adicionado no-print aqui
        >
          Gerar Relatório de Evolução
        </button>
      </div>

      <div id="comparison-report" className="bg-white rounded-xl shadow-lg p-8"> {/* Adicionamos o ID para o PDF */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Comparador Evolutivo</h1>
        <p className="text-center text-gray-500 mb-8">Compare a evolução de <span className="font-bold">{patient.name}</span> entre duas sessões.</p>

        {/* Comparador de Imagens (para o navegador) */}
        {/* Adicionamos um ID para controlar a visibilidade via JS para o PDF */}
        <div id="interactive-slider-container" className="rounded-lg overflow-hidden border-4 border-gray-200 mb-8 print:hidden"> {/* print:hidden para esconder no PDF */}
          {beforeAnalysis && afterAnalysis && (
            <ReactCompareSlider
              itemOne={<ReactCompareSliderImage src={beforeAnalysis.image} alt="Imagem Antes" />}
              itemTwo={<ReactCompareSliderImage src={afterAnalysis.image} alt="Imagem Depois" />}
              style={{ width: '100%', height: '50vh' }}
            />
          )}
        </div>

        {/* Imagens separadas para o PDF (e para visualização em impressão) */}
        {/* Usamos print:flex para mostrar apenas na impressão */}
        <div id="static-images-for-pdf-container" className="hidden print:flex justify-around items-center gap-4 mb-8">
          {beforeAnalysis && (
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-lg mb-2">Antes</h3>
              <img src={beforeAnalysis.image} alt="Imagem Antes" className="w-full max-w-xs h-auto border rounded-lg" />
            </div>
          )}
          {afterAnalysis && (
            <div className="flex flex-col items-center">
              <h3 className="font-bold text-lg mb-2">Depois</h3>
              <img src={afterAnalysis.image} alt="Imagem Depois" className="w-full max-w-xs h-auto border rounded-lg" />
            </div>
          )}
        </div>


        {/* Comparação de Dados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <AnalysisDetailsCard analysis={beforeAnalysis} />
          <AnalysisDetailsCard analysis={afterAnalysis} />
        </div>

        {/* GRÁFICO DE EVOLUÇÃO */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Gráfico de Evolução da Severidade</h2>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Antes" fill="#8884d8" name="Severidade Antes" />
                <Bar dataKey="Depois" fill="#00C4B4" name="Severidade Depois" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
