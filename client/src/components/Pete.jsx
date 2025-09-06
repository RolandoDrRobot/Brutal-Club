import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { LoopOnce } from "three";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

function Pete({ player = 1, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/pete.glb");
  const { 
    setAnimations, 
    animations: contextAnimations,
    player1AnimationIndex,
    player2AnimationIndex,
    isCombatMode,
    player1IsDead,
    player2IsDead
  } = useCharacterAnimations();
  
  const clonedScene = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene);
    
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material = child.material.map((mat) => {
            const newMaterial = mat.clone();
            newMaterial.roughness = 0.9;
            newMaterial.metalness = 0.05;
            return newMaterial;
          });
        } else {
          const newMaterial = child.material.clone();
          newMaterial.roughness = 0.9;
          newMaterial.metalness = 0.05;
          child.material = newMaterial;
        }
      }
    });
    
    return cloned;
  }, [scene]);
  
  const { actions, names } = useAnimations(animations, group);
  
  const currentActionRef = useRef(null);

  const currentAnimationIndex = useMemo(() => {
    return player === 1 ? player1AnimationIndex : player2AnimationIndex;
  }, [player, player1AnimationIndex, player2AnimationIndex]);

  const isPlayerDead = useMemo(() => {
    return player === 1 ? player1IsDead : player2IsDead;
  }, [player, player1IsDead, player2IsDead]);

  const isDeathAnimation = useMemo(() => {
    if (!names[currentAnimationIndex]) return false;
    const animationName = names[currentAnimationIndex].toLowerCase();
    return animationName.includes('die') || animationName.includes('death');
  }, [currentAnimationIndex, names]);

  useEffect(() => {
    if (contextAnimations.length === 0) {
      setAnimations(names);
    }
  }, [names, contextAnimations.length, setAnimations]);

  useEffect(() => {
    if (actions && names[currentAnimationIndex]) {
      const animationName = names[currentAnimationIndex];
      const action = actions[animationName];
      
      
      if (isDeathAnimation && currentActionRef.current === animationName && isPlayerDead) {
        return;
      }
      
      if (currentActionRef.current && actions[currentActionRef.current] && currentActionRef.current !== animationName) {
        actions[currentActionRef.current].fadeOut(0.3);
      }
      
      currentActionRef.current = animationName;
      
      if (isDeathAnimation) {
        
        action.reset();
        action.setLoop(LoopOnce, 1);
        action.clampWhenFinished = true;
        action.enabled = true;
        action.paused = false;
        action.fadeIn(0.3);
        action.play();
        
        const onFinished = () => {
          action.paused = true;
        };
        
        action._mixer.removeEventListener('finished', onFinished);
        action._mixer.addEventListener('finished', onFinished);
        
      } else {
        action.reset();
        action.clampWhenFinished = false;
        action.fadeIn(0.3);
        action.play();
      }
      
      return () => {
        if (actions[animationName]) {
          actions[animationName].fadeOut(0.3);
        }
      };
    }
  }, [currentAnimationIndex, actions, names, isDeathAnimation, isPlayerDead, player]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("./models/pete.glb");

export default Pete; 