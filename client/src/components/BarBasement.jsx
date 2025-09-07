import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BarBasement = () => {
  const flickerLight1Ref = useRef();
  const flickerLight2Ref = useRef();
      const geometries = useMemo(() => ({
      floor: new THREE.PlaneGeometry(25, 25),
      ceiling: new THREE.PlaneGeometry(25, 25),
      wall: new THREE.PlaneGeometry(25, 6),

    bloodStain: new THREE.CircleGeometry(0.3, 32),
    box: new THREE.BoxGeometry(1.2, 1.2, 1.2),
    smallBox: new THREE.BoxGeometry(0.8, 0.8, 0.8),
    crate: new THREE.BoxGeometry(1.5, 1.0, 1.0),
    barrel: new THREE.CylinderGeometry(0.6, 0.6, 2.2, 8),
    lightBulb: new THREE.SphereGeometry(0.15, 16, 12),
    lightSocket: new THREE.CylinderGeometry(0.1, 0.12, 0.2, 8),
    lightCable: new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6),
    buildingPipe: new THREE.CylinderGeometry(0.08, 0.08, 12, 8),
    pipeJoint: new THREE.SphereGeometry(0.12, 8, 6),
    pipeSupport: new THREE.BoxGeometry(0.3, 0.1, 0.1),
  }), []);

  const materials = useMemo(() => ({
    floor: new THREE.MeshStandardMaterial({
      color: '#404850',
      roughness: 0.8,
      metalness: 0.1
    }),
    ceiling: new THREE.MeshStandardMaterial({
      color: '#1a1818',
      roughness: 0.9,
      metalness: 0.05
    }),
    wall: new THREE.MeshStandardMaterial({
      color: '#5a6b7a',
      roughness: 0.7,
      metalness: 0.1
    }),

    bloodStain: new THREE.MeshStandardMaterial({
      color: '#660000',
      roughness: 0.2,
      metalness: 0.0,
      transparent: true,
      opacity: 0.9,
    }),
    box: new THREE.MeshStandardMaterial({
      color: '#8B4513',
      roughness: 0.8,
      metalness: 0.1
    }),
    smallBox: new THREE.MeshStandardMaterial({
      color: '#654321',
      roughness: 0.9,
      metalness: 0.05
    }),
    crate: new THREE.MeshStandardMaterial({
      color: '#A0522D',
      roughness: 0.7,
      metalness: 0.2
    }),
    barrel: new THREE.MeshStandardMaterial({
      color: '#808080',
      roughness: 0.8,
      metalness: 0.6
    }),
    
    lightBulb: new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.1,
      metalness: 0.0,
      transparent: true,
      opacity: 0.9,
      emissive: '#aa8866',
      emissiveIntensity: 0.3
    }),
    lightSocket: new THREE.MeshStandardMaterial({
      color: '#2c2c2c',
      roughness: 0.6,
      metalness: 0.4
    }),
    lightCable: new THREE.MeshStandardMaterial({
      color: '#1a1a1a',
      roughness: 0.8,
      metalness: 0.1
    }),
    buildingPipe: new THREE.MeshStandardMaterial({
      color: '#4a4a4a',
      roughness: 0.4,
      metalness: 0.7
    }),
    pipeJoint: new THREE.MeshStandardMaterial({
      color: '#5a5a5a',
      roughness: 0.3,
      metalness: 0.8
    }),
    pipeSupport: new THREE.MeshStandardMaterial({
      color: '#666666',
      roughness: 0.5,
      metalness: 0.6
    })
  }), []);

  const elementPositions = useMemo(() => ({
    
    bloodStains: [
      { pos: [0.0, -2.98, 0.0], scale: [3.2, 3.2, 3.2] },
      { pos: [0.4, -2.98, -0.3], scale: [1.8, 1.8, 1.8] },
      { pos: [-0.3, -2.98, 0.5], scale: [1.6, 1.6, 1.6] },
      
      { pos: [1.2, -2.98, 0.8], scale: [1.1, 1.1, 1.1] },       { pos: [1.8, -2.98, 0.4], scale: [0.9, 0.9, 0.9] },       { pos: [-1.2, -2.98, -1.0], scale: [1.3, 1.3, 1.3] },       { pos: [-1.6, -2.98, -0.6], scale: [1.0, 1.0, 1.0] },       { pos: [2.0, -2.98, -0.8], scale: [1.2, 1.2, 1.2] },       { pos: [-2.0, -2.98, 0.8], scale: [1.1, 1.1, 1.1] },       
      { pos: [0.8, -2.98, -0.8], scale: [1.4, 1.4, 1.4] },       { pos: [-0.6, -2.98, 1.2], scale: [1.2, 1.2, 1.2] },       { pos: [1.4, -2.98, -0.4], scale: [1.1, 1.1, 1.1] },       { pos: [-1.0, -2.98, 0.4], scale: [1.3, 1.3, 1.3] },       { pos: [0.6, -2.98, 1.4], scale: [1.0, 1.0, 1.0] },       { pos: [-0.8, -2.98, -1.2], scale: [1.2, 1.2, 1.2] },       
      { pos: [0.4, -2.98, 0.8], scale: [0.8, 0.8, 0.8] },       { pos: [-0.5, -2.98, -0.8], scale: [0.7, 0.7, 0.7] },       { pos: [1.0, -2.98, 0.2], scale: [0.9, 0.9, 0.9] },       { pos: [-0.2, -2.98, -1.4], scale: [0.8, 0.8, 0.8] },       { pos: [0.8, -2.98, -0.6], scale: [0.7, 0.7, 0.7] },       { pos: [-1.4, -2.98, 0.2], scale: [0.6, 0.6, 0.6] },       { pos: [1.6, -2.98, 0.6], scale: [0.8, 0.8, 0.8] },
      { pos: [-0.4, -2.98, 1.6], scale: [0.7, 0.7, 0.7] },
      { pos: [0.2, -2.98, -1.0], scale: [0.6, 0.6, 0.6] },
      { pos: [-1.8, -2.98, -0.2], scale: [0.8, 0.8, 0.8] }, 0
    ],
    
    boxes: [
      { pos: [-8, -1.9, -8], rot: [0, Math.PI/4, 0], type: 'box' },
      { pos: [8, -1.9, -8], rot: [0, -Math.PI/6, 0], type: 'smallBox' },
      { pos: [-8, -1.9, 8], rot: [0, Math.PI/3, 0], type: 'crate' },
      { pos: [8, -1.9, 8], rot: [0, -Math.PI/4, 0], type: 'box' },
      { pos: [-6, -1.9, -10], rot: [0, Math.PI/2, 0], type: 'smallBox' },
      { pos: [6, -1.9, -10], rot: [0, -Math.PI/2, 0], type: 'crate' },
      { pos: [-10, -1.9, -6], rot: [0, 0, 0], type: 'box' },
      { pos: [10, -1.9, -6], rot: [0, Math.PI, 0], type: 'smallBox' },
      { pos: [-6, -1.9, 10], rot: [0, Math.PI/2, 0], type: 'crate' },
      { pos: [6, -1.9, 10], rot: [0, -Math.PI/2, 0], type: 'box' },
      { pos: [-10, -1.9, 6], rot: [0, 0, 0], type: 'smallBox' },
      { pos: [10, -1.9, 6], rot: [0, Math.PI, 0], type: 'crate' },
    ],
    
    barrels: [
      { pos: [-9, -1.9, -7], rot: [0, 0, 0] },
      { pos: [9, -1.9, 7], rot: [0, Math.PI/3, 0] },
      { pos: [-7, -1.9, 9], rot: [0, -Math.PI/4, 0] },
      { pos: [8, -1.9, -9], rot: [0, Math.PI/2, 0] },
    ],
    
    
    ceilingLights: [
      {
        bulbPos: [-4, 2.2, -4],
        socketPos: [-4, 2.4, -4],
        cablePos: [-4, 2.9, -4]
      },
      {
        bulbPos: [4, 2.2, -4],
        socketPos: [4, 2.4, -4],
        cablePos: [4, 2.9, -4]
      },
      {
        bulbPos: [-4, 2.2, 4],
        socketPos: [-4, 2.4, 4],
        cablePos: [-4, 2.9, 4]
      },
      {
        bulbPos: [4, 2.2, 4],
        socketPos: [4, 2.4, 4],
        cablePos: [4, 2.9, 4]
      }
    ],
    
    buildingPipes: [
      {
        pipePos: [0, 2.7, -8],
        pipeRot: [0, 0, Math.PI/2],
        joints: [
          { pos: [-6, 2.7, -8] },
          { pos: [6, 2.7, -8] }
        ],
        supports: [
          { pos: [-6, 2.8, -8], rot: [0, 0, 0] },
          { pos: [0, 2.8, -8], rot: [0, 0, 0] },
          { pos: [6, 2.8, -8], rot: [0, 0, 0] }
        ]
      },
      {
        pipePos: [0, 2.5, 6],
        pipeRot: [0, 0, Math.PI/2],
        joints: [
          { pos: [-6, 2.5, 6] },
          { pos: [6, 2.5, 6] }
        ],
        supports: [
          { pos: [-6, 2.6, 6], rot: [0, 0, 0] },
          { pos: [0, 2.6, 6], rot: [0, 0, 0] },
          { pos: [6, 2.6, 6], rot: [0, 0, 0] }
        ]
      },
      {
        pipePos: [-8, 2.6, 0],
        pipeRot: [Math.PI/2, 0, 0],
        joints: [
          { pos: [-8, 2.6, -6] },
          { pos: [-8, 2.6, 6] }
        ],
        supports: [
          { pos: [-8, 2.7, -6], rot: [0, Math.PI/2, 0] },
          { pos: [-8, 2.7, 0], rot: [0, Math.PI/2, 0] },
          { pos: [-8, 2.7, 6], rot: [0, Math.PI/2, 0] }
        ]
      },
      {
        pipePos: [8, 2.4, 0],
        pipeRot: [Math.PI/2, 0, 0],
        joints: [
          { pos: [8, 2.4, -6] },
          { pos: [8, 2.4, 6] }
        ],
        supports: [
          { pos: [8, 2.5, -6], rot: [0, Math.PI/2, 0] },
          { pos: [8, 2.5, 0], rot: [0, Math.PI/2, 0] },
          { pos: [8, 2.5, 6], rot: [0, Math.PI/2, 0] }
        ]
      }
    ],

  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (flickerLight1Ref.current) {
      const dramaticCycle = Math.sin(time * 0.3) * 0.3 + 0.7;
      const powerSurge = Math.sin(time * 2.5) > 0.8 ? 1.4 : 0.8;
      const electricalGlitch = Math.sin(time * 15) < -0.9 ? 0.5 : 1;
      const subtleFlicker = Math.sin(time * 12) * 0.2;
      flickerLight1Ref.current.intensity = (2.8 * dramaticCycle * powerSurge * electricalGlitch) + subtleFlicker;
    }
    
    if (flickerLight2Ref.current) {
      const breathingBase = Math.sin(time * 0.8) * 0.2 + 0.8;
      const electricalChaos = Math.sin(time * 18) < -0.8 ? 0.6 : 1;
      const powerSpike = Math.sin(time * 3.2) > 0.9 ? 1.3 : 0.9;
      const rapidFlicker = Math.sin(time * 20) * 0.15;
      flickerLight2Ref.current.intensity = (2.8 * breathingBase * electricalChaos * powerSpike) + rapidFlicker;
    }
  });

  return (
    <group scale={[0.4, 0.4, 0.4]}>

      {/* Floor */}
      <mesh
        geometry={geometries.floor}
        material={materials.floor}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3, 0]}
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
      <mesh geometry={geometries.wall} material={materials.wall} position={[0, 0, -12.5]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[0, 0, 12.5]} rotation={[0, Math.PI, 0]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[-12.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow />
      <mesh geometry={geometries.wall} material={materials.wall} position={[12.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow />

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

      {/* Boxes scattered around the basement */}
      {elementPositions.boxes.map((box, index) => (
        <mesh
          key={`box-${index}`}
          geometry={geometries[box.type]}
          material={materials[box.type]}
          position={box.pos}
          rotation={box.rot}
          castShadow
          receiveShadow
        />
      ))}

      {/* Gray barrels scattered around */}
      {elementPositions.barrels.map((barrel, index) => (
        <mesh
          key={`barrel-${index}`}
          geometry={geometries.barrel}
          material={materials.barrel}
          position={barrel.pos}
          rotation={barrel.rot}
          castShadow
          receiveShadow
        />
      ))}

      {/* BASEMENT INFRASTRUCTURE */}
      
      {/* Hanging ceiling light bulbs */}
      {elementPositions.ceilingLights.map((light, index) => (
        <group key={`ceiling-light-${index}`}>
          {/* Hanging cable */}
          <mesh
            geometry={geometries.lightCable}
            material={materials.lightCable}
            position={light.cablePos}
            castShadow
          />
          {/* Light socket */}
          <mesh
            geometry={geometries.lightSocket}
            material={materials.lightSocket}
            position={light.socketPos}
            castShadow
          />
          {/* Light bulb */}
          <mesh
            geometry={geometries.lightBulb}
            material={materials.lightBulb}
            position={light.bulbPos}
          />
        </group>
      ))}

      {/* Building pipes system */}
      {elementPositions.buildingPipes.map((pipeSystem, index) => (
        <group key={`pipe-system-${index}`}>
          {/* Main pipe */}
          <mesh
            geometry={geometries.buildingPipe}
            material={materials.buildingPipe}
            position={pipeSystem.pipePos}
            rotation={pipeSystem.pipeRot}
            castShadow
            receiveShadow
          />
          
          {/* Pipe joints */}
          {pipeSystem.joints.map((joint, jointIndex) => (
            <mesh
              key={`joint-${index}-${jointIndex}`}
              geometry={geometries.pipeJoint}
              material={materials.pipeJoint}
              position={joint.pos}
              castShadow
              receiveShadow
            />
          ))}
          
          {/* Pipe supports/brackets */}
          {pipeSystem.supports.map((support, supportIndex) => (
            <mesh
              key={`support-${index}-${supportIndex}`}
              geometry={geometries.pipeSupport}
              material={materials.pipeSupport}
              position={support.pos}
              rotation={support.rot}
              castShadow
              receiveShadow
            />
          ))}
        </group>
      ))}


      {/* ATMOSPHERIC FOG INSIDE BASEMENT - SEPIA TONE */}
      <fog attach="fog" args={['#2a1f1a', 1.5, 8]} />

      {/* SEPIA BASEMENT LIGHTING SYSTEM */}
      {/* Warm ambient light */}
      <ambientLight intensity={0.35} color="#4a3d2a" />
      
      {/* Main overhead lighting - warm sepia */}
      <directionalLight
        position={[0, 8, 0]}
        intensity={0.65}
        color="#6a5a42"
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

      {/* Fixed ceiling spotlights for ambient lighting - warm sepia */}
      <spotLight
        ref={flickerLight1Ref}
        position={[-5, 3.8, -5]}
        intensity={2.2}
        angle={0.8}
        penumbra={0.6}
        color="#8a7a5a"
        castShadow
        target-position={[0, 0, 0]}
      />
      
      <spotLight
        ref={flickerLight2Ref}
        position={[5, 3.8, 5]}
        intensity={2.2}
        angle={0.8}
        penumbra={0.6}
        color="#8a7a5a"
        castShadow
        target-position={[0, 0, 0]}
      />

      {/* Additional atmospheric lighting - warm sepia */}
      <directionalLight
        position={[-8, 3, 0]}
        intensity={0.25}
        color="#5a4a35"
      />
      
      <directionalLight
        position={[8, 3, 0]}
        intensity={0.2}
        color="#5a4a35"
      />

      {/* Rim lighting for atmosphere - warm brown tones */}
      <directionalLight
        position={[0, 1, -12]}
        intensity={0.15}
        color="#4a3a2a"
      />
      
      <directionalLight
        position={[0, 1, 12]}
        intensity={0.15}
        color="#4a3a2a"
      />

      {/* Underground atmosphere - very dark sepia */}
      <directionalLight
        position={[0, -1, 0]}
        intensity={0.05}
        color="#2a1f15"
      />
    </group>
  );
};

export default BarBasement;
