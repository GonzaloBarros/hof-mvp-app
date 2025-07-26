import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'; // Para navegar para os detalhes do paciente
import Modal from 'react-modal'; // Importa a biblioteca de modais
import { PatientContext } from '../context/PatientContext'; // Importa o contexto de pacientes

// Define o estilo do modal para que ele apareça corretamente
const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '90%', // Largura responsiva
        maxWidth: '500px', // Largura máxima
        maxHeight: '80vh', // Altura máxima
        overflowY: 'auto', // Adiciona scroll se o conteúdo for muito grande
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};

// Define o elemento raiz para o modal (importante para acessibilidade)
Modal.setAppElement('#root'); // Certifique-se de que o ID do seu elemento raiz é 'root'

export const PatientsPage: React.FC = () => {
    // Acessa o contexto de pacientes para obter a lista e a função de adicionar
    const patientContext = useContext(PatientContext);

    // Verifica se o contexto está disponível
    if (!patientContext) {
        return <div className="text-center text-red-500 mt-8">Erro: Contexto de Pacientes não disponível.</div>;
    }

    const { patients, addPatient } = patientContext;

    // Estado para controlar a abertura/fecho do modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // Estado para armazenar os dados do novo paciente
    const [newPatientData, setNewPatientData] = useState({
        name: '',
        age: '',
        gender: '',
        mainComplaint: '',
        healthHistory: '',
        // Adicione outros campos que você precisar para o paciente
    });

    // Função para abrir o modal
    const openModal = () => {
        setModalIsOpen(true);
    };

    // Função para fechar o modal e resetar os dados do formulário
    const closeModal = () => {
        setModalIsOpen(false);
        setNewPatientData({
            name: '',
            age: '',
            gender: '',
            mainComplaint: '',
            healthHistory: '',
        });
    };

    // Função para lidar com a mudança nos campos do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPatientData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página
        
        // Verifica se o nome do paciente não está vazio
        if (newPatientData.name.trim() === '') {
            alert('Por favor, insira o nome do paciente.'); // Use um modal personalizado em vez de alert em produção
            return;
        }

        // Cria um ID simples para o novo paciente (em um app real, o banco de dados geraria isso)
        const newPatient = {
            id: `patient-${Date.now()}`, // ID único baseado no tempo
            name: newPatientData.name,
            age: parseInt(newPatientData.age), // Converte idade para número
            gender: newPatientData.gender,
            mainComplaint: newPatientData.mainComplaint,
            healthHistory: newPatientData.healthHistory,
            notes: '', // Anotações iniciais vazias
            treatmentPlans: [], // Lista vazia de planos de tratamento
            consentHistory: [], // Lista vazia de histórico de consentimentos
            analysisHistory: [], // Lista vazia de histórico de análises
        };

        // Chama a função addPatient do contexto
        addPatient(newPatient);
        closeModal(); // Fecha o modal após adicionar o paciente
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Pacientes</h1>

            {/* Botão para Adicionar Novo Paciente */}
            <button
                onClick={openModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                + Adicionar Novo Paciente
            </button>

            {/* Lista de Pacientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.length === 0 ? (
                    <p className="text-gray-600 col-span-full text-center mt-4">Nenhum paciente encontrado. Clique em "Adicionar Novo Paciente" para começar!</p>
                ) : (
                    patients.map(patient => (
                        <Link to={`/patient/${patient.id}`} key={patient.id} className="block">
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer border border-gray-200 hover:border-blue-300">
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{patient.name}</h2>
                                <p className="text-gray-600">Idade: {patient.age || 'N/A'}</p>
                                <p className="text-gray-600">Sexo: {patient.gender || 'N/A'}</p>
                                <p className="text-gray-600 mt-2 text-sm">Queixa Principal: {patient.mainComplaint || 'N/A'}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>

            {/* Modal para Adicionar Paciente */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customModalStyles}
                contentLabel="Adicionar Novo Paciente"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Adicionar Novo Paciente</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">Nome Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={newPatientData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-gray-700 text-sm font-medium mb-1">Idade</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={newPatientData.age}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-gray-700 text-sm font-medium mb-1">Sexo</label>
                        <select
                            id="gender"
                            name="gender"
                            value={newPatientData.gender}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Selecione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="mainComplaint" className="block text-gray-700 text-sm font-medium mb-1">Queixa Principal</label>
                        <textarea
                            id="mainComplaint"
                            name="mainComplaint"
                            value={newPatientData.mainComplaint}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="healthHistory" className="block text-gray-700 text-sm font-medium mb-1">Histórico de Saúde / Observações</label>
                        <textarea
                            id="healthHistory"
                            name="healthHistory"
                            value={newPatientData.healthHistory}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Salvar Paciente
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
