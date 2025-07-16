import React, { useState } from 'react';

export const useCamera = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 1920,
                    height: 1080,
                    facingMode: 'user'
                }
            });
            setStream(mediaStream);
            setIsActive(true);
            setError(null);
        } catch (err) {
            setError('Erro ao acessar a câmera. Por favor, verifique as permissões no seu navegador.');
            console.error('Camera error:', err);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsActive(false);
        }
    };

    const captureImage = (videoRef: React.RefObject<HTMLVideoElement | null>): string | null => {
        if (!videoRef.current) return null;

        const canvas = document.createElement('canvas');
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        return canvas.toDataURL('image/jpeg', 0.9);
    };

    return {
        stream,
        isActive,
        error,
        startCamera,
        stopCamera,
        captureImage
    };
};
