import React, { useState } from 'react';
import { usePatients } from '../../context/PatientContext';

export const PatientForm: React.FC = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const { addPatient } = usePatients();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !age) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        addPatient({ name, age: parseInt(age, 10) });
        setName('');
        setAge('');
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Novo Paciente</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        id="patientName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                        placeholder="Nome do paciente"
                    />
                </div>
                <div>
                    <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">
                        Idade
                    </label>
                    <input
                        type="number"
                        id="patientAge"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                        placeholder="Idade do paciente"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B5A5]"
                >
                    Guardar Paciente
                </button>
            </form>
        </div>
    );
};
