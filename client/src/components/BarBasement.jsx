import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BarBasement = () => {
  // Refs for flickering lights
  const flickerLight1Ref = useRef();
  const flickerLight2Ref = useRef();

  // Memoized geometries and materials for performance
      const geometries = useMemo(() => ({
      floor: new THREE.PlaneGeometry(25, 25),
      ceiling: new THREE.PlaneGeometry(25, 25),
      wall: new THREE.PlaneGeometry(25, 6),

    // Blood stains
    bloodStain: new THREE.CircleGeometry(0.3, 32),
  }), []);

  const materials = useMemo(() => ({
    // Basic structure materials
    floor: new THREE.MeshStandardMaterial({
      color: '#2a1f14', // Dark brown/café floor color
      roughness: 0.8,
      metalness: 0.1
    }),
    ceiling: new THREE.MeshStandardMaterial({
      color: '#1a1818',
      roughness: 0.9,
      metalness: 0.05
    }),
    wall: new THREE.MeshStandardMaterial({
      color: '#2d2822',
      roughness: 0.7,
      metalness: 0.1
    }),

    // Blood stain material
    bloodStain: new THREE.MeshStandardMaterial({
      color: '#660000', // Very dark red blood
      roughness: 0.2,
      metalness: 0.0,
      transparent: true,
      opacity: 0.9,
    })
  }), []);

  // Generate positions for essential elements only
  const elementPositions = useMemo(() => ({
    
    // Blood stains simulating a real fight pattern - expanded coverage
    bloodStains: [
      // Main impact area - where the fight is most intense
      { pos: [0.0, -2.99, 0.0], scale: [3.2, 3.2, 3.2] }, // Central large pool
      { pos: [0.4, -2.99, -0.3], scale: [1.8, 1.8, 1.8] }, // Splatter from main pool
      { pos: [-0.3, -2.99, 0.5], scale: [1.6, 1.6, 1.6] }, // Another splatter
      
      // Extended blood trails from movement during the fight
      { pos: [1.2, -2.99, 0.8], scale: [1.1, 1.1, 1.1] }, // Trail 1
      { pos: [1.8, -2.99, 0.4], scale: [0.9, 0.9, 0.9] }, // Trail 2
      { pos: [-1.2, -2.99, -1.0], scale: [1.3, 1.3, 1.3] }, // Trail 3
      { pos: [-1.6, -2.99, -0.6], scale: [1.0, 1.0, 1.0] }, // Trail 4
      { pos: [2.0, -2.99, -0.8], scale: [1.2, 1.2, 1.2] }, // Trail 5
      { pos: [-2.0, -2.99, 0.8], scale: [1.1, 1.1, 1.1] }, // Trail 6
      
      // Impact splatters from punches/kicks - expanded area
      { pos: [0.8, -2.99, -0.8], scale: [1.4, 1.4, 1.4] }, // Impact 1
      { pos: [-0.6, -2.99, 1.2], scale: [1.2, 1.2, 1.2] }, // Impact 2
      { pos: [1.4, -2.99, -0.4], scale: [1.1, 1.1, 1.1] }, // Impact 3
      { pos: [-1.0, -2.99, 0.4], scale: [1.3, 1.3, 1.3] }, // Impact 4
      { pos: [0.6, -2.99, 1.4], scale: [1.0, 1.0, 1.0] }, // Impact 5
      { pos: [-0.8, -2.99, -1.2], scale: [1.2, 1.2, 1.2] }, // Impact 6
      
      // Smaller drops from movement and sweat - wider distribution
      { pos: [0.4, -2.99, 0.8], scale: [0.8, 0.8, 0.8] }, // Drop 1
      { pos: [-0.5, -2.99, -0.8], scale: [0.7, 0.7, 0.7] }, // Drop 2
      { pos: [1.0, -2.99, 0.2], scale: [0.9, 0.9, 0.9] }, // Drop 3
      { pos: [-0.2, -2.99, -1.4], scale: [0.8, 0.8, 0.8] }, // Drop 4
      { pos: [0.8, -2.99, -0.6], scale: [0.7, 0.7, 0.7] }, // Drop 5
      { pos: [-1.4, -2.99, 0.2], scale: [0.6, 0.6, 0.6] }, // Drop 6
      { pos: [1.6, -2.99, 0.6], scale: [0.8, 0.8, 0.8] }, // Drop 7
      { pos: [-0.4, -2.99, 1.6], scale: [0.7, 0.7, 0.7] }, // Drop 8
      { pos: [0.2, -2.99, -1.0], scale: [0.6, 0.6, 0.6] }, // Drop 9
      { pos: [-1.8, -2.99, -0.2], scale: [0.8, 0.8, 0.8] }, // Drop 10
    ],
    

  }), []);

  // Electrical flickering effect for basement atmosphere
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Light 1 - Electrical problems with dramatic flickering
    if (flickerLight1Ref.current) {
      const dramaticCycle = Math.sin(time * 0.3) * 0.3 + 0.7; // Base flickering
      const powerSurge = Math.sin(time * 2.5) > 0.8 ? 1.4 : 0.8; // Power surges
      const electricalGlitch = Math.sin(time * 15) < -0.9 ? 0.5 : 1; // Electrical failures
      const subtleFlicker = Math.sin(time * 12) * 0.2; // Rapid flickering
      flickerLight1Ref.current.intensity = (2.8 * dramaticCycle * powerSurge * electricalGlitch) + subtleFlicker;
    }
    
    // Light 2 - Different electrical pattern for variety
    if (flickerLight2Ref.current) {
      const breathingBase = Math.sin(time * 0.8) * 0.2 + 0.8; // Breathing effect
      const electricalChaos = Math.sin(time * 18) < -0.8 ? 0.6 : 1; // Different electrical failures
      const powerSpike = Math.sin(time * 3.2) > 0.9 ? 1.3 : 0.9; // Power spikes
      const rapidFlicker = Math.sin(time * 20) * 0.15; // Rapid flickering
      flickerLight2Ref.current.intensity = (2.8 * breathingBase * electricalChaos * powerSpike) + rapidFlicker;
    }
  });

  return (
    <group scale={[0.4, 0.4, 0.4]}>



      {/* Ceiling */}
      <mesh 
        geometry={geometries.ceiling} 
        material={materials.ceiling}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 3, 0]}
        receiveShadow
      />

      {/* Walls */}
      <mesh geometry={geometries.wall} material={materials.wall} position={[0, 0.5, -12.5]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[0, 0.5, 12.5]} rotation={[0, Math.PI, 0]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[-12.5, 0.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[12.5, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow />

      {/* Blood stains on the floor */}
      {elementPositions.bloodStains.map((stain, index) => (
        <mesh
          key={`blood-stain-${index}`}
          geometry={geometries.bloodStain}
          material={materials.bloodStain}
          position={stain.pos}
          scale={stain.scale}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        />
      ))}


















      {/* ATMOSPHERIC FOG INSIDE BASEMENT */}
      <fog attach="fog" args={['#2a2318', 1.5, 8]} />

      {/* BRIGHTER TAVERN BASEMENT LIGHTING SYSTEM */}
      {/* Brighter ambient light */}
      <ambientLight intensity={0.45} color="#4d4538" />
      
      {/* Main overhead lighting - brighter */}
      <directionalLight
        position={[0, 8, 0]}
        intensity={0.85}
        color="#6a5d46"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
      />

      {/* Fixed ceiling spotlights for ambient lighting - brighter */}
      <spotLight
        ref={flickerLight1Ref}
        position={[-5, 3.8, -5]}
        intensity={2.8}
        angle={0.8}
        penumbra={0.6}
        color="#ccaa66"
        castShadow
        target-position={[0, 0, 0]}
      />
      
      <spotLight
        ref={flickerLight2Ref}
        position={[5, 3.8, 5]}
        intensity={2.8}
        angle={0.8}
        penumbra={0.6}
        color="#ccaa66"
        castShadow
        target-position={[0, 0, 0]}
      />

      {/* Additional atmospheric lighting - brighter */}
      <directionalLight
        position={[-8, 3, 0]}
        intensity={0.35}
        color="#665544"
      />
      
      <directionalLight
        position={[8, 3, 0]}
        intensity={0.3}
        color="#665544"
      />

      {/* Rim lighting for atmosphere - brighter */}
      <directionalLight
        position={[0, 1, -12]}
        intensity={0.2}
        color="#554433"
      />
      
      <directionalLight
        position={[0, 1, 12]}
        intensity={0.2}
        color="#554433"
      />

      {/* Underground atmosphere */}
      <directionalLight
        position={[0, -1, 0]}
        intensity={0.08}
        color="#332211"
      />
    </group>
  );
};

export default BarBasement;