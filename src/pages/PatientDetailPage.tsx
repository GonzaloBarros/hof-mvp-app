import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAnalyses } from '../context/AnalysisContext';

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { patients, updatePatient, deletePatient } = usePatients();
  const { analyses } = useAnalyses();
  const navigate = useNavigate();

  const patient = patients.find(p => p.id === id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedAge, setEditedAge] = useState('');

  useEffect(() => {
    if (patient) {
      setEditedName(patient.name);
      setEditedAge(patient.age.toString());
    }
  }, [patient, isEditing]);


  const patientAnalyses = analyses
    .filter(a => a.patientId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDelete = () => {
    if (patient && window.confirm(`Tem a certeza de que quer apagar o paciente ${patient.name}? Esta ação não pode ser desfeita.`)) {
        deletePatient(patient.id);
        navigate('/patients');
    }
  };

  const handleSave = () => {
    if(patient) {
        updatePatient(patient.id, { name: editedName, age: parseInt(editedAge, 10) });
        setIsEditing(false);
    }
  };

  if (!patient) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600">Paciente não encontrado</h2>
        <Link to="/patients" className="text-[#00C4B4] hover:underline mt-4 inline-block">
          Voltar para a lista de pacientes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start">
            <div className="flex-grow">
                {isEditing ? (
                    <>
                        <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="text-3xl font-bold text-gray-800 w-full border-b-2 p-1 mb-2"/>
                        <input type="number" value={editedAge} onChange={(e) => setEditedAge(e.target.value)} className="text-gray-500 w-full border-b-2 p-1"/>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-gray-800">{patient.name}</h1>
                        <p className="text-gray-500">{patient.age} anos</p>
                    </>
                )}
            </div>
            <img
                src={patient.profilePic || `https://placehold.co/80x80/E8F5F4/1A3C5E?text=${patient.name.charAt(0)}`}
                alt="Foto do Paciente"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#00C4B4] ml-4"
            />
        </div>
        <div className="border-t mt-4 pt-4 flex space-x-4">
            {isEditing ? (
                <>
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors">Salvar</button>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Cancelar</button>
                </>
            ) : (
                 <>
                    <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">Editar Paciente</button>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">Apagar Paciente</button>
                 </>
            )}
        </div>
      </div>

      <div className="mb-8">
        <Link 
            to="/camera"
            className="w-full flex items-center justify-center bg-[#00C4B4] text-white px-6 py-4 rounded-lg font-semibold hover:bg-[#00B5A5] transition-colors text-lg shadow-lg"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            Novo Procedimento
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Histórico de Análises</h2>
        {patientAnalyses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {patientAnalyses.map(analysis => (
              <Link to={`/analysis/${analysis.id}`} key={analysis.id}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer h-full flex flex-col">
                  <img src={analysis.image} alt={`Análise de ${new Date(analysis.createdAt).toLocaleDateString()}`} className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity" />
                  <div className="p-4 flex flex-col flex-grow">
                    <p className="font-semibold text-gray-800">Análise</p>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(analysis.createdAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <div className="border-t border-gray-200 pt-3 mt-auto text-xs space-y-1">
                      <div className="flex justify-between"><span>Rugas:</span> <span className="font-bold">{analysis.skinProblems.wrinkles.severity}</span></div>
                      <div className="flex justify-between"><span>Manchas:</span> <span className="font-bold">{analysis.skinProblems.darkSpots.severity}</span></div>
                      <div className="flex justify-between"><span>Poros:</span> <span className="font-bold">{analysis.skinProblems.pores.severity}</span></div>
                      <div className="flex justify-between"><span>Acne:</span><span className="font-bold">{analysis.skinProblems.acne.severity}</span></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <p className="text-gray-500">Nenhuma análise encontrada para este paciente.</p>
          </div>
        )}
      </div>
    </div>
  );
};