import React from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext'; // Importar o nosso hook de pacientes

// Componente para os cartões de ação principais
const ActionButton = ({ to, icon, label }: { to: string, icon: string, label: string }) => (
    <Link to={to} className="flex flex-col items-center space-y-2 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
            <span className="text-4xl">{icon}</span>
        </div>
        <span className="font-semibold text-gray-700">{label}</span>
    </Link>
);

// Componente para os cartões de informação
const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <Link to="/patients" className="text-sm font-semibold text-[#00C4B4] hover:underline">Ver todos</Link>
        </div>
        <div>
            {children}
        </div>
    </div>
);

export const DashboardPage: React.FC = () => {
    const { patients } = usePatients(); // Usar o hook para aceder à lista de pacientes
    
    // Encontrar o paciente mais recente (o último da lista)
    const recentPatient = patients.length > 0 ? patients[patients.length - 1] : null;

    const currentDate = new Date().toLocaleDateString('pt-PT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            {/* Cabeçalho de Saudação */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Olá, Dr.</h1>
                    <p className="text-gray-500 capitalize">{currentDate}</p>
                </div>
                <img
                    src="https://placehold.co/60x60/E8F5F4/1A3C5E?text=G"
                    alt="Foto do perfil"
                    className="w-14 h-14 rounded-full border-2 border-[#00C4B4]"
                />
            </header>

            {/* Botões de Ação Rápida */}
            <section className="grid grid-cols-3 gap-4 mb-10">
                <ActionButton to="/camera" icon="📷" label="Nova Análise" />
                <ActionButton to="/patients" icon="👥" label="Pacientes" />
                <ActionButton to="#" icon="🗓️" label="Agenda" />
            </section>

            {/* Cartões de Informação */}
            <section className="space-y-6">
                <InfoCard title="Consultas de Hoje">
                    <p className="text-gray-400 text-center py-4">Nenhuma consulta para hoje</p>
                </InfoCard>
                <InfoCard title="Pacientes Recentes">
                    {recentPatient ? (
                        <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50">
                            <img 
                                src={`https://placehold.co/40x40/E8F5F4/1A3C5E?text=${recentPatient.name.charAt(0)}`}
                                alt="Foto do Paciente" 
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-bold text-gray-800">{recentPatient.name}</p>
                                <p className="text-sm text-gray-500">
                                    Adicionado em: {new Date(recentPatient.createdAt).toLocaleDateString('pt-PT')}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-center py-4">Nenhum paciente recente</p>
                    )}
                </InfoCard>
            </section>
        </div>
    );
};
