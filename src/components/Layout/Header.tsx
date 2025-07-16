import React from 'react';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "HOF" }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-2xl font-bold">
                                <span className="text-[#00B5A5]">Med</span>
                                <span className="text-black">Sense</span>
                            </span>
                        </div>
                        {title && (
                            <h1 className="ml-8 text-xl font-semibold text-gray-900">
                                {title}
                            </h1>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
