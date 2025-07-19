import React from 'react';
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// É necessário registar os componentes do Chart.js que vamos usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Componente para os cartões de estatísticas
const StatCard: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

export const ReportsPage: React.FC = () => {
    const { patients } = usePatients();
    const { analyses } = useAnalyses();

    // Lógica para preparar os dados do gráfico
    const labels = [...Array(7)].map((_, i) => format(subDays(new Date(), i), 'dd/MM')).reverse();
    const patientCounts = labels.map(label => {
        const day = parseInt(label.split('/')[0], 10);
        return patients.filter(p => new Date(p.createdAt).getDate() === day).length;
    });

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Novos Pacientes',
                data: patientCounts,
                backgroundColor: 'rgba(0, 196, 180, 0.6)',
                borderColor: 'rgba(0, 196, 180, 1)',
                borderWidth: 1,
            },
        ],
    };
    
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Novos Pacientes nos Últimos 7 Dias',
            },
        },
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Secção de Resumo Rápido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard title="Total de Pacientes" value={patients.length} />
                <StatCard title="Total de Análises" value={analyses.length} />
            </div>

            {/* Secção do Gráfico */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <Bar options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};