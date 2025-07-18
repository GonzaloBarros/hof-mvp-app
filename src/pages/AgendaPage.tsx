import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useAppointments } from '../context/AppointmentContext';
import { AppointmentModal } from '../components/Agenda/AppointmentModal';
import { Appointment } from '../types/appointment';

// Configuração para o calendário em português
const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const messages = {
    allDay: 'Dia Inteiro', previous: 'Anterior', next: 'Próximo', today: 'Hoje',
    month: 'Mês', week: 'Semana', day: 'Dia', agenda: 'Agenda',
    date: 'Data', time: 'Hora', event: 'Evento', noEventsInRange: 'Não há eventos neste período.',
    showMore: (total: number) => `+ Ver mais (${total})`
};

export const AgendaPage: React.FC = () => {
    const { appointments, addAppointment } = useAppointments();
    const [allEvents, setAllEvents] = useState<Appointment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
    const [googleToken, setGoogleToken] = useState<string | null>(null);

    const fetchGoogleEvents = async (token: string) => {
        try {
            const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.items) {
                const googleEvents: Appointment[] = data.items.map((event: any) => ({
                    id: event.id,
                    title: event.summary,
                    start: new Date(event.start.dateTime || event.start.date),
                    end: new Date(event.end.dateTime || event.end.date),
                }));
                // Junta os eventos locais com os da Google, evitando duplicados se já existirem
                setAllEvents(prev => [...appointments, ...googleEvents.filter(ge => !appointments.some(ae => ae.id === ge.id))]);
            }
        } catch (error) {
            console.error("Erro ao buscar eventos do Google Calendar:", error);
        }
    };

    useEffect(() => {
        if (googleToken) {
            fetchGoogleEvents(googleToken);
        } else {
            setAllEvents(appointments);
        }
    }, [googleToken, appointments]);


    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setGoogleToken(tokenResponse.access_token);
        },
        onError: () => {
          alert('A ligação com o Google falhou. Por favor, tente novamente.');
        },
        scope: 'https://www.googleapis.com/auth/calendar', 
    });

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        setSelectedSlot(slotInfo);
        setIsModalOpen(true);
    };

    // AQUI ESTÁ A GRANDE ALTERAÇÃO
    const handleSaveAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
        // Primeiro, guarda o agendamento na nossa aplicação
        addAppointment(appointmentData);
        setIsModalOpen(false);

        // Se estivermos conectados ao Google, envia também para lá
        if (googleToken) {
            try {
                await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${googleToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        summary: appointmentData.title,
                        start: { dateTime: appointmentData.start.toISOString() },
                        end: { dateTime: appointmentData.end.toISOString() },
                    }),
                });
                // Recarrega os eventos para mostrar o novo agendamento da Google
                fetchGoogleEvents(googleToken);
            } catch (error) {
                console.error("Erro ao criar evento no Google Calendar:", error);
                alert("O agendamento foi salvo na aplicação, mas falhou ao sincronizar com o Google Calendar.");
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            {!googleToken ? (
                <div className="text-center mb-4 p-4 bg-white rounded-lg shadow">
                    <h3 className="font-bold text-lg">Sincronize a sua Agenda</h3>
                    <p className="text-gray-600 mb-3">Conecte-se à sua conta Google para ver e gerir os seus agendamentos do Google Calendar diretamente aqui.</p>
                    <button onClick={() => login()} className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                        Conectar com Google Calendar
                    </button>
                </div>
            ) : (
                <div className="text-center mb-4 p-4 bg-green-100 text-green-800 rounded-lg shadow flex justify-center items-center">
                    <p className="font-bold">✓ Conectado ao Google Calendar</p>
                    <button onClick={() => { setGoogleToken(null); googleLogout(); }} className="ml-4 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-red-700 transition-colors">
                        Desconectar
                    </button>
                </div>
            )}

            <div style={{ height: '75vh' }}>
                <Calendar
                    localizer={localizer}
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    culture='pt-BR'
                    messages={messages}
                    selectable={true}
                    onSelectSlot={handleSelectSlot}
                    defaultView={Views.WEEK}
                />
            </div>

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