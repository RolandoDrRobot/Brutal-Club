import { useCallback } from 'react';

export const useButtonSound = () => {
  const playButtonSound = () => {
    try {
      const audio = new Audio('/music/button.mp3');
      audio.volume = 0.3;
      audio.play();
    } catch (error) {
    }
  };

  return { playButtonSound };
};

try {
  new Audio('/music/button.mp3');
} catch (error) {

} 