import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Appointment } from '../types/appointment';
import { v4 as uuidv4 } from 'uuid';

// Adicionar a dependência para gerar IDs únicos
// Se o terminal der um erro, execute: npm install uuid @types/uuid

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Dados de exemplo para que a agenda não comece vazia
const exampleAppointments: Appointment[] = [
    {
        id: '1',
        title: 'Consulta de Acompanhamento - Maria Silva',
        start: new Date(2025, 6, 19, 10, 0, 0), // Mês é 0-indexed (6 = Julho)
        end: new Date(2025, 6, 19, 11, 0, 0),
    },
    {
        id: '2',
        title: 'Aplicação de Botox - João Pereira',
        start: new Date(2025, 6, 21, 14, 30, 0),
        end: new Date(2025, 6, 21, 15, 0, 0),
    }
];


export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const savedAppointments = localStorage.getItem('appointments');
      if (savedAppointments) {
        const parsed = JSON.parse(savedAppointments);
        // Datas são guardadas como strings, precisamos de as converter de volta para objetos Date
        return parsed.map((appt: any) => ({
            ...appt,
            start: new Date(appt.start),
            end: new Date(appt.end),
        }));
      }
      return exampleAppointments; // Se não houver nada guardado, usa os exemplos
    } catch (error) {
      return exampleAppointments;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    } catch (error) {
      console.error("Erro ao guardar agendamentos", error);
    }
  }, [appointments]);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: uuidv4() };
    setAppointments(prev => [...prev, newAppointment]);
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment }}>
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