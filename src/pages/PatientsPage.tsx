import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { usePatients } from '../context/PatientContext';
import { Patient } from '../types/patient';
import { NewPatientPage } from './NewPatientPage';

// Estilos para o Modal (pop-up)
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto' as 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

// A linha 'Modal.setAppElement('#root');' foi REMOVIDA daqui.

// Componente para o avatar do paciente
const PatientAvatar: React.FC<{ patient: Patient }> = ({ patient }) => {
    if (patient.profilePic) {
        return <img src={patient.profilePic} alt={patient.name} className="w-12 h-12 rounded-full object-cover" />;
    }
    const initial = patient.name.charAt(0).toUpperCase();
    return (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600">{initial}</span>
        </div>
    );
};

export const PatientsPage: React.FC = () => {
    const { patients } = usePatients(); 
    const [searchText, setSearchText] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const activePatients = patients.filter(p => p.isActive);
    
    const filteredPatients = activePatients.filter(patient =>
        patient.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
                <button 
                    onClick={openModal}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Adicionar Novo
                </button>
            </div>
            
            <div className="mb-4">
                <input
                    type="text"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    placeholder="Procurar paciente por nome..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="space-y-3">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                        <Link to={`/patient/${patient.id}`} key={patient.id} className="block no-underline">
                            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <PatientAvatar patient={patient} />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">{patient.name}</h2>
                                        <p className="text-sm text-gray-500">{patient.age} anos</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">Adicionado em:</p>
                                    <p className="text-sm text-gray-600">{new Date(patient.createdAt).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500 mt-8">Nenhum paciente encontrado.</p>
                )}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customModalStyles}
                contentLabel="Adicionar Novo Paciente"
            >
                <NewPatientPage closeModal={closeModal} />
            </Modal>
        </div>
    );
};
