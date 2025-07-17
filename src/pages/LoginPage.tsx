import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Para a simulação, vamos criar dados de exemplo caso não haja nenhum utilizador
        const mockUser = {
            name: "Dr. Leandro", // Nome de exemplo atualizado
            email: "exemplo@medsense.com",
            cro: "12345",
            phone: "912345678",
            city: "Lisboa",
            state: "Lisboa",
            profilePic: null,
        };

        login(user || mockUser);
        navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h1 className="text-4xl font-bold text-[#00C4B4]">Medanalis</h1>
                <h2 className="mt-2 text-xl text-gray-600">
                    Análise Avançada. Resultados Precisos.
                </h2>
            </div>
            
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Bem-vindo(a) de volta!</h3>
                        <p className="text-gray-500">Faça login para continuar</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                                placeholder="seuemail@exemplo.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm"
                                placeholder="********"
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <button type="button" className="font-medium text-[#00C4B4] hover:text-[#00B5A5] bg-transparent border-none p-0 cursor-pointer">
                                    Esqueceu a senha?
                                </button>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00C4B4] hover:bg-[#00B5A5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B5A5]">
                                Entrar
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta?{' '}
                            <Link to="/register" className="font-medium text-[#00C4B4] hover:text-[#00B5A5]">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
