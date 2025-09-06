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

  const clonedScene = useMemo(() => {
    if (!enableCloning) return scene;
    return SkeletonUtils.clone(scene);
  }, [scene, enableCloning]);

  const { actions, names } = useAnimations(setupAnimations ? animations : [], group);

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