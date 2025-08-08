import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { usePatients } from '../../context/PatientContext';
import { Appointment } from '../../types/appointment';

// Estilos para o Modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
};

// A linha 'Modal.setAppElement('#root');' foi REMOVIDA daqui.

interface AppointmentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSaveAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  startDate: Date;
  endDate: Date;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onRequestClose,
  onSaveAppointment,
  startDate,
  endDate,
}) => {
  const { patients } = usePatients();
  const [title, setTitle] = useState('');
  const [patientId, setPatientId] = useState<string>('');

  useEffect(() => {
    if (patients.length > 0 && !patientId) {
      setPatientId(patients[0].id);
    }
  }, [patients, isOpen]);
  
  const handleSave = () => {
    if (!title || !patientId) {
      alert('Por favor, preencha o motivo da consulta e selecione um paciente.');
      return;
    }
    
    const patientName = patients.find(p => p.id === patientId)?.name || '';

    onSaveAppointment({
      title: `${title} - ${patientName}`,
      start: startDate,
      end: endDate,
      patientId: patientId,
    });
    
    setTitle('');
    if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Adicionar Novo Agendamento"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Agendamento</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Paciente</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Motivo da Consulta</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            placeholder="Ex: Aplicação de Botox"
          />
        </div>
        <div className="text-sm text-gray-500">
            <p><strong>Início:</strong> {startDate.toLocaleString('pt-PT')}</p>
            <p><strong>Fim:</strong> {endDate.toLocaleString('pt-PT')}</p>
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={onRequestClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Salvar Agendamento
          </button>
        </div>
      </div>
    </Modal>
  );
};
