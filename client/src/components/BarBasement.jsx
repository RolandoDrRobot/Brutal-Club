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
    cableSupport: new THREE.BoxGeometry(0.15, 0.2, 0.15), // Cable support brackets
    // Basement decoration elements - LARGER AND MORE DETAILED
    barrel: new THREE.CylinderGeometry(0.5, 0.46, 0.9), // Large wine/beer barrels
    smallBarrel: new THREE.CylinderGeometry(0.35, 0.32, 0.7), // Medium barrels
    tinyBarrel: new THREE.CylinderGeometry(0.25, 0.22, 0.5), // Small barrels
    woodenCrate: new THREE.BoxGeometry(0.8, 0.6, 0.8), // Large wooden crates
    cardboardBox: new THREE.BoxGeometry(0.6, 0.5, 0.6), // Large cardboard boxes
    metalCrate: new THREE.BoxGeometry(0.9, 0.5, 0.7), // Large metal supply crates
    // Additional detailed basement elements
    oldChair: new THREE.BoxGeometry(0.4, 0.8, 0.4), // Old broken chairs
    table: new THREE.BoxGeometry(1.2, 0.05, 0.8), // Old tables
    tableLeg: new THREE.CylinderGeometry(0.05, 0.05, 0.7), // Table legs
    sack: new THREE.CylinderGeometry(0.3, 0.25, 0.6), // Grain/potato sacks
    emptyBottle: new THREE.CylinderGeometry(0.04, 0.04, 0.25), // Empty bottles scattered
    brokenBottle: new THREE.CylinderGeometry(0.04, 0.04, 0.15), // Broken bottles
    toolBox: new THREE.BoxGeometry(0.6, 0.3, 0.4), // Tool boxes
    oldLadder: new THREE.BoxGeometry(0.05, 1.5, 0.05), // Old ladder
    buckets: new THREE.CylinderGeometry(0.2, 0.18, 0.3), // Old buckets
    pipes: new THREE.CylinderGeometry(0.05, 0.05, 1.5), // Loose pipes
    cobweb: new THREE.PlaneGeometry(0.3, 0.3), // Cobwebs in corners
    oldShelving: new THREE.BoxGeometry(0.05, 1.2, 0.3), // Old metal shelving
    rustBucket: new THREE.CylinderGeometry(0.15, 0.13, 0.25), // Rusty buckets
    wetStain: new THREE.CircleGeometry(0.4, 8), // Water stains on floor
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
    // Basement decoration materials
    barrelWood: new THREE.MeshStandardMaterial({
      color: '#8B4513', // Dark barrel wood
      roughness: 0.8,
      metalness: 0.0
    }),
    crateWood: new THREE.MeshStandardMaterial({
      color: '#654321', // Weathered crate wood
      roughness: 0.9,
      metalness: 0.0
    }),
    cardboard: new THREE.MeshStandardMaterial({
      color: '#D2B48C', // Cardboard brown
      roughness: 0.8,
      metalness: 0.0
    }),
    metalCrate: new THREE.MeshStandardMaterial({
      color: '#696969', // Dark gray metal
      roughness: 0.6,
      metalness: 0.3
    }),
    barrelMetal: new THREE.MeshStandardMaterial({
      color: '#2F2F2F', // Dark metal barrel bands
      roughness: 0.4,
      metalness: 0.7
    }),
    // Additional detailed basement materials
    oldWood: new THREE.MeshStandardMaterial({
      color: '#3d2914', // Very old weathered wood
      roughness: 0.95,
      metalness: 0.0
    }),
    sackCloth: new THREE.MeshStandardMaterial({
      color: '#8B7D6B', // Burlap sack color
      roughness: 0.9,
      metalness: 0.0
    }),
    rust: new THREE.MeshStandardMaterial({
      color: '#B7410E', // Rusty metal
      roughness: 0.8,
      metalness: 0.2
    }),
    dirtyMetal: new THREE.MeshStandardMaterial({
      color: '#4A4A4A', // Dirty metal
      roughness: 0.7,
      metalness: 0.4
    }),
    wetStain: new THREE.MeshStandardMaterial({
      color: '#1a1a1a', // Dark wet stain
      roughness: 0.3,
      metalness: 0.0,
      transparent: true,
      opacity: 0.6
    }),
    cobwebMaterial: new THREE.MeshStandardMaterial({
      color: '#E5E5E5', // Dusty white cobwebs
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity: 0.4
    }),
    darkBottleGlass: new THREE.MeshStandardMaterial({
      color: '#0d2818', // Very dark bottle glass
      roughness: 0.2,
      metalness: 0.1,
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
    ],
    

    
    // ELEMENTOS ADICIONALES DE SÓTANO DE BAR
    oldFurniture: [
      // Broken chairs and tables
      { pos: [-6, -2.1, -6], rot: [0, 0.5, 0.3], type: 'oldChair' }, // Tilted broken chair
      { pos: [7, -2.1, -7], rot: [0, -0.4, -0.2], type: 'oldChair' },
      { pos: [-8, -1.9, 5], rot: [0, 0.8, 0], type: 'table' }, // Old table
      { pos: [6, -1.9, 4], rot: [0, -0.3, 0], type: 'table' }
    ],
    
    // Table legs for the tables
    tableLegPositions: [
      // For table at [-8, -1.9, 5]
      { pos: [-8.5, -2.25, 4.6] }, { pos: [-7.5, -2.25, 4.6] },
      { pos: [-8.5, -2.25, 5.4] }, { pos: [-7.5, -2.25, 5.4] },
      // For table at [6, -1.9, 4]
      { pos: [5.5, -2.25, 3.6] }, { pos: [6.5, -2.25, 3.6] },
      { pos: [5.5, -2.25, 4.4] }, { pos: [6.5, -2.25, 4.4] }
    ],
    
    sacks: [
      // Grain/potato sacks scattered
      { pos: [-11, -2.2, -4], rot: [0, 0.3, 0] },
      { pos: [10, -2.2, -5], rot: [0, -0.6, 0] },
      { pos: [-7, -2.2, 8], rot: [0, 0.8, 0] },
      { pos: [8, -2.2, 7], rot: [0, -0.2, 0] },
      { pos: [-4, -2.2, -9], rot: [0, 0.5, 0] },
      { pos: [5, -2.2, -8], rot: [0, -0.4, 0] }
    ],
    
    scatteredBottles: [
      // Empty bottles everywhere for atmosphere
      { pos: [-6.5, -2.4, -11], rot: [0, 0, 0.8] }, // Fallen bottle
      { pos: [7.2, -2.4, -10], rot: [0, 0, -0.5] },
      { pos: [-9.3, -2.4, 3], rot: [0, 0, 0.3] },
      { pos: [8.1, -2.4, 2], rot: [0, 0, -0.7] },
      { pos: [-3.5, -2.4, -7], rot: [0, 0, 0.6] },
      { pos: [4.2, -2.4, -6], rot: [0, 0, -0.4] },
      { pos: [-10.8, -2.4, 6], rot: [0, 0, 0.9] },
      { pos: [9.5, -2.4, 5], rot: [0, 0, -0.3] }
    ],
    
    toolsAndEquipment: [
      // Old rusty buckets and tools
      { pos: [-11.5, -2.4, -7], type: 'rustBucket' },
      { pos: [11.2, -2.4, -8], type: 'buckets' },
      { pos: [-5.5, -2.4, 9], type: 'toolBox' },
      { pos: [6.8, -2.4, 8.5], type: 'rustBucket' },
      { pos: [-9.8, -2.4, -2], type: 'buckets' }
    ],
    
    pipes: [
      // Loose pipes on the floor
      { pos: [-10, -2.4, 0], rot: [0, 0, Math.PI/2] }, // Horizontal pipe
      { pos: [9, -2.4, -3], rot: [0, Math.PI/4, Math.PI/2] },
      { pos: [-7, -2.4, 6], rot: [0, -Math.PI/6, Math.PI/2] }
    ],
    

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
      flickerLight1Ref.current.intensity = (2.2 * dramaticCycle * powerSurge * electricalChaos) + coolFlicker;
    }
    
    // Light 2 - More dramatic electrical breathing
    if (flickerLight2Ref.current) {
      const breathingBase = Math.sin(time * 1.0) * 0.2 + 0.8; // More breathing effect
      const electricalGlitch = Math.sin(time * 7) < -0.8 ? 0.7 : 1; // More frequent glitches
      const subtlePulse = Math.sin(time * 5) * 0.12; // More noticeable pulsing
      const sparking = Math.sin(time * 12) > 0.92 ? 1.2 : 1; // More frequent sparks
      flickerLight2Ref.current.intensity = (2.2 * breathingBase * electricalGlitch * sparking) + subtlePulse;
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





      {/* MOBILIARIO VIEJO Y ROTO */}
      {elementPositions.oldFurniture.map((furniture, index) => {
        let geometry, material;
        switch(furniture.type) {
          case 'oldChair':
            geometry = geometries.oldChair;
            material = materials.oldWood;
            break;
          case 'table':
            geometry = geometries.table;
            material = materials.oldWood;
            break;
          default:
            geometry = geometries.oldChair;
            material = materials.oldWood;
        }
        
        return (
          <mesh
            key={`old-furniture-${index}`}
            geometry={geometry}
            material={material}
            position={furniture.pos}
            rotation={furniture.rot}
            castShadow
            receiveShadow
          />
        );
      })}

      {/* PATAS DE MESAS */}
      {elementPositions.tableLegPositions.map((leg, index) => (
        <mesh
          key={`table-leg-${index}`}
          geometry={geometries.tableLeg}
          material={materials.oldWood}
          position={leg.pos}
          castShadow
          receiveShadow
        />
      ))}

      {/* SACOS DE GRANO/PATATAS */}
      {elementPositions.sacks.map((sack, index) => (
        <mesh
          key={`sack-${index}`}
          geometry={geometries.sack}
          material={materials.sackCloth}
          position={sack.pos}
          rotation={sack.rot}
          castShadow
          receiveShadow
        />
      ))}

      {/* BOTELLAS VACÍAS ESPARCIDAS */}
      {elementPositions.scatteredBottles.map((bottle, index) => (
        <mesh
          key={`scattered-bottle-${index}`}
          geometry={geometries.emptyBottle}
          material={materials.darkBottleGlass}
          position={bottle.pos}
          rotation={bottle.rot}
          castShadow
        />
      ))}

      {/* HERRAMIENTAS Y EQUIPOS VIEJOS */}
      {elementPositions.toolsAndEquipment.map((tool, index) => {
        let geometry, material;
        switch(tool.type) {
          case 'rustBucket':
            geometry = geometries.rustBucket;
            material = materials.rust;
            break;
          case 'buckets':
            geometry = geometries.buckets;
            material = materials.dirtyMetal;
            break;
          case 'toolBox':
            geometry = geometries.toolBox;
            material = materials.metalCrate;
            break;
          default:
            geometry = geometries.buckets;
            material = materials.dirtyMetal;
        }
        
        return (
          <mesh
            key={`tool-equipment-${index}`}
            geometry={geometry}
            material={material}
            position={tool.pos}
            castShadow
            receiveShadow
          />
        );
      })}

      {/* TUBERÍAS SUELTAS */}
      {elementPositions.pipes.map((pipe, index) => (
        <mesh
          key={`loose-pipe-${index}`}
          geometry={geometries.pipes}
          material={materials.dirtyMetal}
          position={pipe.pos}
          rotation={pipe.rot}
          castShadow
          receiveShadow
        />
      ))}



      {/* ATMOSPHERIC FOG INSIDE BASEMENT */}
      <fog attach="fog" args={['#2a2318', 1.5, 8]} />

      {/* DARK TAVERN BASEMENT LIGHTING SYSTEM */}
      {/* Dark ambient light */}
      <ambientLight intensity={0.28} color="#3d3529" />
      
      {/* Main overhead lighting */}
      <directionalLight
        position={[0, 8, 0]}
        intensity={0.65}
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
        intensity={0.2}
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