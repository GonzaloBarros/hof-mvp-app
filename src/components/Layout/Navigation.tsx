import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: '🏠' },
        { path: '/camera', label: 'Captura', icon: '📷' },
        { path: '/analysis', label: 'Análise', icon: '🔬' },
        { path: '/patients', label: 'Pacientes', icon: '👥' },
        { path: '/reports', label: 'Relatórios', icon: '📄' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-around py-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center text-center w-16 h-16 rounded-md transition-colors ${
                                location.pathname === item.path
                                    ? 'text-[#00C4B4] bg-[#E8F5F4]'
                                    : 'text-gray-500 hover:text-[#00C4B4]'
                            }`}
                        >
                            <span className="text-2xl mb-1">{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};
