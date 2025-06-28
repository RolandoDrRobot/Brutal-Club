import { useCallback } from 'react';

export const useButtonSound = () => {
  const playButtonSound = useCallback(() => {
    try {
      const audio = new Audio('/music/button.mp3');
      audio.volume = 0.7; // Set volume to 70%
      audio.currentTime = 0; // Restart from the beginning
      audio.play().catch(error => {
        console.log('Error playing button sound:', error);
      });
    } catch (error) {
      console.log('Error creating button sound:', error);
    }
  }, []);

  return { playButtonSound };
}; 