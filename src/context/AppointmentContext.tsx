import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Certifique-se de que a interface Appointment está definida em algum lugar (provavelmente em 'src/types/appointment.ts')
// Exemplo da interface (se não tiver certeza, procure pelo seu arquivo appointment.ts)
export interface Appointment {
    id: string;
    title: string;
    start: Date;
    end: Date;
    // Adicione outras propriedades se o seu agendamento tiver (ex: description, patientId)
}

interface AppointmentContextType {
    appointments: Appointment[];
    addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
    deleteAppointment: (id: string) => void; // NOVO: Função para excluir agendamento
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appointments, setAppointments] = useState<Appointment[]>(() => {
        // Tenta carregar os agendamentos do localStorage ao iniciar
        const savedAppointments = localStorage.getItem('medanalis_appointments');
        if (savedAppointments) {
            const parsed = JSON.parse(savedAppointments);
            // Converte as strings de data de volta para objetos Date
            return parsed.map((app: Appointment) => ({
                ...app,
                start: new Date(app.start),
                end: new Date(app.end)
            }));
        }
        return [];
    });

    // Salva os agendamentos no localStorage sempre que eles mudam
    useEffect(() => {
        localStorage.setItem('medanalis_appointments', JSON.stringify(appointments));
    }, [appointments]);

    const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
        const newAppointment: Appointment = {
            ...appointment,
            id: Date.now().toString(), // Gera um ID único
        };
        setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
    };

    // NOVO: Implementação da função de exclusão
    const deleteAppointment = (id: string) => {
        setAppointments((prevAppointments) => prevAppointments.filter(app => app.id !== id));
    };

    return (
        <AppointmentContext.Provider value={{ appointments, addAppointment, deleteAppointment }}>
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointments = () => {
    const context = useContext(AppointmentContext);
    if (context === undefined) {
        throw new Error('useAppointments must be used within an AppointmentProvider');
    }
    return context;
};