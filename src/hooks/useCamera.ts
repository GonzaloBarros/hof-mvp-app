import { useState, useEffect, useCallback } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);

  const getCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices);
    } catch (err) {
      console.error('Erro ao listar dispositivos:', err);
      setError('Não foi possível listar as câmaras do dispositivo.');
    }
  }, []);

  useEffect(() => {
    getCameras();
  }, [getCameras]);

  const startCamera = useCallback(async () => {
    if (cameras.length === 0) {
      // Dá um pequeno tempo para as câmaras serem encontradas na primeira vez
      await getCameras();
    }
    if (cameras.length > 0) {
        const deviceId = cameras[activeCameraIndex]?.deviceId;
        
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: deviceId ? { exact: deviceId } : undefined,
              width: 1920,
              height: 1080,
            },
          });
          setStream(mediaStream);
          setIsActive(true);
          setError(null);
        } catch (err) {
          setError('Erro ao aceder à câmara. Por favor, verifique as permissões no seu navegador.');
          console.error('Camera error:', err);
        }
    } else {
        setError('Nenhuma câmara encontrada.');
    }
  }, [cameras, activeCameraIndex, getCameras]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsActive(false);
    }
  };

  const switchCamera = () => {
    if (cameras.length > 1) {
      const nextIndex = (activeCameraIndex + 1) % cameras.length;
      setActiveCameraIndex(nextIndex);
    }
  };
  
  useEffect(() => {
      if(isActive) {
          stopCamera();
          startCamera();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCameraIndex]);

  // AQUI ESTÁ A CORREÇÃO
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
    captureImage,
    switchCamera,
    cameras,
  };
};