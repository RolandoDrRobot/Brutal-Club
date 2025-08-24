import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BarBasement = () => {
  // Refs for flickering lights
  const flickerLight1Ref = useRef();
  const flickerLight2Ref = useRef();

  // Memoized geometries and materials for performance
  const geometries = useMemo(() => ({
    floor: new THREE.PlaneGeometry(18, 18),
    ceiling: new THREE.PlaneGeometry(18, 18),
    wall: new THREE.PlaneGeometry(18, 6),
    column: new THREE.BoxGeometry(0.8, 4, 0.8),
    // Ceiling infrastructure
    horizontalCable: new THREE.CylinderGeometry(0.03, 0.03, 12), // Long horizontal cables
    metalBar: new THREE.BoxGeometry(8, 0.1, 0.1), // Metal support bars
    cableSupport: new THREE.BoxGeometry(0.15, 0.2, 0.15), // Cable support brackets
    // Light fixtures
    lightFixture: new THREE.CylinderGeometry(0.4, 0.4, 0.3), // Main light fixture body
    lightBulb: new THREE.SphereGeometry(0.25, 8, 6), // Light bulb
    lightSocket: new THREE.CylinderGeometry(0.15, 0.15, 0.2), // Light socket
    lightCable: new THREE.CylinderGeometry(0.02, 0.02, 1.5), // Cable hanging from ceiling
    // Blood stains
    bloodStain: new THREE.CircleGeometry(0.5, 8),
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
    }),
    // Light fixture materials
    lightFixture: new THREE.MeshStandardMaterial({
      color: '#333333', // Dark metal fixture
      roughness: 0.7,
      metalness: 0.8
    }),
    lightBulb: new THREE.MeshStandardMaterial({
      color: '#ffffcc', // Warm light bulb color
      roughness: 0.1,
      metalness: 0.0
    }),
    lightSocket: new THREE.MeshStandardMaterial({
      color: '#222222', // Dark socket
      roughness: 0.8,
      metalness: 0.6
    }),
    lightCable: new THREE.MeshStandardMaterial({
      color: '#111111', // Dark cable
      roughness: 0.9,
      metalness: 0.1
    }),
    // Blood stain material
    bloodStain: new THREE.MeshStandardMaterial({
      color: '#CC0000', // Bright red blood
      roughness: 0.2,
      metalness: 0.0,
      transparent: true,
      opacity: 0.9,
    })
  }), []);

  // Generate positions for essential elements only
  const elementPositions = useMemo(() => ({
    // Support columns (closer for claustrophobia)
    columns: [
      [-5, 2, -5],
      [5, 2, -5],
      [-5, 2, 5],
      [5, 2, 5]
    ],
    
    // Horizontal ceiling cables (higher position)
    horizontalCables: [
      { pos: [-2, 3.2, 0], rot: [0, 0, Math.PI/2] }, // Cable running East-West
      { pos: [2, 3.0, 0], rot: [0, 0, Math.PI/2] },  // Parallel cable
      { pos: [0, 3.1, -3], rot: [Math.PI/2, 0, 0] }, // Cable running North-South
      { pos: [0, 2.9, 3], rot: [Math.PI/2, 0, 0] }   // Parallel cable
    ],
    
    // Metal support bars (higher position)
    metalBars: [
      { pos: [-4, 3.3, 0], rot: [0, 0, 0] },         // Horizontal bar
      { pos: [4, 3.3, 0], rot: [0, 0, 0] },          // Parallel bar
      { pos: [0, 3.2, -4], rot: [0, Math.PI/2, 0] }, // Perpendicular bar
      { pos: [0, 3.2, 4], rot: [0, Math.PI/2, 0] }   // Parallel bar
    ],
    
    // Cable support brackets (higher position)
    cableSupports: [
      { pos: [-6, 3.1, 0] }, { pos: [1, 3.1, 0] }, { pos: [6, 3.1, 0] },
      { pos: [0, 3.0, -6] }, { pos: [0, 3.0, -1] }, { pos: [0, 3.0, 6] }
    ],
    

    
    // Light fixtures positions
    lightFixtures: [
      { 
        pos: [-5, 3.8, -5], 
        cablePos: [-5, 3.2, -5],
        bulbPos: [-5, 3.5, -5],
        socketPos: [-5, 3.3, -5]
      },
      { 
        pos: [5, 3.8, 5], 
        cablePos: [5, 3.2, 5],
        bulbPos: [5, 3.5, 5],
        socketPos: [5, 3.3, 5]
      }
    ],
    
    // Blood stains (essential for fight club)
    bloodStains: [
      { pos: [1.2, -2.99, -0.8], scale: [1.5, 1.5, 1.5] },
      { pos: [-1.8, -2.99, 1.5], scale: [1.0, 1.0, 1.0] },
      { pos: [2.5, -2.99, 2.0], scale: [0.8, 0.8, 0.8] },
      { pos: [-0.5, -2.99, -2.2], scale: [1.2, 1.2, 1.2] },
      { pos: [0.8, -2.99, 2.8], scale: [0.6, 0.6, 0.6] },
    ],
    

  }), []);

  // Intense electrical flickering effect - very loose and unstable elements
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Light 1 - Subtle electrical problems with loose elements - brighter
    if (flickerLight1Ref.current) {
      const dramaticCycle = Math.sin(time * 0.4) * 0.2 + 0.8; // Less variation
      const powerSurge = Math.sin(time * 1.8) > 0.8 ? 1.2 : 0.9; // Less frequent and milder surges
      const subtleFlicker = Math.sin(time * 8) * 0.1; // Much less visible flicker
      const electricalChaos = Math.sin(time * 12) < -0.9 ? 0.7 : 1; // Less frequent electrical failures
      const looseMovement = Math.sin(time * 2) * 0.1; // Reduced loose movement
      flickerLight1Ref.current.intensity = (2.8 * dramaticCycle * powerSurge * electricalChaos) + subtleFlicker + looseMovement;
    }
    
    // Light 2 - Subtle electrical breathing with loose elements - brighter
    if (flickerLight2Ref.current) {
      const breathingBase = Math.sin(time * 1.0) * 0.2 + 0.8; // Less breathing effect
      const electricalGlitch = Math.sin(time * 20) < -0.8 ? 0.7 : 1; // Much less frequent glitches
      const subtlePulse = Math.sin(time * 5) * 0.1; // Much less noticeable pulsing
      const subtleSparking = Math.sin(time * 25) > 0.9 ? 1.1 : 0.9; // Much less frequent and milder sparks
      const looseSway = Math.sin(time * 3) * 0.08; // Reduced loose swaying
      flickerLight2Ref.current.intensity = (2.8 * breathingBase * electricalGlitch * subtleSparking) + subtlePulse + looseSway;
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
        position={[0, 3, 0]}
        receiveShadow
      />

      {/* Walls */}
      <mesh geometry={geometries.wall} material={materials.wall} position={[0, 3, -9]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[0, 3, 9]} rotation={[0, Math.PI, 0]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[-9, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[9, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow />


















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