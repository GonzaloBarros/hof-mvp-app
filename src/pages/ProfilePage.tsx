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

  // Preenche o formulário com os dados do utilizador quando a página carrega
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setCro(user.cro);
      setPhone(user.phone);
      setCity(user.city);
      setState(user.state);
      setProfilePic(user.profilePic);
    }
  }, [user]);


  const handleLogout = () => {
    logout();
    navigate('/login');
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
    }
  };


  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>A carregar dados do utilizador...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex flex-col items-center">
              <img
                src={profilePic || `https://placehold.co/120x120/E8F5F4/1A3C5E?text=${name.charAt(0)}`}
                alt="Foto do perfil"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#00C4B4]"
              />
              <label htmlFor="file-upload" className="mt-4 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                <span>Mudar foto</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handlePictureUpload} accept="image/*"/>
              </label>
            </div>
            
            <div className="text-center sm:text-left flex-grow">
              <div>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-500'>Nome Completo</label>
                  <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="text-3xl font-bold text-gray-800 bg-transparent w-full border-b-2 p-1"/>
              </div>
              <div className="mt-2">
                  <label htmlFor='email' className='block text-sm font-medium text-gray-500'>Email</label>
                  <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="text-gray-500 bg-transparent w-full border-b-2 p-1"/>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">CRO</dt>
                <dd className="mt-1"><input type="text" value={cro} onChange={e => setCro(e.target.value)} className="text-lg text-gray-900 w-full border-b-2 p-1"/></dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="mt-1"><input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="text-lg text-gray-900 w-full border-b-2 p-1"/></dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Cidade</dt>
                <dd className="mt-1"><input type="text" value={city} onChange={e => setCity(e.target.value)} className="text-lg text-gray-900 w-full border-b-2 p-1"/></dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Estado</dt>
                <dd className="mt-1"><input type="text" value={state} onChange={e => setState(e.target.value)} className="text-lg text-gray-900 w-full border-b-2 p-1"/></dd>
              </div>
            </dl>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-[#00C4B4] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Sair (Logout)
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};