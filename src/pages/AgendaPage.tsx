import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import { useAppointments } from '../context/AppointmentContext';
import { AppointmentModal } from '../components/Agenda/AppointmentModal';
import { Appointment } from '../types/appointment';

// Configuração para que o calendário entenda o formato de datas em português
const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Tradução dos botões do calendário para português
const messages = {
    allDay: 'Dia Inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há eventos neste período.',
    showMore: (total: number) => `+ Ver mais (${total})`
};

export const AgendaPage: React.FC = () => {
    const { appointments, addAppointment } = useAppointments();
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Guarda os dados da data/hora que o utilizador selecionou
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);

    // Função que é chamada quando o utilizador clica ou arrasta no calendário
    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        setSelectedSlot(slotInfo);
        setIsModalOpen(true);
    };

    // Função para guardar o novo agendamento
    const handleSaveAppointment = (appointment: Omit<Appointment, 'id'>) => {
        addAppointment(appointment);
        setIsModalOpen(false);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8" style={{ height: '80vh' }}>
            <Calendar
                localizer={localizer}
                events={appointments}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                culture='pt-BR'
                messages={messages}
                selectable={true} // Permite que o calendário seja "clicável"
                onSelectSlot={handleSelectSlot}
                defaultView={Views.WEEK} // Define a visualização padrão para 'Semana'
            />

            {/* Renderiza o nosso modal apenas quando ele deve estar aberto */}
            {selectedSlot && (
                <AppointmentModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    startDate={selectedSlot.start}
                    endDate={selectedSlot.end}
                    onSaveAppointment={handleSaveAppointment}
                />
            )}
        </div>
    );
};