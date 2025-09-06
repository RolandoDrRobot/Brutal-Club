import React, { useEffect } from 'react';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useSoundEffects } from '../hooks/useAudio';

const PunchSound = () => {
  const { playCombatSound } = useSoundEffects();
  const { 
    player1AnimationIndex, 
    player2AnimationIndex, 
    isCombatMode,
    animations 
  } = useCharacterAnimations();

  useEffect(() => {
    if (!isCombatMode || !animations.length) return;
    
    const player1AnimationName = animations[player1AnimationIndex];
    const player2AnimationName = animations[player2AnimationIndex];
    
    const attackAnimations = ['punch', 'kick', 'punches'];
    
    const player1IsAttacking = attackAnimations.includes(player1AnimationName);
    const player2IsAttacking = attackAnimations.includes(player2AnimationName);
    
    if (player1IsAttacking || player2IsAttacking) {
      const attackingAnimation = player1IsAttacking ? player1AnimationName : player2AnimationName;
      playCombatSound(attackingAnimation);
    }
    
  }, [player1AnimationIndex, player2AnimationIndex, isCombatMode, animations, playCombatSound]);

  return null;
};

export default PunchSound; 