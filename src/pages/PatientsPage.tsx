import React, { useState, useMemo } from 'react';
import { PatientForm } from '../components/Patient/PatientForm';
import { PatientList } from '../components/Patient/PatientList';
import { usePatients } from '../context/PatientContext';

export const PatientsPage: React.FC = () => {
    const { patients } = usePatients();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = useMemo(() => {
        // Primeiro, filtra apenas os pacientes ATIVOS
        let activePatients = patients.filter(patient => patient.isActive);

        // Depois, aplica o filtro de pesquisa
        if (searchTerm) {
            activePatients = activePatients.filter(patient =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Ordena os pacientes do mais recente para o mais antigo
        return activePatients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [patients, searchTerm]);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Gestão de Pacientes</h2>

            {/* Campo de pesquisa */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Pesquisar paciente por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00C4B4] focus:border-[#00C4B4] text-gray-700"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Formulário de Adicionar Paciente - Este será removido daqui no próximo passo, mas mantemos por enquanto */}
                <div>
                    <PatientForm />
                </div>
                {/* Lista de Pacientes Filtrada */}
                <div>
                    {/* Passamos a lista filtrada para o PatientList */}
                    <PatientList patientsToDisplay={filteredPatients} />
                </div>
            </div>
        </div>
    );
};