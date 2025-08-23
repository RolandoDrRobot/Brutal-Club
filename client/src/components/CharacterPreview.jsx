import React, { useRef, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

// Individual character component for preview
function CharacterModel({ characterName, ...props }) {
  const group = useRef();
  const [isReady, setIsReady] = useState(false);
  
  // Load the appropriate model based on character name
  const getModelPath = (name) => {
    const modelMap = {
      'PETE': './models/pete.glb',
      'TYLER': './models/Tyler.glb',
      'VINCE': './models/Vince.glb',
      'BOB': './models/Bob.glb',
      'CHUCK': './models/Chuck.glb',
      'EARL': './models/Earl.glb',
      'WAYNE': './models/Wayne.glb',
      'MARLA': './models/woman.gltf'
      // ❌ REMOVED: LOU, TONY, LAWRENCE - unused legacy models
    };
    return modelMap[name] || './models/pete.glb';
  };
  
  const modelPath = getModelPath(characterName);
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
  }, [scene, characterName]); // Add characterName as dependency
  
  const { actions, names } = useAnimations(animations, group);

  // Force re-calculation when character changes
  useEffect(() => {
    setIsReady(false);
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [characterName]);

  useEffect(() => {
    if (actions && names.length > 0 && isReady) {
      let animationName;
      
      // Pete and Tyler use idleFight animation
      if (characterName === 'PETE' || characterName === 'TYLER') {
        animationName = names.find(name => 
          name.toLowerCase().includes('idlefight') || 
          name.toLowerCase().includes('idle_fight') ||
          name.toLowerCase().includes('fighting_idle')
        );
        
        // If no fighting idle found, look for general idle
        if (!animationName) {
          animationName = names.find(name => 
            name.toLowerCase().includes('idle') ||
            name.toLowerCase().includes('stance')
          );
        }
      } else {
        // Other characters use crowd animation
        animationName = names.find(name => 
          name.toLowerCase().includes('crowd') ||
          name.toLowerCase().includes('cheer') ||
          name.toLowerCase().includes('wave')
        );
        
        // If no crowd animation found, look for idle
        if (!animationName) {
          animationName = names.find(name => 
            name.toLowerCase().includes('idle') ||
            name.toLowerCase().includes('stance')
          );
        }
      }
      
      // If no specific animation found, use the first available animation
      if (!animationName) {
        animationName = names[0];
      }
      
      if (actions[animationName]) {
        // Stop all other animations first
        Object.values(actions).forEach(action => action.stop());
        
        // Play the animation in loop
        actions[animationName].reset().fadeIn(0.5).play();
        actions[animationName].setLoop(2201, Infinity); // Loop infinitely
        
        return () => {
          if (actions[animationName]) {
            actions[animationName].fadeOut(0.5);
          }
        };
      }
    }
  }, [actions, names, characterName, isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Main CharacterPreview component
const CharacterPreview = ({ characterName, style }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 383, height: 535 }); // Set default dimensions

  // Force proper dimensions calculation on mount and resize - Throttled for performance
  useLayoutEffect(() => {
    let isThrottling = false;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // Only update if we get valid dimensions that are different from current
        if (clientWidth > 50 && clientHeight > 50) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };

    // Throttled resize handler to prevent excessive calls
    const throttledUpdateDimensions = () => {
      if (!isThrottling) {
        isThrottling = true;
        requestAnimationFrame(() => {
          updateDimensions();
          isThrottling = false;
        });
      }
    };

    // Initial calculation with a small delay to ensure container is rendered
    const timer = setTimeout(() => {
      updateDimensions();
    }, 50);

    // Add throttled resize listener
    window.addEventListener('resize', throttledUpdateDimensions);

    return () => {
      window.removeEventListener('resize', throttledUpdateDimensions);
      clearTimeout(timer);
    };
  }, [characterName]);

  return (
    <div 
      ref={containerRef}
      style={{
        ...style,
        margin: 0,
        padding: 0,
        border: 'none',
        outline: 'none',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '200px',
        minHeight: '200px'
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Canvas
          key={`${characterName}-${dimensions.width}-${dimensions.height}`}
          camera={{ 
            position: [0, 1.0, 2.5], 
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
            margin: '0 auto',
            padding: 0,
            border: 'none',
            outline: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          dpr={[1, 2]}
          resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        >
          {/* Iluminación neón cálida - MENOS SEPIA, MÁS ILUMINADO */}
          <ambientLight intensity={0.4} color="#FFD099" />
          
          {/* Foco principal menos amarillento */}
          <spotLight
            position={[0, 6, 0]}
            intensity={1.2}
            angle={Math.PI / 3}
            penumbra={0.8}
            color="#FFDD88"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={15}
          />
          
          {/* Focos laterales menos saturados */}
          <spotLight
            position={[-3, 3, 2]}
            intensity={0.6}
            angle={Math.PI / 4}
            penumbra={0.9}
            color="#FFBB66"
          />
          
          <spotLight
            position={[3, 3, 2]}
            intensity={0.6}
            angle={Math.PI / 4}
            penumbra={0.9}
            color="#FFCC77"
          />
          
          {/* Ambiente trasero más claro */}
          <directionalLight
            position={[0, 2, -5]}
            intensity={0.15}
            color="#DDAA66"
          />
          
          {/* Character model - positioned lower and facing forward */}
          <group position={[0, -1.2, 0]}>
            <CharacterModel 
              characterName={characterName}
              position={[0, 0, 0]}
              rotation={[0, 0, 0]}
              scale={[1.1, 1.1, 1.1]}
            />
          </group>
        </Canvas>
      </div>
    </div>
  );
};

// Preload the models that are actually being used in the current game
useGLTF.preload('./models/pete.glb');      // Main character + opponent
useGLTF.preload('./models/Tyler.glb');     // Main opponent + purchasable character
useGLTF.preload('./models/Vince.glb');     // Purchasable character in shop
useGLTF.preload('./models/Bob.glb');       // Purchasable character in shop
useGLTF.preload('./models/Chuck.glb');     // Audience member
useGLTF.preload('./models/Earl.glb');      // Audience member
useGLTF.preload('./models/Wayne.glb');     // Audience member

// Models available but not currently used in game (loaded on-demand)
// ❌ REMOVED: Preloads for unused legacy models (Lou, Tony, Lawrence)

export default CharacterPreview; 