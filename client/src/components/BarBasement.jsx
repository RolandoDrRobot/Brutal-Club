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
    wall: new THREE.PlaneGeometry(25, 8),
    column: new THREE.BoxGeometry(0.8, 4, 0.8),
    // Ceiling infrastructure
    horizontalCable: new THREE.CylinderGeometry(0.03, 0.03, 12), // Long horizontal cables
    metalBar: new THREE.BoxGeometry(8, 0.1, 0.1), // Metal support bars
    cableSupport: new THREE.BoxGeometry(0.15, 0.2, 0.15) // Cable support brackets
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
    column: new THREE.MeshStandardMaterial({
      color: '#3d2a25',
      roughness: 0.6,
      metalness: 0.2
    }),
    // Ceiling infrastructure materials
    cable: new THREE.MeshStandardMaterial({
      color: '#222222', // Dark cable color
      roughness: 0.8,
      metalness: 0.1
    }),
    metalBar: new THREE.MeshStandardMaterial({
      color: '#444444', // Dark metal
      roughness: 0.6,
      metalness: 0.7
    }),
    cableSupport: new THREE.MeshStandardMaterial({
      color: '#333333', // Dark support brackets
      roughness: 0.7,
      metalness: 0.5
    })
  }), []);

  // Generate positions for essential elements only
  const elementPositions = useMemo(() => ({
    // Support columns
    columns: [
      [-7, 2, -7],
      [7, 2, -7],
      [-7, 2, 7],
      [7, 2, 7]
    ],
    
    // Horizontal ceiling cables
    horizontalCables: [
      { pos: [-3, 3.8, 0], rot: [0, 0, Math.PI/2] }, // Cable running East-West
      { pos: [3, 3.6, 0], rot: [0, 0, Math.PI/2] },  // Parallel cable
      { pos: [0, 3.7, -4], rot: [Math.PI/2, 0, 0] }, // Cable running North-South
      { pos: [0, 3.5, 4], rot: [Math.PI/2, 0, 0] }   // Parallel cable
    ],
    
    // Metal support bars
    metalBars: [
      { pos: [-6, 3.9, 0], rot: [0, 0, 0] },         // Horizontal bar
      { pos: [6, 3.9, 0], rot: [0, 0, 0] },          // Parallel bar
      { pos: [0, 3.8, -6], rot: [0, Math.PI/2, 0] }, // Perpendicular bar
      { pos: [0, 3.8, 6], rot: [0, Math.PI/2, 0] }   // Parallel bar
    ],
    
    // Cable support brackets
    cableSupports: [
      { pos: [-8, 3.7, 0] }, { pos: [2, 3.7, 0] }, { pos: [8, 3.7, 0] },
      { pos: [0, 3.6, -8] }, { pos: [0, 3.6, -2] }, { pos: [0, 3.6, 8] }
    ]
  }), []);

  // Noticeable electrical flickering effect - electrical problems but not annoying
  useFrame((state) => {
    // Skip frames for better performance
    if (Math.floor(state.clock.getElapsedTime() * 60) % 2 !== 0) return;
    
    const time = state.clock.getElapsedTime();
    
    // Light 1 - More noticeable electrical problems
    if (flickerLight1Ref.current) {
      const dramaticCycle = Math.sin(time * 0.4) * 0.25 + 0.75; // More variation
      const powerSurge = Math.sin(time * 1.8) > 0.75 ? 1.3 : 1; // More frequent surges
      const coolFlicker = Math.sin(time * 8) * 0.15; // More visible flicker
      const electricalChaos = Math.sin(time * 15) < -0.85 ? 0.5 : 1; // More electrical failures
      flickerLight1Ref.current.intensity = (2.0 * dramaticCycle * powerSurge * electricalChaos) + coolFlicker;
    }
    
    // Light 2 - More dramatic electrical breathing
    if (flickerLight2Ref.current) {
      const breathingBase = Math.sin(time * 1.0) * 0.2 + 0.8; // More breathing effect
      const electricalGlitch = Math.sin(time * 7) < -0.8 ? 0.7 : 1; // More frequent glitches
      const subtlePulse = Math.sin(time * 5) * 0.12; // More noticeable pulsing
      const sparking = Math.sin(time * 12) > 0.92 ? 1.2 : 1; // More frequent sparks
      flickerLight2Ref.current.intensity = (2.0 * breathingBase * electricalGlitch * sparking) + subtlePulse;
    }
  });

  return (
    <group scale={[0.4, 0.4, 0.4]}>

      {/* Floor - Dark brown/café */}
      <mesh 
        geometry={geometries.floor} 
        material={materials.floor}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.5, 0]} 
        receiveShadow
      />

      {/* Ceiling */}
      <mesh 
        geometry={geometries.ceiling} 
        material={materials.ceiling}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 4, 0]}
        receiveShadow
      />

      {/* Walls */}
      <mesh geometry={geometries.wall} material={materials.wall} position={[0, 4, -12.5]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[0, 4, 12.5]} rotation={[0, Math.PI, 0]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[-12.5, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[12.5, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow />

      {/* Support columns */}
      {elementPositions.columns.map((pos, index) => (
        <mesh
          key={`column-${index}`}
          geometry={geometries.column}
          material={materials.column}
          position={pos}
          castShadow
          receiveShadow
        />
      ))}



      {/* Horizontal ceiling cables */}
      {elementPositions.horizontalCables.map((cable, index) => (
        <mesh
          key={`horizontal-cable-${index}`}
          geometry={geometries.horizontalCable}
          material={materials.cable}
          position={cable.pos}
          rotation={cable.rot}
          castShadow
        />
      ))}

      {/* Metal support bars */}
      {elementPositions.metalBars.map((bar, index) => (
        <mesh
          key={`metal-bar-${index}`}
          geometry={geometries.metalBar}
          material={materials.metalBar}
          position={bar.pos}
          rotation={bar.rot}
          castShadow
        />
      ))}

      {/* Cable support brackets */}
      {elementPositions.cableSupports.map((support, index) => (
        <mesh
          key={`cable-support-${index}`}
          geometry={geometries.cableSupport}
          material={materials.cableSupport}
          position={support.pos}
          castShadow
        />
      ))}

      {/* ATMOSPHERIC FOG INSIDE BASEMENT */}
      <fog attach="fog" args={['#2a2318', 1.5, 8]} />

      {/* DARK TAVERN BASEMENT LIGHTING SYSTEM */}
      {/* Dark ambient light */}
      <ambientLight intensity={0.22} color="#3d3529" />
      
      {/* Main overhead lighting */}
      <directionalLight
        position={[0, 8, 0]}
        intensity={0.55}
        color="#5a4d36"
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

      {/* Fixed ceiling spotlights for ambient lighting */}
      <spotLight
        ref={flickerLight1Ref}
        position={[-5, 3.8, -5]}
        intensity={2.0}
        angle={0.8}
        penumbra={0.6}
        color="#bb9955"
        castShadow
        target-position={[0, 0, 0]}
      />
      
      <spotLight
        ref={flickerLight2Ref}
        position={[5, 3.8, 5]}
        intensity={2.0}
        angle={0.8}
        penumbra={0.6}
        color="#bb9955"
        castShadow
        target-position={[0, 0, 0]}
      />

      {/* Additional atmospheric lighting */}
      <directionalLight
        position={[-8, 3, 0]}
        intensity={0.15}
        color="#554433"
      />
      
      <directionalLight
        position={[8, 3, 0]}
        intensity={0.15}
        color="#554433"
      />

      {/* Rim lighting for atmosphere */}
      <directionalLight
        position={[0, 1, -12]}
        intensity={0.1}
        color="#443322"
      />
      
      <directionalLight
        position={[0, 1, 12]}
        intensity={0.1}
        color="#443322"
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