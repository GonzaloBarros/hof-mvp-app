import React from 'react';
import { PatientForm } from '../components/Patient/PatientForm'; // Importa o formulário existente
import { useNavigate } from 'react-router-dom'; // Para redirecionar

export const AddPatientPage: React.FC = () => {
    const navigate = useNavigate();

    // Você pode passar uma função de sucesso para o PatientForm se quiser redirecionar
    // ou apenas deixar o PatientForm lidar com o alerta e o reset
    const handleSuccess = () => {
        navigate('/patients'); // Redireciona para a lista de pacientes após adicionar
    };

    return (
        <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Cadastrar Novo Paciente</h2>
            {/* O formulário PatientForm será renderizado aqui */}
            <PatientForm onSuccess={handleSuccess} /> {/* Passa uma prop de sucesso, PatientForm precisa ser adaptado */}
        </div>
    );
};