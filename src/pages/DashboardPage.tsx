import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';

// Componente para os cartões de ação principais
const ActionButton = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
    <Link to={to} className="flex flex-col items-center space-y-2 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors text-[#00B5A5]">
            <div className="w-12 h-12">
                {icon}
            </div>
        </div>
        <span className="font-semibold text-gray-700">{label}</span>
    </Link>
);

// Componente para os cartões de informação
const InfoCard = ({ title, children, onSearchChange }: { title: string, children: React.ReactNode, onSearchChange?: (term: string) => void }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {onSearchChange ? (
                 <input 
                    type="text"
                    placeholder="Procurar..."
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-1/2 px-3 py-1.5 border border-gray-300 rounded-full text-sm focus:ring-[#00C4B4] focus:border-[#00C4B4]"
                />
            ) : (
                <Link to="/patients" className="text-sm font-semibold text-[#00C4B4] hover:underline">Ver todos</Link>
            )}
        </div>
        <div>
            {children}
        </div>
    </div>
);

export const DashboardPage: React.FC = () => {
    const { patients } = usePatients();
    const [searchTerm, setSearchTerm] = useState('');

    // Inverte a lista para mostrar os mais recentes primeiro e depois filtra pela pesquisa
    const filteredPatients = patients
        .slice()
        .reverse()
        .filter(patient => 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const currentDate = new Date().toLocaleDateString('pt-PT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const icons = {
        analysis: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>,
        patients: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
        agenda: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
    };

    return (
        <div className="p-6 bg-gray-50 min-h-full">
            <div className="mb-6">
                <img
                    src="/Logo Medanalis.png" // Caminho corrigido para o ficheiro local
                    alt="Logo Medanalis"
                    className="h-7 w-auto" 
                />
            </div>

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

            <section className="grid grid-cols-3 gap-4 mb-10">
                <ActionButton to="/camera" icon={icons.analysis} label="Nova Análise" />
                <ActionButton to="/patients" icon={icons.patients} label="Pacientes" />
                <ActionButton to="#" icon={icons.agenda} label="Agenda" />
            </section>

            <section className="space-y-6">
                <InfoCard title="Consultas de Hoje">
                    <p className="text-gray-400 text-center py-4">Nenhuma consulta para hoje</p>
                </InfoCard>
                <InfoCard title="Pacientes" onSearchChange={setSearchTerm}>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map(patient => (
                                <Link to={`/patient/${patient.id}`} key={patient.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50">
                                    <img 
                                        src={`https://placehold.co/40x40/E8F5F4/1A3C5E?text=${patient.name.charAt(0)}`}
                                        alt="Foto do Paciente" 
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-800">{patient.name}</p>
                                        <p className="text-sm text-gray-500">
                                            Adicionado em: {new Date(patient.createdAt).toLocaleDateString('pt-PT')}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-4">Nenhum paciente encontrado</p>
                        )}
                    </div>
                </InfoCard>
            </section>
        </div>
    );
};
