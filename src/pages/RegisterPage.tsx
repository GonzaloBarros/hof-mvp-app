import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cro, setCro] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    const newUser = { name, email, cro, phone, city, state, profilePic };
    login(newUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie a sua conta
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                )}
              </div>
              <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00C4B4]">
                <span>Carregar foto</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handlePictureUpload} accept="image/*" />
              </label>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input id="name" name="name" type="text" required value={name} onChange={e => setName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm" />
            </div>
            
            <div>
              <label htmlFor="cro" className="block text-sm font-medium text-gray-700">CRO</label>
              <input id="cro" name="cro" type="text" required value={cro} onChange={e => setCro(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm" />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone Celular</label>
              <input id="phone" name="phone" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">Cidade</label>
                <input id="city" name="city" type="text" required value={city} onChange={e => setCity(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm" />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado</label>
                <input id="state" name="state" type="text" required value={state} onChange={e => setState(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <input id="password" name="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00C4B4] focus:border-[#00C4B4] sm:text-sm" />
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00C4B4] hover:bg-[#00B5A5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B5A5]">
                Criar Conta
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Já tem uma conta?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Fazer Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
