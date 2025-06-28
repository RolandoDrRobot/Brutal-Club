import React, { useRef, useEffect, useState } from 'react';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';

const CrowdSound = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isCombatMode } = useCharacterAnimations();

  // Inicializar el audio cuando se carga
  useEffect(() => {
    if (audioRef.current) {
      // Configurar el audio para loop
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15; // Reduced initial volume
      audioRef.current.preload = 'auto';
      
      // Función para intentar reproducir
      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          console.log('Sonido de audiencia iniciado');
        } catch (error) {
          console.log('Auto-play de sonido de audiencia bloqueado:', error);
          setIsPlaying(false);
          
          // Intentar reproducir cuando el usuario interactúe con la página
          const enableAudioOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  console.log('Sonido de audiencia iniciado tras interacción');
                })
                .catch(console.error);
            }
            // Remover el listener después del primer uso
            document.removeEventListener('click', enableAudioOnInteraction);
            document.removeEventListener('touchstart', enableAudioOnInteraction);
          };
          
          document.addEventListener('click', enableAudioOnInteraction);
          document.addEventListener('touchstart', enableAudioOnInteraction);
        }
      };

      // Pequeño delay para asegurar que el audio esté listo
      const timer = setTimeout(() => {
        if (isLoaded) {
          playAudio();
        }
      }, 1500);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoaded, isPlaying]);

  // Adjust volume when mode changes - CORRECTED
  useEffect(() => {
    if (audioRef.current) {
      // Volumes balanced with the main music
      const targetVolume = isCombatMode ? 0.25 : 0.1;
      
      console.log(`Changing crowd volume to ${targetVolume} (Mode: ${isCombatMode ? 'Combat' : 'Dance'})`);
      
      // Apply the volume immediately
      audioRef.current.volume = targetVolume;
      
      // También hacer transición suave
      const currentVolume = audioRef.current.volume;
      const volumeStep = (targetVolume - currentVolume) / 10;
      
      let step = 0;
      const volumeInterval = setInterval(() => {
        if (step < 10 && audioRef.current) {
          const newVolume = Math.max(0, Math.min(1, currentVolume + (volumeStep * step)));
          audioRef.current.volume = newVolume;
          step++;
        } else {
          clearInterval(volumeInterval);
          if (audioRef.current) {
            audioRef.current.volume = targetVolume; // Ensure final volume
          }
        }
      }, 50);
      
      return () => clearInterval(volumeInterval);
    }
  }, [isCombatMode]); // Remover dependencia de isPlaying para que siempre se ejecute

  const handleLoadedData = () => {
    setIsLoaded(true);
    console.log('Sonido de audiencia cargado');
  };

  const handleError = (e) => {
    console.error('Error cargando sonido de audiencia:', e);
    setIsLoaded(false);
    setIsPlaying(false);
  };

  return (
    <audio
      ref={audioRef}
      src="/music/crowd.mp3"
      loop={true}
      preload="auto"
      style={{ display: 'none' }}
      onLoadedData={handleLoadedData}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onError={handleError}
      onCanPlayThrough={() => setIsLoaded(true)}
    />
  );
};

export default CrowdSound; 