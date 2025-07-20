import React, { useState } from 'react';
import { usePatients } from '../../context/PatientContext';

interface PatientFormProps {
    onSuccess?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [mainComplaint, setMainComplaint] = useState('');
    const [healthHistory, setHealthHistory] = useState('');

    const { addPatient } = usePatients();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !birthDate || !phone || !email || !mainComplaint) {
            alert('Por favor, preencha todos os campos obrigatórios: Nome, Data de Nascimento, Telefone, Email e Queixa Principal.');
            return;
        }

        // Calcular a idade a partir da data de nascimento, se a idade não for preenchida
        let calculatedAge = parseInt(age, 10);
        if (!calculatedAge && birthDate) {
            const today = new Date();
            const birth = new Date(birthDate);
            let tempAge = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                tempAge--;
            }
            calculatedAge = tempAge;
        } else if (!calculatedAge) {
            calculatedAge = 0; // Garante que é um número, mesmo que não seja calculado
        }


        addPatient({
            name,
            age: calculatedAge, // Usar a idade calculada ou a digitada
            birthDate,
            phone,
            email,
            mainComplaint,
            healthHistory,
        });

        setName('');
        setAge('');
        setBirthDate('');
        setPhone('');
        setEmail('');
        setMainComplaint('');
        setHealthHistory('');

        alert('Paciente adicionado com sucesso!');
        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Novo Paciente</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input
                        type="text"
                        id="patientName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                        placeholder="Nome do paciente"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                    <input
                        type="date"
                        id="birthDate"
                        value={birthDate}
                        onChange={(e) => {
                            setBirthDate(e.target.value);
                            // Tenta calcular a idade automaticamente ao selecionar a data de nascimento
                            if (e.target.value) {
                                const today = new Date();
                                const birth = new Date(e.target.value);
                                let calculatedAge = today.getFullYear() - birth.getFullYear();
                                const m = today.getMonth() - birth.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                                    calculatedAge--;
                                }
                                setAge(calculatedAge.toString());
                            } else {
                                setAge('');
                            }
                        }}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                        placeholder="(XX) XXXXX-XXXX"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                        placeholder="email@exemplo.com"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700">Idade (Calculada automaticamente)</label>
                    <input
                        type="number"
                        id="patientAge"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm bg-gray-100"
                        placeholder="Idade"
                        disabled // Desabilita para indicar que é calculado
                    />
                </div>
                <div>
                    <label htmlFor="mainComplaint" className="block text-sm font-medium text-gray-700">Queixa Principal (do paciente)</label>
                    <textarea
                        id="mainComplaint"
                        value={mainComplaint}
                        onChange={(e) => setMainComplaint(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                        placeholder="Ex: Rugas na testa, melhora do contorno labial, manchas na pele..."
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="healthHistory" className="block text-sm font-medium text-gray-700">Histórico de Saúde / Observações</label>
                    <textarea
                        id="healthHistory"
                        value={healthHistory}
                        onChange={(e) => setHealthHistory(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                        placeholder="Ex: Alergias, doenças preexistentes, medicamentos, tratamentos anteriores..."
                    ></textarea>
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