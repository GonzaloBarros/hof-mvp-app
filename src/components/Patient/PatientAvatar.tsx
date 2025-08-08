import React from 'react';
import { Patient } from '../../types/patient';

interface PatientAvatarProps {
    patient: Patient;
}

export const PatientAvatar: React.FC<PatientAvatarProps> = ({ patient }) => {
    if (patient.profilePic) {
        return <img src={patient.profilePic} alt={patient.name} className="w-12 h-12 rounded-full object-cover" />;
    }
    const initial = patient.name ? patient.name.charAt(0).toUpperCase() : '?';
    return (
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-600">{initial}</span>
        </div>
    );
};
