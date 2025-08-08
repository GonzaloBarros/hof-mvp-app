import React from 'react';

// O caminho está a apontar para a mesma pasta, que é o correto agora.
import medanaliticLogo from './logo.png'; 

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    <img
                        src={medanaliticLogo}
                        alt="Logo Medanalitic"
                        className="h-8 w-auto"
                    />
                    {/* AQUI ESTÁ A ALTERAÇÃO: O título só aparece se não for "Dashboard" */}
                    {title && title !== 'Dashboard' && (
                        <h1 className="ml-4 text-xl font-semibold text-gray-800 border-l-2 border-gray-200 pl-4">
                            {title}
                        </h1>
                    )}
                </div>
            </div>
        </header>
    );
};
