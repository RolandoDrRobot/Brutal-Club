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
    lightBulb: new THREE.SphereGeometry(0.15, 8, 6),
    lightShade: new THREE.ConeGeometry(0.4, 0.6, 8)
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
    // Lighting materials
    lightBulb: new THREE.MeshStandardMaterial({
      color: '#ffcc77',
      roughness: 0.1,
      metalness: 0.1,
      emissive: '#dd4422',
      emissiveIntensity: 0.15
    }),
    lightShade: new THREE.MeshStandardMaterial({
      color: '#664433',
      roughness: 0.4,
      metalness: 0.2,
      transparent: true,
      opacity: 0.7
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
    
    // Hanging lights
    hangingLights: [
      { pos: [-5, 3.2, -5], shade: [-5, 2.8, -5] },
      { pos: [5, 3.2, -5], shade: [5, 2.8, -5] },
      { pos: [-5, 3.2, 5], shade: [-5, 2.8, 5] },
      { pos: [5, 3.2, 5], shade: [5, 2.8, 5] }
    ]
  }), []);

  // Subtle electrical flickering effect
  useFrame((state) => {
    // Skip frames for better performance
    if (Math.floor(state.clock.getElapsedTime() * 60) % 3 !== 0) return;
    
    const time = state.clock.getElapsedTime();
    
    // Light 1 - Subtle flickering
    if (flickerLight1Ref.current) {
      const dramaticCycle = Math.sin(time * 0.3) * 0.15 + 0.85;
      const powerSurge = Math.sin(time * 1.5) > 0.85 ? 1.15 : 1;
      const coolFlicker = Math.sin(time * 6) * 0.08;
      const electricalChaos = Math.sin(time * 12) < -0.95 ? 0.7 : 1;
      flickerLight1Ref.current.intensity = (2.0 * dramaticCycle * powerSurge * electricalChaos) + coolFlicker;
    }
    
    // Light 2 - Subtle breathing effect
    if (flickerLight2Ref.current) {
      const breathingBase = Math.sin(time * 0.8) * 0.12 + 0.88;
      const electricalGlitch = Math.sin(time * 6) < -0.9 ? 0.85 : 1;
      const subtlePulse = Math.sin(time * 4) * 0.06;
      const sparking = Math.sin(time * 10) > 0.98 ? 1.1 : 1;
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

      {/* Hanging lights */}
      {elementPositions.hangingLights.map((light, index) => (
        <group key={`light-${index}`}>
          <mesh
            geometry={geometries.lightBulb}
            material={materials.lightBulb}
            position={light.pos}
            castShadow
          />
          <mesh
            geometry={geometries.lightShade}
            material={materials.lightShade}
            position={light.shade}
            castShadow
          />
        </group>
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

      {/* Hanging tavern lights with flickering */}
      {elementPositions.hangingLights.map((light, index) => (
        <spotLight
          key={`spot-${index}`}
          ref={index === 0 ? flickerLight1Ref : index === 1 ? flickerLight2Ref : null}
          position={[light.pos[0], light.pos[1] - 0.2, light.pos[2]]}
          intensity={2.0}
          angle={0.8}
          penumbra={0.6}
          color="#bb9955"
          castShadow
          target-position={[light.pos[0], 0, light.pos[2]]}
        />
      ))}

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