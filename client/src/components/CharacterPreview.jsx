import React, { useRef, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

function CharacterModel({ characterName, ...props }) {
  const group = useRef();
  const [isReady, setIsReady] = useState(false);
  
  const getModelPath = (name) => {
    const modelMap = {
      'PETE': './models/pete.glb',
      'TYLER': './models/Tyler.glb',
      'TYPER': './models/Tyler.glb',
      'TAYLER': './models/Tyler.glb',
      'VINCE': './models/Vince.glb',
      'BOB': './models/Bob.glb',
      'CHUCK': './models/Chuck.glb',
      'EARL': './models/Earl.glb',
      'WAYNE': './models/Wayne.glb',
      'MARLA': './models/woman.gltf'
    };
    return modelMap[name] || './models/pete.glb';
  };
  
  const modelPath = getModelPath(characterName);
  const { scene, animations } = useGLTF(modelPath);
  
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
    
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    cloned.position.set(-center.x, -center.y, -center.z);
    
    cloned.position.y = -box.min.y + (size.y * 0.1);
    
    return cloned;
  }, [scene, characterName]);
  
  const { actions, names } = useAnimations(animations, group);

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
      
      if (characterName === 'PETE' || characterName === 'TYLER') {
        animationName = names.find(name => 
          name.toLowerCase().includes('idlefight') || 
          name.toLowerCase().includes('idle_fight') ||
          name.toLowerCase().includes('fighting_idle')
        );
        
        if (!animationName) {
          animationName = names.find(name => 
            name.toLowerCase().includes('idle') ||
            name.toLowerCase().includes('stance')
          );
        }
      } else {
        animationName = names.find(name => 
          name.toLowerCase().includes('crowd') ||
          name.toLowerCase().includes('cheer') ||
          name.toLowerCase().includes('wave')
        );
        
        if (!animationName) {
          animationName = names.find(name => 
            name.toLowerCase().includes('idle') ||
            name.toLowerCase().includes('stance')
          );
        }
      }
      
      if (!animationName) {
        animationName = names[0];
      }
      
      if (actions[animationName]) {
        Object.values(actions).forEach(action => action.stop());
        
        actions[animationName].reset().fadeIn(0.5).play();
        actions[animationName].setLoop(2201, Infinity);
        
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

const CharacterPreview = ({ characterName, style }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 383, height: 535 });

  useLayoutEffect(() => {
    let isThrottling = false;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 50 && clientHeight > 50) {
          setDimensions({ width: clientWidth, height: clientHeight });
        }
      }
    };

    const throttledUpdateDimensions = () => {
      if (!isThrottling) {
        isThrottling = true;
        requestAnimationFrame(() => {
          updateDimensions();
          isThrottling = false;
        });
      }
    };

    const timer = setTimeout(() => {
      updateDimensions();
    }, 50);

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
          <ambientLight intensity={0.6} color="#5a7a9a" />
          
          {/* Foco principal menos amarillento */}
          <spotLight
            position={[0, 6, 0]}
            intensity={1.6}
            angle={Math.PI / 3}
            penumbra={0.8}
            color="#5a7a9a"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={1}
            shadow-camera-far={15}
          />
          
          {/* Focos laterales menos saturados */}
          <spotLight
            position={[-3, 3, 2]}
            intensity={0.8}
            angle={Math.PI / 4}
            penumbra={0.9}
            color="#4a6a8a"
          />
          
          <spotLight
            position={[3, 3, 2]}
            intensity={0.8}
            angle={Math.PI / 4}
            penumbra={0.9}
            color="#5a7a9a"
          />
          
          {/* Ambiente trasero más claro */}
          <directionalLight
            position={[0, 2, -5]}
            intensity={0.25}
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

useGLTF.preload('./models/pete.glb');
useGLTF.preload('./models/Tyler.glb');
useGLTF.preload('./models/Vince.glb');
useGLTF.preload('./models/Bob.glb');
useGLTF.preload('./models/Chuck.glb');
useGLTF.preload('./models/Earl.glb');
useGLTF.preload('./models/Wayne.glb');


export default CharacterPreview; 