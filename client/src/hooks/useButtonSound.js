import { useCallback } from 'react';

export const useButtonSound = () => {
  const playButtonSound = useCallback(() => {
    try {
      const audio = new Audio('/music/button.mp3');
      audio.volume = 0.7; // Ajustar volumen al 70%
      audio.currentTime = 0; // Reiniciar desde el inicio
      audio.play().catch(error => {
        console.log('Error playing button sound:', error);
      });
    } catch (error) {
      console.log('Error creating button sound:', error);
    }
  }, []);

  return { playButtonSound };
}; 