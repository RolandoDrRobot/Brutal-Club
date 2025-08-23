import React, { useRef, useEffect } from 'react';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';

const PunchSound = () => {
  const audioRef = useRef(null);
  const soundTimeoutRef = useRef(null);
  const { 
    player1AnimationIndex, 
    player2AnimationIndex, 
    isCombatMode,
    animations 
  } = useCharacterAnimations();
  
  // Function to play punch sound
  const playPunchSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.7;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {})
          .catch(() => {});
      }
    }
  };

  // Detect when an attack is executed and schedule sound for the end
  useEffect(() => {
    if (!isCombatMode || !animations.length) return;
    
    if (soundTimeoutRef.current) {
      clearTimeout(soundTimeoutRef.current);
      soundTimeoutRef.current = null;
    }
    
    const player1AnimationName = animations[player1AnimationIndex];
    const player2AnimationName = animations[player2AnimationIndex];
    
    const attackAnimations = ['punch', 'kick', 'punches'];
    
    const player1IsAttacking = attackAnimations.includes(player1AnimationName);
    const player2IsAttacking = attackAnimations.includes(player2AnimationName);
    
    if (player1IsAttacking || player2IsAttacking) {
      const attackingAnimation = player1IsAttacking ? player1AnimationName : player2AnimationName;
      
      let delay = 800;
      
      switch(attackingAnimation) {
        case 'punch':
          delay = 600;
          break;
        case 'kick':
          delay = 800;
          break;
        case 'punches':
          delay = 1200;
          break;
      }
      
      soundTimeoutRef.current = setTimeout(() => {
        playPunchSound();
      }, delay);
    }
    
  }, [player1AnimationIndex, player2AnimationIndex, isCombatMode, animations]);

  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (soundTimeoutRef.current) {
        clearTimeout(soundTimeoutRef.current);
      }
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/music/punch.mp3"
      preload="auto"
      style={{ display: 'none' }}
      onError={() => {}}
    />
  );
};

export default PunchSound; 