import React, { useRef, useEffect, useState } from 'react';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';

const CrowdSound = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isCombatMode } = useCharacterAnimations();

  // Initialize audio when loaded
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15;
      audioRef.current.preload = 'auto';
      
      const playAudio = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          setIsPlaying(false);
          
          const enableAudioOnInteraction = () => {
            if (audioRef.current && !isPlaying) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                })
                .catch(() => {});
            }
            document.removeEventListener('click', enableAudioOnInteraction);
            document.removeEventListener('touchstart', enableAudioOnInteraction);
          };
          
          document.addEventListener('click', enableAudioOnInteraction);
          document.addEventListener('touchstart', enableAudioOnInteraction);
        }
      };

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

  // Adjust volume when mode changes
  useEffect(() => {
    if (audioRef.current) {
      const targetVolume = isCombatMode ? 0.25 : 0.1;
      
      audioRef.current.volume = targetVolume;
      
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
            audioRef.current.volume = targetVolume;
          }
        }
      }, 50);
      
      return () => clearInterval(volumeInterval);
    }
  }, [isCombatMode]);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
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