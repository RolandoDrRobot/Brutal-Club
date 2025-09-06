
import { useSoundEffects } from './useAudio';

export const useButtonSound = () => {
  const { playButtonSound } = useSoundEffects();
  
  return { playButtonSound };
};
