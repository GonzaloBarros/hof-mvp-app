import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollDirection } from '../../hooks/useScrollDirection';

const NavIcon = ({ children, isActive }: { children: React.ReactNode, isActive: boolean }) => (
  <div className={`w-8 h-8 mb-1 transition-colors ${isActive ? 'text-[#00C4B4]' : 'text-gray-500'}`}>
    {children}
  </div>
);

const fabIcons = {
  plus: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  close: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  camera: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>,
  patient: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  text: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>,
  ai: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.45 4.1-4.1 1.45 4.1 1.45L12 14l1.45-4.1 4.1-1.45-4.1-1.45Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
};

export const Navigation: React.FC = () => {
  const location = useLocation();
  const scrollDirection = useScrollDirection();
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Painel', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { path: '/patients', label: 'Pacientes', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { path: '/camera', label: 'Análise', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg> },
    { path: '/agenda', label: 'Agenda', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> },
    { path: '/profile', label: 'Perfil', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
  ];

  return (
    <>
      {isFabMenuOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-80 z-30"
          onClick={() => setIsFabMenuOpen(false)}
        ></div>
      )}

      <div className={`fixed bottom-24 right-6 z-40 flex flex-col items-end space-y-4 transition-all duration-300 ${scrollDirection === 'down' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        {isFabMenuOpen && (
          <div className="flex flex-col items-end space-y-4">
            <div className="flex items-center space-x-3">
              <span className="bg-white p-2 rounded-lg shadow-md text-gray-700 font-semibold">Pergunte para IA</span>
              <Link to="/ask-ai" onClick={() => setIsFabMenuOpen(false)} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-[#00C4B4]">{fabIcons.ai}</Link>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-white p-2 rounded-lg shadow-md text-gray-700 font-semibold">Nova Análise</span>
              <Link to="/camera" onClick={() => setIsFabMenuOpen(false)} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-[#00C4B4]">{fabIcons.camera}</Link>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-white p-2 rounded-lg shadow-md text-gray-700 font-semibold">Novo Paciente</span>
              <Link to="/add-patient" onClick={() => setIsFabMenuOpen(false)} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-[#00C4B4]">{fabIcons.patient}</Link>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-white p-2 rounded-lg shadow-md text-gray-700 font-semibold">Publicar</span>
              <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-[#00C4B4]">{fabIcons.text}</button>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsFabMenuOpen(!isFabMenuOpen)}
          className={`w-16 h-16 bg-[#00C4B4] rounded-full flex items-center justify-center text-white shadow-2xl transform transition-transform duration-300 ${isFabMenuOpen ? 'rotate-45' : 'rotate-0'}`}
        >
          {isFabMenuOpen ? fabIcons.close : fabIcons.plus}
        </button>
      </div>

      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg z-20 transition-transform duration-300 ${scrollDirection === 'down' && !isFabMenuOpen ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-around py-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center text-center w-20 h-16 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'text-[#00C4B4] bg-[#E8F5F4]'
                    : 'text-gray-500 hover:text-[#00C4B4] hover:bg-gray-50'
                }`}
              >
                <NavIcon isActive={location.pathname === item.path}>
                  {item.icon}
                </NavIcon>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};