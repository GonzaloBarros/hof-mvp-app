import React from 'react';
import Modal from 'react-modal'; // Você já deve ter este import ou precisa instalá-lo se não estiver usando
import { Appointment } from '../../types/appointment'; // Importar a interface Appointment

// Configuração para o modal (importante para acessibilidade)
Modal.setAppElement('#root'); // Certifique-se que o id 'root' existe no seu index.html

interface AppointmentDetailModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    appointment: Appointment;
    onDelete: (id: string) => void; // Função para exclusão
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
    isOpen,
    onRequestClose,
    appointment,
    onDelete,
}) => {
    // Formata as datas para exibição
    const startDate = appointment.start.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' });
    const endDate = appointment.end.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' });

    const handleDeleteClick = () => {
        if (window.confirm(`Tem certeza que deseja excluir o agendamento "${appointment.title}"?`)) {
            onDelete(appointment.id);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Detalhes do Agendamento"
            className="modal-content-agenda p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto my-20 relative"
            overlayClassName="modal-overlay-agenda fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center"
        >
            <button
                onClick={onRequestClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
                &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Detalhes do Agendamento</h2>

            <div className="space-y-3 mb-6">
                <p className="text-gray-700">
                    <span className="font-semibold">Título:</span> {appointment.title}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Início:</span> {startDate}
                </p>
                <p className="text-gray-700">
                    <span className="font-semibold">Fim:</span> {endDate}
                </p>
                {/* Adicione mais detalhes aqui se a interface 'Appointment' tiver mais campos */}
                {/* Exemplo: <p className="text-gray-700"><span className="font-semibold">Descrição:</span> {appointment.description}</p> */}
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    onClick={handleDeleteClick}
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                    Excluir Agendamento
                </button>
                <button
                    onClick={onRequestClose}
                    className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                    Fechar
                </button>
            </div>
        </Modal>
    );
};