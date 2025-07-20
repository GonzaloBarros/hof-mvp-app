import React, { useState, useMemo } from 'react'; // Importar useMemo
import { PatientForm } from '../components/Patient/PatientForm';
import { PatientList } from '../components/Patient/PatientList';
import { usePatients } from '../context/PatientContext'; // Para acessar todos os pacientes

export const PatientsPage: React.FC = () => {
    const { patients } = usePatients();
    const [searchTerm, setSearchTerm] = useState('');
    // Poderíamos adicionar estados para outros filtros aqui, ex: const [ageFilter, setAgeFilter] = useState('');

    // Lógica de filtragem dos pacientes. Usamos useMemo para otimizar.
    const filteredPatients = useMemo(() => {
        let currentPatients = patients;

        // Filtro por termo de busca
        if (searchTerm) {
            currentPatients = currentPatients.filter(patient =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Exemplo: filtro por idade (apenas para ilustrar, não implementado ainda)
        // if (ageFilter) {
        //     currentPatients = currentPatients.filter(patient => patient.age === parseInt(ageFilter));
        // }

        // Ordena os pacientes do mais recente para o mais antigo (se não for feito no PatientContext)
        return currentPatients.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [patients, searchTerm]); // Recalcula apenas quando 'patients' ou 'searchTerm' mudam

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