import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import { useAppointments } from '../context/AppointmentContext'; // Atualizado para usar deleteAppointment
import { AppointmentModal } from '../components/Agenda/AppointmentModal';
import { Appointment } from '../types/appointment'; // Certifique-se que Appointment está importado
import { AppointmentDetailModal } from '../components/Agenda/AppointmentDetailModal'; // NOVO: Importar o modal de detalhes

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
maxTime.setHours(19, 0, 0); // 19:00 é o início do último slot visível (até 19:59)

export const AgendaPage: React.FC = () => {
    const { appointments, addAppointment, deleteAppointment } = useAppointments(); // Pegar deleteAppointment
    const [allEvents, setAllEvents] = useState<Appointment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal para NOVO agendamento
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // NOVO: Modal para DETALHES do agendamento
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null); // NOVO: Armazena o evento clicado
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
        // Garante que o allEvents é atualizado sempre que 'appointments' muda,
        // ou quando o token do Google muda para buscar eventos novamente
        if (googleToken) {
            fetchGoogleEvents(googleToken);
        } else {
            setAllEvents(appointments);
        }
    }, [googleToken, appointments]); // Dependências atualizadas

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
        // Verifica se o slot selecionado está fora do horário permitido (08-19h)
        if (slotInfo.start.getHours() < minTime.getHours() || slotInfo.start.getHours() >= maxTime.getHours()) {
            return; // Não permite seleção fora do horário
        }
        // Verifica se o dia selecionado é Domingo
        if (slotInfo.start.getDay() === 0) { // 0 é Domingo
            return; // Não permite seleção no Domingo
        }

        setSelectedSlot(slotInfo);
        setIsModalOpen(true); // Abre o modal de NOVO agendamento
    };

    // NOVO: Função para lidar com o clique em um evento existente
    const handleSelectEvent = (event: Appointment) => {
        setSelectedEvent(event); // Armazena o evento clicado
        setIsDetailModalOpen(true); // Abre o modal de DETALHES
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
                fetchGoogleEvents(googleToken); // Recarrega eventos do Google após adicionar
            } catch (error) {
                console.error("Erro ao criar evento no Google Calendar:", error);
                alert("O agendamento foi salvo na aplicação, mas falhou ao sincronizar com o Google Calendar.");
            }
        }
    };

    // NOVO: Função para excluir um agendamento (passada para o modal de detalhes)
    const handleDeleteEvent = (id: string) => {
        // Adicionar lógica para excluir do Google Calendar se for um evento do Google
        deleteAppointment(id); // Exclui do contexto
        setIsDetailModalOpen(false); // Fecha o modal
        alert("Agendamento excluído com sucesso!");
    };


    // Função para customizar o estilo dos slots de tempo (para desabilitar Domingo)
    const slotPropGetter = useMemo(() => (date: Date) => {
        if (date.getDay() === 0) { // 0 é Domingo
            return {
                style: {
                    backgroundColor: '#f8f8f8',
                    cursor: 'not-allowed',
                    opacity: 0.6,
                },
                className: 'rbc-day-bg rbc-off-range-bg'
            };
        }
        return {};
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Seção de Conectar com Google */}
            {!googleToken ? (
                <div className="text-center mb-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                    <h3 className="font-bold text-xl text-blue-700 mb-2">Sincronize sua Agenda Google</h3>
                    <p className="text-gray-600 mb-4">Conecte-se à sua conta Google para gerenciar seus agendamentos diretamente aqui.</p>
                    <button onClick={() => login()} className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-md">
                        Conectar com Google Calendar
                    </button>
                </div>
            ) : (
                <div className="text-center mb-6 p-6 bg-green-50 text-green-800 rounded-xl shadow-lg flex flex-col sm:flex-row justify-center items-center gap-4 border border-green-200">
                    <p className="font-semibold text-lg">✓ Conectado ao Google Calendar</p>
                    <button onClick={() => { setGoogleToken(null); googleLogout(); }} className="ml-4 bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 ease-in-out shadow-sm">
                        Desconectar
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center mb-4 p-2 bg-white rounded-xl shadow-sm">
                <h2 className="text-lg font-bold text-gray-800">Sua Agenda</h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-2 overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
                <Calendar
                    localizer={localizer}
                    events={allEvents}
                    startAccessor="start"
                    endAccessor="end"
                    culture='pt-BR'
                    messages={messages}
                    selectable={true}
                    onSelectSlot={handleSelectSlot} // Para criar novo agendamento
                    onSelectEvent={handleSelectEvent} // NOVO: Para clicar em evento existente
                    defaultView={Views.WEEK}
                    views={[Views.WEEK, Views.DAY, Views.AGENDA]}
                    min={minTime}
                    max={maxTime}
                    step={60}
                    timeslots={1}
                    showMultiDayTimes={false}
                    toolbar={true}
                    onView={(view: View) => setCurrentView(view)}
                    components={{
                        toolbar: (toolbarProps) => {
                            const enabledViews = toolbarProps.views as View[]; 
                            return (
                                <div className="rbc-toolbar flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-2">
                                    <span className="rbc-btn-group flex gap-2">
                                        <button type="button" onClick={() => toolbarProps.onNavigate('PREV')} className="bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300">Anterior</button>
                                        <button type="button" onClick={() => toolbarProps.onNavigate('TODAY')} className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600">Hoje</button>
                                        <button type="button" onClick={() => toolbarProps.onNavigate('NEXT')} className="bg-gray-200 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-300">Próximo</button>
                                    </span>
                                    <span className="rbc-toolbar-label font-semibold text-gray-800 text-lg sm:my-0 my-2">
                                        {toolbarProps.label}
                                    </span>
                                    <span className="rbc-btn-group flex gap-2">
                                        {enabledViews.includes(Views.WEEK) && (
                                            <button type="button" onClick={() => toolbarProps.onView(Views.WEEK)} className={`py-1 px-3 rounded text-sm ${currentView === Views.WEEK ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Semana</button>
                                        )}
                                        {enabledViews.includes(Views.DAY) && (
                                            <button type="button" onClick={() => toolbarProps.onView(Views.DAY)} className={`py-1 px-3 rounded text-sm ${currentView === Views.DAY ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Dia</button>
                                        )}
                                        {enabledViews.includes(Views.AGENDA) && (
                                            <button type="button" onClick={() => toolbarProps.onView(Views.AGENDA)} className={`py-1 px-3 rounded text-sm ${currentView === Views.AGENDA ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Agenda</button>
                                        )}
                                    </span>
                                </div>
                            );
                        },
                    }}
                    slotPropGetter={slotPropGetter}
                    dayPropGetter={(date: Date) => {
                        if (date.getDay() === 0) { // 0 é Domingo
                            return { className: 'rbc-day-bg rbc-off-range-bg rbc-sunday-column-hidden' };
                        }
                        return {};
                    }}
                />
            </div>

            {/* Modal para criar NOVO agendamento */}
            {selectedSlot && (
                <AppointmentModal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    startDate={selectedSlot.start}
                    endDate={selectedSlot.end}
                    onSaveAppointment={handleSaveAppointment}
                />
            )}

            {/* NOVO: Modal para visualizar/excluir DETALHES do agendamento */}
            {selectedEvent && (
                <AppointmentDetailModal
                    isOpen={isDetailModalOpen}
                    onRequestClose={() => setIsDetailModalOpen(false)}
                    appointment={selectedEvent}
                    onDelete={handleDeleteEvent} // Passa a função de exclusão
                />
            )}
        </div>
    );
};