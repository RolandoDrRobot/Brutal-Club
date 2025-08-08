import { useCallback } from 'react';

export const useButtonSound = () => {
  const playButtonSound = () => {
    try {
      const audio = new Audio('/music/button.mp3');
      audio.volume = 0.3;
      audio.play();
    } catch (error) {
      // Silent error handling
    }
  };

  return { playButtonSound };
};

try {
  // Preload button sound
  new Audio('/music/button.mp3');
} catch (error) {
  // Silent error handling
} 