import React from 'react';
import { Link } from 'react-router-dom';
import { Patient } from '../../types/patient'; // Importar o tipo Patient

// Modificamos a interface para receber 'patientsToDisplay' como prop
interface PatientListProps {
    patientsToDisplay: Patient[];
}

export const PatientList: React.FC<PatientListProps> = ({ patientsToDisplay }) => { // Recebe a prop
    // Usamos 'patientsToDisplay' diretamente em vez de usePatients()
    if (patientsToDisplay.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <p className="text-gray-500">Nenhum paciente encontrado com os filtros aplicados.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Lista de Pacientes</h3>

            <ul className="space-y-4">
                {patientsToDisplay.map((patient) => ( // Mapeia a prop
                    <Link to={`/patient/${patient.id}`} key={patient.id}>
                        <li
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-100 hover:border-[#00C4B4] transition-colors cursor-pointer"
                        >
                            {/* Foto do paciente */}
                            <img
                                src={patient.profilePic || `https://placehold.co/40x40/E8F5F4/1A3C5E?text=${patient.name.charAt(0)}`}
                                alt="Foto do Paciente"
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            <div>
                                <p className="font-semibold text-gray-900">{patient.name}</p>
                                <p className="text-sm text-gray-600">{patient.age} anos</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Adicionado em:</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(patient.createdAt).toLocaleDateString('pt-PT')}
                                </p>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};