import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useAppointments } from '../context/AppointmentContext';
import { AppointmentModal } from '../components/Agenda/AppointmentModal';
import { Appointment } from '../types/appointment';
import { AppointmentDetailModal } from '../components/Agenda/AppointmentDetailModal';

// Configuração para o calendário em português
const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
const messages = {
    allDay: 'Dia Inteiro', previous: 'Anterior', next: 'Próximo', today: 'Hoje',
    month: 'Mês', week: 'Semana', day: 'Dia', agenda: 'Agenda',
    date: 'Data', time: 'Hora', event: 'Evento', noEventsInRange: 'Não há eventos neste período.',
    showMore: (total: number) => `+ Ver mais (${total})`
};

// Define os horários mínimo e máximo para exibição no calendário (08:00 às 19:00)
const minTime = new Date();
minTime.setHours(8, 0, 0);
const maxTime = new Date();
maxTime.setHours(19, 0, 0);

export const AgendaPage: React.FC = () => {
    const { appointments, addAppointment, deleteAppointment } = useAppointments();
    const [allEvents, setAllEvents] = useState<Appointment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
    const [googleToken, setGoogleToken] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>(Views.WEEK);

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
        if (slotInfo.start.getHours() < minTime.getHours() || slotInfo.start.getHours() >= maxTime.getHours()) return;
        if (slotInfo.start.getDay() === 0) return;
        setSelectedSlot(slotInfo);
        setIsModalOpen(true);
    };

    const handleSelectEvent = (event: Appointment) => {
        setSelectedEvent(event);
        setIsDetailModalOpen(true);
    };

    const handleSaveAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
        addAppointment(appointmentData);
        setIsModalOpen(false);

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
                fetchGoogleEvents(googleToken);
            } catch (error) {
                console.error("Erro ao criar evento no Google Calendar:", error);
                alert("O agendamento foi salvo na aplicação, mas falhou ao sincronizar com o Google Calendar.");
            }
        }
    };

    const handleDeleteEvent = (id: string) => {
        deleteAppointment(id);
        setIsDetailModalOpen(false);
        alert("Agendamento excluído com sucesso!");
    };

    const slotPropGetter = useMemo(() => (date: Date) => {
        if (date.getDay() === 0) {
            return {
                style: {
                    backgroundColor: '#f8f8f8',
                    cursor: 'not-allowed',
                },
            };
        }
        return {};
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {!googleToken ? (
                <div className="text-center mb-6 p-6 bg-white rounded-xl shadow-lg">
                    <h3 className="font-bold text-xl text-blue-700 mb-2">Sincronize sua Agenda Google</h3>
                    <p className="text-gray-600 mb-4">Conecte-se para gerenciar seus agendamentos.</p>
                    <button onClick={() => login()} className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700">
                        Conectar com Google Calendar
                    </button>
                </div>
            ) : (
                <div className="text-center mb-6 p-6 bg-green-50 text-green-800 rounded-xl shadow-lg flex justify-center items-center gap-4">
                    <p className="font-semibold text-lg">✓ Conectado ao Google Calendar</p>
                    <button onClick={() => { setGoogleToken(null); googleLogout(); }} className="bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-600">
                        Desconectar
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-2" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
                <Calendar
                    localizer={localizer}
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    culture='pt-BR'
                    messages={messages}
                    selectable={true}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    defaultView={Views.WEEK}
                    views={[Views.WEEK, Views.DAY, Views.AGENDA]}
                    min={minTime}
                    max={maxTime}
                    step={60}
                    timeslots={1}
                    slotPropGetter={slotPropGetter}
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

            {selectedEvent && (
                <AppointmentDetailModal
                    isOpen={isDetailModalOpen}
                    onRequestClose={() => setIsDetailModalOpen(false)}
                    appointment={selectedEvent}
                    onDelete={handleDeleteEvent}
                />
            )}
        </div>
    );
};
