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
  
  // Función para reproducir sonido de punch
  const playPunchSound = () => {
    if (audioRef.current) {
      // Reiniciar el audio para permitir múltiples golpes rápidos
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.7; // Appropriate volume for sound effects
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Punch sound played at animation end');
          })
          .catch(error => {
            console.log('Error playing punch sound:', error);
          });
      }
    }
  };

  // Detectar cuando se ejecuta un ataque y programar el sonido para el final
  useEffect(() => {
    if (!isCombatMode || !animations.length) return;
    
    // Limpiar timeout anterior si existe
    if (soundTimeoutRef.current) {
      clearTimeout(soundTimeoutRef.current);
      soundTimeoutRef.current = null;
    }
    
    // Obtener nombres de las animaciones actuales
    const player1AnimationName = animations[player1AnimationIndex];
    const player2AnimationName = animations[player2AnimationIndex];
    
    // Lista de animaciones de ataque que deben reproducir sonido
    const attackAnimations = ['punch', 'kick', 'punches'];
    
    // Verificar si algún jugador está ejecutando un ataque
    const player1IsAttacking = attackAnimations.includes(player1AnimationName);
    const player2IsAttacking = attackAnimations.includes(player2AnimationName);
    
    if (player1IsAttacking || player2IsAttacking) {
      const attackingAnimation = player1IsAttacking ? player1AnimationName : player2AnimationName;
      console.log(`Attack detected: ${attackingAnimation} - scheduling sound for animation end`);
      
      // Diferentes delays según el tipo de ataque para que coincida con el momento del impacto
      let delay = 800; // Delay por defecto
      
      switch(attackingAnimation) {
        case 'punch':
          delay = 600; // Punch es más rápido
          break;
        case 'kick':
          delay = 800; // Kick es mediano
          break;
        case 'punches':
          delay = 1200; // Combo es más largo
          break;
      }
      
      // Programar el sonido para que se reproduzca al final de la animación
      soundTimeoutRef.current = setTimeout(() => {
        playPunchSound();
      }, delay);
    }
    
  }, [player1AnimationIndex, player2AnimationIndex, isCombatMode, animations]);

  // Limpiar timeout al desmontar el componente
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
      onError={(e) => console.error('Error loading punch sound:', e)}
    />
  );
};

export default PunchSound; 