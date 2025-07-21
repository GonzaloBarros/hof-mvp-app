import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    // Estados para cada campo do formulário
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cro, setCro] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Efeito para preencher o formulário com os dados do utilizador
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setCro(user.cro);
            setPhone(user.phone);
            setCity(user.city);
            setState(user.state);
            setProfilePic(user.profilePic);
            setLoadingUser(false);
        } else {
            setLoadingUser(false);
        }
    }, [user]);

    // Efeito para redirecionar se o usuário não estiver logado
    useEffect(() => {
        if (!loadingUser && !user) {
            const timer = setTimeout(() => {
                navigate('/login', { replace: true });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [user, loadingUser, navigate]);


    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            const updatedUser = { name, email, cro, phone, city, state, profilePic };
            updateUser(updatedUser);
            alert('Perfil atualizado com sucesso!');
            navigate('/'); // Redireciona para o Dashboard após salvar
        }
    };

    if (loadingUser) {
        return (
            <div className="p-8 text-center bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-gray-600">A carregar dados do utilizador...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 text-center bg-gray-50 min-h-screen flex items-center justify-center">
                <p className="text-red-600">Erro: Usuário não encontrado ou não autenticado.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Meu Perfil</h2>

            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col items-center">
                    {/* Foto de Perfil */}
                    <img
                        src={profilePic || `https://placehold.co/120x120/E8F5F4/1A3C5E?text=${name.charAt(0)}`}
                        alt="Foto do perfil"
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#00C4B4]"
                    />
                    {/* Botão de Mudar Foto */}
                    <label htmlFor="file-upload" className="mt-4 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                        <span>Mudar foto</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handlePictureUpload} accept="image/*"/>
                    </label>

                    <div className="mt-6 w-full space-y-4">
                        <div>
                            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>Nome Completo</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="text-lg text-gray-900 bg-gray-100 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"/>
                        </div>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="text-lg text-gray-900 bg-gray-100 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor='cro' className='block text-sm font-medium text-gray-700'>CRO</label>
                                <input type="text" id="cro" value={cro} onChange={e => setCro(e.target.value)} className="text-lg text-gray-900 bg-gray-100 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"/>
                            </div>
                            <div>
                                <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>Telefone</label>
                                <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="text-lg text-gray-900 bg-gray-100 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor='city' className='block text-sm font-medium text-gray-700'>Cidade</label>
                                <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} className="text-lg text-gray-900 bg-gray-100 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"/>
                            </div>
                            <div>
                                <label htmlFor='state' className='block text-sm font-medium text-gray-700'>Estado</label>
                                <input type="text" id="state" value={state} onChange={e => setState(e.target.value)} className="text-lg text-gray-900 bg-gray-100 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00C4B4]"/>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-8 w-full bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>

            <div className="text-center mt-10">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-600 transition-colors duration-300 ease-in-out shadow-lg"
                >
                    Sair da Conta
                </button>
            </div>
        </div>
    );
};
