import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";

function Tyler({ player = 2, ...props }) {
  const group = useRef();
  const { scene, animations } = useGLTF("./models/Tyler.glb");
  const { 
    setAnimations, 
    animations: contextAnimations,
    player1AnimationIndex,
    player2AnimationIndex,
    isCombatMode
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

  const findTylerAnimationIndex = (animationName) => {
    
    const index = names.findIndex(anim => anim === animationName);
    if (index >= 0) {
      return index;
    }
    
    const fallbackIndex = names.findIndex(anim => 
      anim.toLowerCase().includes(animationName.toLowerCase())
    );
    
    if (fallbackIndex >= 0) {
    } else {
    }
    
    return fallbackIndex >= 0 ? fallbackIndex : 0;
  };

  const getTylerAnimationFromPeteIndex = (peteIndex) => {
    if (!contextAnimations || contextAnimations.length === 0 || !names || names.length === 0) {
      return 0;
    }

    const peteAnimationName = contextAnimations[peteIndex];
    if (!peteAnimationName) {
      return 0;
    }


    const tylerIndex = findTylerAnimationIndex(peteAnimationName);
    
    
    return tylerIndex;
  };

  const currentTylerAnimationIndex = useMemo(() => {
    const playerAnimationIndex = player === 1 ? player1AnimationIndex : player2AnimationIndex;
    const result = getTylerAnimationFromPeteIndex(playerAnimationIndex);
    return result;
  }, [player, player1AnimationIndex, player2AnimationIndex, contextAnimations, names]);

  useEffect(() => {
    if (names.length > 0) {
      
      const criticalAnimations = ['idleFight', 'hurt', 'kick', 'punch', 'die', 'cover'];
      criticalAnimations.forEach(anim => {
        const hasAnim = names.some(name => name.toLowerCase().includes(anim.toLowerCase()));
      });
    }
  }, [names]);

  useEffect(() => {
    if (actions && names[currentTylerAnimationIndex]) {
      const animationName = names[currentTylerAnimationIndex];
      const playerAnimationIndex = player === 1 ? player1AnimationIndex : player2AnimationIndex;
      
      
      if (contextAnimations[playerAnimationIndex] === 'idleFight') {
        if (animationName.toLowerCase().includes('hurt')) {
        }
      }
      
      actions[animationName].reset().fadeIn(0.5).play();
      return () => {
        if (actions[animationName]) {
          actions[animationName].fadeOut(0.5);
        }
      };
    } else if (actions && names.length > 0) {
      actions[names[0]].reset().fadeIn(0.5).play();
      return () => {
        if (actions[names[0]]) {
          actions[names[0]].fadeOut(0.5);
        }
      };
    }
  }, [currentTylerAnimationIndex, actions, names, player, player1AnimationIndex, player2AnimationIndex, contextAnimations]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("./models/Tyler.glb");

export default Tyler; 