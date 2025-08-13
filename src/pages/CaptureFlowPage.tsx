import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useImage } from '../context/ImageContext';

export const CaptureFlowPage: React.FC = () => {
    const navigate = useNavigate();
    const { setImageData } = useImage();
    const webcamRef = useRef<Webcam>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);
        }
    }, [webcamRef]);

    const handleConfirm = () => {
        if (capturedImage) {
            setImageData(capturedImage);
            navigate('/associate-patient'); // Próximo passo: associar a foto a um paciente
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    {capturedImage ? 'Verifique a Foto' : 'Captura Facial'}
                </h1>

                <div className="relative w-full aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4">
                    {capturedImage ? (
                        <img src={capturedImage} alt="Foto Capturada" className="w-full h-full object-cover" />
                    ) : (
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover"
                            videoConstraints={{ facingMode: "user" }}
                        />
                    )}
                </div>

                {capturedImage ? (
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={handleConfirm} className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                            Confirmar e Continuar
                        </button>
                        <button onClick={handleRetake} className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                            Tirar Outra
                        </button>
                    </div>
                ) : (
                    <button onClick={capture} className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                        Capturar Foto
                    </button>
                )}
            </div>
        </div>
    );
};
