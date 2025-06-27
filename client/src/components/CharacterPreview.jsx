import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

// Individual character component for preview
function CharacterModel({ characterName, ...props }) {
  const group = useRef();
  
  // Load the appropriate model based on character name
  const modelPath = characterName === 'PETE' ? './models/pete.glb' : './models/Tyler.glb';
  const { scene, animations } = useGLTF(modelPath);
  
  // Clone the scene to create independent instances
  const clonedScene = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene);
    
    // Calculate bounding box for precise centering
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Center the model perfectly at origin
    cloned.position.set(-center.x, -center.y, -center.z);
    
    // Adjust position to show character from waist up, centered
    cloned.position.y = -box.min.y + (size.y * 0.1); // Slightly above ground
    
    return cloned;
  }, [scene]);
  
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && names.length > 0) {
      // Find idle fighting animation - prioritize idleFight for character selection
      let idleAnimationName = names.find(name => 
        name.toLowerCase().includes('idlefight') || 
        name.toLowerCase().includes('idle_fight') ||
        name.toLowerCase().includes('fighting_idle')
      );
      
      // If no fighting idle found, look for general idle
      if (!idleAnimationName) {
        idleAnimationName = names.find(name => 
          name.toLowerCase().includes('idle') ||
          name.toLowerCase().includes('stance')
        );
      }
      
      // If no idle animation found, use the first available animation
      if (!idleAnimationName) {
        idleAnimationName = names[0];
      }
      
      if (actions[idleAnimationName]) {
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the idle animation in loop
        actions[idleAnimationName].reset().fadeIn(0.5).play();
        actions[idleAnimationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[idleAnimationName]) {
            actions[idleAnimationName].fadeOut(0.5);
          }
        };
      }
    }
  }, [actions, names, characterName]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Main CharacterPreview component
const CharacterPreview = ({ characterName, style }) => {
  return (
    <div style={{
      ...style,
      margin: 0,
      padding: 0,
      border: 'none',
      outline: 'none',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Canvas
        camera={{ 
          position: [0, 1.2, 2.8], 
          fov: 45,
          near: 0.1,
          far: 100
        }}
        shadows
        gl={{ 
          preserveDrawingBuffer: true, 
          alpha: true,
          antialias: true 
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          border: 'none',
          outline: 'none',
          display: 'block'
        }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[2, 4, 2]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={20}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />
        <pointLight
          position={[-1, 2, 1]}
          intensity={0.3}
          color="#fc3f31"
        />
        
        {/* Character model - perfectly centered */}
        <group position={[0, -1, 0]}>
          <CharacterModel 
            characterName={characterName}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={[1.1, 1.1, 1.1]}
          />
        </group>
      </Canvas>
    </div>
  );
};

// Preload models
useGLTF.preload('./models/pete.glb');
useGLTF.preload('./models/Tyler.glb');

export default CharacterPreview; 