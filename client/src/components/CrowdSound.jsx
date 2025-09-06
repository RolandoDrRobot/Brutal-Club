import React, { useEffect } from 'react';
import { useAmbientAudio } from '../hooks/useAudio';

const CrowdSound = () => {
  const { startCrowdSound } = useAmbientAudio();

  useEffect(() => {
    const timer = setTimeout(() => {
      startCrowdSound();
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [startCrowdSound]);

  return null;
};

export default CrowdSound; 