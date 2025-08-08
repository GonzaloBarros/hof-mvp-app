import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Appointment } from '../types/appointment';

interface AppointmentContextType {
    appointments: Appointment[];
    addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
    deleteAppointment: (id: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appointments, setAppointments] = useState<Appointment[]>(() => {
        try {
            const savedAppointments = localStorage.getItem('appointments');
            // Precisamos converter as strings de data de volta para objetos Date
            if (savedAppointments) {
                const parsed = JSON.parse(savedAppointments);
                return parsed.map((appt: any) => ({
                    ...appt,
                    start: new Date(appt.start),
                    end: new Date(appt.end),
                }));
            }
            return [];
        } catch (error) {
            console.error("Erro ao carregar agendamentos do localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('appointments', JSON.stringify(appointments));
        } catch (error) {
            console.error("Erro ao salvar agendamentos no localStorage", error);
        }
    }, [appointments]);

    const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
        const newAppointment = { ...appointment, id: uuidv4() };
        setAppointments(prev => [...prev, newAppointment]);
    };

    const deleteAppointment = (id: string) => {
        setAppointments(prev => prev.filter(appt => appt.id !== id));
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
        throw new Error('useAppointments deve ser usado dentro de um AppointmentProvider');
    }
    return context;
};
