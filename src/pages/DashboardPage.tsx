import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';

const ActionButton = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
  <Link to={to} className="flex flex-col items-center space-y-2 text-center">
    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors text-[#00B5A5]">
      <div className="w-12 h-12">
        {icon}
      </div>
    </div>
    <span className="font-semibold text-gray-700">{label}</span>
  </Link>
);

const InfoCard = ({ title, children, onSearchChange, searchPlaceholder }: { title: string, children: React.ReactNode, onSearchChange?: (term: string) => void, searchPlaceholder?: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      {onSearchChange ? (
        <input
          type="text"
          placeholder={searchPlaceholder || "Procurar..."}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-1/2 px-3 py-1.5 border border-gray-300 rounded-full text-sm focus:ring-[#00C4B4] focus:border-[#00C4B4]"
        />
      ) : (
        <Link to="/patients" className="text-sm font-semibold text-[#00C4B4] hover:underline">Ver todos</Link>
      )}
    </div>
    <div>
      {children}
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const [searchTerm, setSearchTerm] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const filteredPatients = patients
    .slice()
    .reverse()
    .filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const today = new Date();
  const todayAppointments = appointments.filter(appt =>
    new Date(appt.start).getDate() === today.getDate() &&
    new Date(appt.start).getMonth() === today.getMonth() &&
    new Date(appt.start).getFullYear() === today.getFullYear()
  ).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  const currentDate = new Date().toLocaleDateString(i18n.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const icons = {
    analysis: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 7.5a4 4 0 0 1 4-4h1"/><path d="M15.5 3.5a4 4 0 0 1 4 4v1"/><path d="M3.5 16.5a4 4 0 0 0 4 4h1"/><path d="M15.5 20.5a4 4 0 0 0 4-4v-1"/><path d="M8 14c.67.5 1.5 1 4 1s3.33-.5 4-1"/><path d="M9 9h.01"/><path d="M15 9h.01"/><path d="M2 12h20"/></svg>,
    patients: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    agenda: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
  };

  return (
    <div className="bg-gray-50 min-h-full">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{getGreeting()}, Dr. {user?.name || ''}</h1>
            <p className="text-gray-500 capitalize">{currentDate}</p>
          </div>
          <img
            src={user?.profilePic || `https://placehold.co/60x60/E8F5F4/1A3C5E?text=${user?.name?.charAt(0) || 'M'}`}
            alt="Foto do perfil"
            className="w-14 h-14 rounded-full object-cover border-2 border-[#00C4B4]"
          />
        </div>
      </header>

      <section className="grid grid-cols-3 gap-4 mb-10">
        {/* CORREÇÃO AQUI: O link "Nova Análise" agora aponta para o novo fluxo da câmara. */}
        <ActionButton to="/capture-flow" icon={icons.analysis} label={t('dashboard.newAnalysis')} />
        <ActionButton to="/patients" icon={icons.patients} label={t('dashboard.patients')} />
        <ActionButton to="/agenda" icon={icons.agenda} label={t('dashboard.agenda')} />
      </section>

      <section className="space-y-6">
        <InfoCard title={t('dashboard.todayConsultations')}>
          {todayAppointments.length > 0 ? (
            <ul className="space-y-3 max-h-40 overflow-y-auto">
              {todayAppointments.map((appt) => (
                <Link to={`/patient/${appt.patientId}`} key={appt.id} className="block">
                  <li className="p-2 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
                    <div>
                      <p className="font-semibold text-gray-800">{appt.title}</p> 
                      <p className="text-sm text-gray-500">
                        {new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(appt.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-4">{t('dashboard.noConsultations')}</p>
          )}
        </InfoCard>

        <InfoCard title={t('dashboard.recentPatients')} onSearchChange={setSearchTerm} searchPlaceholder={t('dashboard.search')}>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <Link to={`/patient/${patient.id}`} key={patient.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50">
                  <img
                    src={patient.profilePic || `https://placehold.co/40x40/E8F5F4/1A3C5E?text=${patient.name.charAt(0)}`}
                    alt="Foto do Paciente"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-gray-800">{patient.name}</p>
                    <p className="text-sm text-gray-500">
                      Adicionado em: {new Date(patient.createdAt).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">{t('dashboard.noPatientsFound')}</p>
            )}
          </div>
        </InfoCard>
      </section>
    </div>
  );
};
