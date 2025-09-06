import React, { createContext, useContext, useEffect, useRef } from 'react';
import AudioManager from '../systems/AudioManager';

const AudioContext = createContext({});

export const AudioProvider = ({ children }) => {
  const audioManagerRef = useRef(null);
  
  useEffect(() => {
    audioManagerRef.current = new AudioManager();
    
    return () => {
      if (audioManagerRef.current) {
        audioManagerRef.current.cleanup();
      }
    };
  }, []);
  
  const audioManager = audioManagerRef.current;
  
  if (!audioManager) {
    return <>{children}</>;
  }
  
  const contextValue = {
    // Music controls
    playMusic: (trackId) => audioManager.playMusic(trackId),
    stopMusic: () => audioManager.stopMusic(),
    nextTrack: () => audioManager.nextTrack(),
    getCurrentTrack: () => audioManager.getCurrentTrack(),
    isTrackPlaying: () => audioManager.isTrackPlaying(),
    
    // Sound effects
    playSoundEffect: (soundId, options) => audioManager.playSoundEffect(soundId, options),
    playCombatSound: (attackType, delay) => audioManager.playCombatSound(attackType, delay),
    playButtonSound: () => audioManager.playButtonSound(),
    
    // Ambient sounds
    startCrowdSound: () => audioManager.startCrowdSound(),
    stopCrowdSound: () => audioManager.stopCrowdSound(),
    
    // Volume controls
    setMasterVolume: (volume) => audioManager.setMasterVolume(volume),
    setVolume: (id, volume) => audioManager.setVolume(id, volume),
    mute: () => audioManager.mute(),
    unmute: () => audioManager.unmute(),
    
    // Mode controls
    setCombatMode: (isCombat) => audioManager.setCombatMode(isCombat),
    
    // Direct access to manager for advanced usage
    audioManager
  };
  
  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
