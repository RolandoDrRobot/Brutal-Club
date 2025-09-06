import { useAudio as useAudioContext } from '../contexts/AudioContext';

export const useAudio = () => {
  return useAudioContext();
};

export const useMusic = () => {
  const { 
    playMusic, 
    stopMusic, 
    nextTrack, 
    getCurrentTrack, 
    isTrackPlaying,
    setCombatMode 
  } = useAudioContext();
  
  return {
    playMusic,
    stopMusic,
    nextTrack,
    getCurrentTrack,
    isTrackPlaying,
    setCombatMode
  };
};

export const useSoundEffects = () => {
  const { 
    playSoundEffect, 
    playCombatSound, 
    playButtonSound 
  } = useAudioContext();
  
  return {
    playSoundEffect,
    playCombatSound,
    playButtonSound
  };
};

export const useAmbientAudio = () => {
  const { 
    startCrowdSound, 
    stopCrowdSound 
  } = useAudioContext();
  
  return {
    startCrowdSound,
    stopCrowdSound
  };
};

export const useAudioControls = () => {
  const { 
    setMasterVolume, 
    setVolume, 
    mute, 
    unmute 
  } = useAudioContext();
  
  return {
    setMasterVolume,
    setVolume,
    mute,
    unmute
  };
};
