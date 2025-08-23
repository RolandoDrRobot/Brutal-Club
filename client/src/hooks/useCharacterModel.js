import { useMemo, useRef, useEffect } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

export const useCharacterModel = (modelPath, options = {}) => {
  const { 
    enableCloning = true,
    setupAnimations = true,
    onAnimationsReady 
  } = options;

  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);

  // Clone the scene to create independent instances
  const clonedScene = useMemo(() => {
    if (!enableCloning) return scene;
    return SkeletonUtils.clone(scene);
  }, [scene, enableCloning]);

  // Set up animations
  const { actions, names } = useAnimations(setupAnimations ? animations : [], group);

  // Notify when animations are ready
  useEffect(() => {
    if (onAnimationsReady && names.length > 0) {
      onAnimationsReady(names);
    }
  }, [names, onAnimationsReady]);

  return {
    group,
    scene: clonedScene,
    animations,
    actions,
    names
  };
}; 