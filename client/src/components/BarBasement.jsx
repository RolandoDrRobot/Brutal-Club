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
    // Bar elements
    barrel: new THREE.CylinderGeometry(0.8, 0.8, 1.5),
    table: new THREE.CylinderGeometry(1.2, 1.2, 0.1),
    tableBase: new THREE.CylinderGeometry(0.15, 0.15, 0.8),
    chair: new THREE.BoxGeometry(0.5, 1, 0.5),
    chairBack: new THREE.BoxGeometry(0.5, 0.6, 0.1),
    bottle: new THREE.CylinderGeometry(0.06, 0.06, 0.3),
    barCounter: new THREE.BoxGeometry(8, 1, 1.5),
    barStool: new THREE.CylinderGeometry(0.3, 0.3, 0.8),
    // Extended bar elements
    mainBar: new THREE.BoxGeometry(12, 1.2, 2),
    barBack: new THREE.BoxGeometry(12, 4, 0.3),
    shelf: new THREE.BoxGeometry(11, 0.2, 0.8),
    bottleLarge: new THREE.CylinderGeometry(0.08, 0.08, 0.4),
    wineBottle: new THREE.CylinderGeometry(0.05, 0.05, 0.35),
    glass: new THREE.CylinderGeometry(0.04, 0.03, 0.12),
    beerTap: new THREE.CylinderGeometry(0.05, 0.05, 0.3),
    mirror: new THREE.PlaneGeometry(10, 3),
    cashRegister: new THREE.BoxGeometry(0.6, 0.4, 0.4),
    pipe: new THREE.CylinderGeometry(0.08, 0.08, 35),
    lightBulb: new THREE.SphereGeometry(0.15, 8, 6),
    lightShade: new THREE.ConeGeometry(0.4, 0.6, 8),
    // Decorative elements
    brick: new THREE.BoxGeometry(0.3, 0.15, 0.2),
    crate: new THREE.BoxGeometry(1, 0.8, 1),
    dartboard: new THREE.CylinderGeometry(0.4, 0.4, 0.1),
    poster: new THREE.PlaneGeometry(1, 1.4),
    // Basement stairs
    stairStep: new THREE.BoxGeometry(1.2, 0.15, 0.3),
    stairRailing: new THREE.BoxGeometry(0.05, 0.8, 0.05),
    stairSupport: new THREE.BoxGeometry(1.2, 0.1, 0.05),
    // Floor bottles (scattered drinking bottles)
    beerBottleFloor: new THREE.CylinderGeometry(0.04, 0.04, 0.25),
    whiskeyBottleFloor: new THREE.CylinderGeometry(0.06, 0.06, 0.3)
  }), []);

  const materials = useMemo(() => ({
    // Basic structure materials (más neutros)
    floor: new THREE.MeshStandardMaterial({
      color: '#2a2520',
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
    brick: new THREE.MeshStandardMaterial({
      color: '#4a3f35',
      roughness: 0.9,
      metalness: 0.1
    }),
    column: new THREE.MeshStandardMaterial({
      color: '#3d2a25',
      roughness: 0.6,
      metalness: 0.2
    }),
    // Bar furniture materials
    wood: new THREE.MeshStandardMaterial({
      color: '#4d3220',
      roughness: 0.8,
      metalness: 0.1
    }),
    darkWood: new THREE.MeshStandardMaterial({
      color: '#2a1f18',
      roughness: 0.7,
      metalness: 0.1
    }),
    barrel: new THREE.MeshStandardMaterial({
      color: '#5a3f2a',
      roughness: 0.6,
      metalness: 0.3
    }),
    bottle: new THREE.MeshStandardMaterial({
      color: '#1a3a1a',
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8
    }),
    bottleLabel: new THREE.MeshStandardMaterial({
      color: '#cc2222',
      roughness: 0.6,
      metalness: 0.1
    }),
    metal: new THREE.MeshStandardMaterial({
      color: '#4a4a4a',
      roughness: 0.3,
      metalness: 0.7
    }),
    // Lighting materials (más sutiles)
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
    }),
    // Decorative materials
    crate: new THREE.MeshStandardMaterial({
      color: '#5a4a3a',
      roughness: 0.8,
      metalness: 0.1
    }),
    dartboard: new THREE.MeshStandardMaterial({
      color: '#2a2a2a',
      roughness: 0.6,
      metalness: 0.1
    }),
    poster: new THREE.MeshStandardMaterial({
      color: '#cc3333',
      roughness: 0.8,
      metalness: 0.1
    }),
    // Stairs materials
    stairWood: new THREE.MeshStandardMaterial({
      color: '#4a3426',
      roughness: 0.7,
      metalness: 0.1
    }),
    // Floor bottles materials (used/empty bottles)
    beerBottleEmpty: new THREE.MeshStandardMaterial({
      color: '#2a1f0f',
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8
    }),
    whiskeyBottleEmpty: new THREE.MeshStandardMaterial({
      color: '#1a1a0f',
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9
    }),
    // Extended bar materials
    barTop: new THREE.MeshStandardMaterial({
      color: '#3d2a1f',
      roughness: 0.3,
      metalness: 0.1
    }),
    mirror: new THREE.MeshStandardMaterial({
      color: '#888888',
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    }),
    glass: new THREE.MeshStandardMaterial({
      color: '#f0f0f0',
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.7
    }),
    copper: new THREE.MeshStandardMaterial({
      color: '#b87333',
      roughness: 0.4,
      metalness: 0.8
    }),
    liquor: new THREE.MeshStandardMaterial({
      color: '#aa6633',
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8
    })
  }), []);

  // Generate positions for various elements
  const elementPositions = useMemo(() => ({
    // Brick walls pattern (espacio más cerrado)
    bricks: Array.from({ length: 120 }, (_, i) => ({
      pos: [
        -12 + Math.random() * 24,
        0.5 + (Math.floor(i / 30) * 0.3),
        -12 + Math.random() * 24
      ],
      rot: [0, Math.random() * Math.PI, 0]
    })),
    
    // Bar furniture (más cerrado)
    barrels: [
      [-10, 0.75, -10],
      [-10, 0.75, -7],
      [10, 0.75, -10],
      [10, 0.75, 10],
      [-7, 0.75, 11],
      [7, 0.75, 11]
    ],
    
    tables: [
      { pos: [-6, 0.05, -6], chairs: [[-6.8, 0.5, -6], [-5.2, 0.5, -6], [-6, 0.5, -6.8], [-6, 0.5, -5.2]] },
      { pos: [6, 0.05, -6], chairs: [[6.8, 0.5, -6], [5.2, 0.5, -6], [6, 0.5, -6.8], [6, 0.5, -5.2]] },
      { pos: [-6, 0.05, 6], chairs: [[-6.8, 0.5, 6], [-5.2, 0.5, 6], [-6, 0.5, 6.8], [-6, 0.5, 5.2]] },
      { pos: [6, 0.05, 6], chairs: [[6.8, 0.5, 6], [5.2, 0.5, 6], [6, 0.5, 6.8], [6, 0.5, 5.2]] }
    ],
    
    // Main liquor bar (lado derecho del sótano)
    mainBar: { 
      pos: [11, 0.6, 0], 
      backPanel: [11, 2.5, -0.85],
      shelves: [
        [11, 1.8, -0.4], // Top shelf
        [11, 2.5, -0.4]  // Middle shelf
      ],
      mirror: [11, 3, -0.9],
      stools: [
        [9, 0.4, -2], [9, 0.4, -1], [9, 0.4, 0], 
        [9, 0.4, 1], [9, 0.4, 2], [9, 0.4, 3]
      ]
    },
    
    // Extensive bottle collection on main bar
    barBottles: [
      // High shelf removed - no more bottles at Y: 3.4
      
      // Middle shelf - Wine and spirits
      [10.4, 2.7, -2.6], [10.4, 2.7, -2.2], [10.4, 2.7, -1.8], [10.4, 2.7, -1.4],
      [10.4, 2.7, -1.0], [10.4, 2.7, -0.6], [10.4, 2.7, -0.2], [10.4, 2.7, 0.2],
      [10.4, 2.7, 0.6], [10.4, 2.7, 1.0], [10.4, 2.7, 1.4], [10.4, 2.7, 1.8],
      [10.4, 2.7, 2.2], [10.4, 2.7, 2.6],
      
      // Lower shelf - Beer and mixers
      [10.4, 2.0, -2.4], [10.4, 2.0, -2.0], [10.4, 2.0, -1.6], [10.4, 2.0, -1.2],
      [10.4, 2.0, -0.8], [10.4, 2.0, -0.4], [10.4, 2.0, 0.0], [10.4, 2.0, 0.4],
      [10.4, 2.0, 0.8], [10.4, 2.0, 1.2], [10.4, 2.0, 1.6], [10.4, 2.0, 2.0],
      [10.4, 2.0, 2.4],
      
      // Bar top bottles (working bottles)
      [11, 1.4, -2.5], [11, 1.4, -2.0], [11, 1.4, -1.5], [11, 1.4, -1.0],
      [11, 1.4, -0.5], [11, 1.4, 0.0], [11, 1.4, 0.5], [11, 1.4, 1.0],
      [11, 1.4, 1.5], [11, 1.4, 2.0], [11, 1.4, 2.5]
    ],
    
    // Glasses and bar equipment
    glasses: [
      [10.8, 1.3, -2.8], [10.8, 1.3, -2.6], [10.8, 1.3, -2.4],
      [10.8, 1.3, 2.4], [10.8, 1.3, 2.6], [10.8, 1.3, 2.8]
    ],
    
    // Beer taps
    beerTaps: [
      [11, 1.35, -3.2], [11, 1.35, -3.0], [11, 1.35, 2.8], [11, 1.35, 3.0]
    ],
    
    // Bar accessories
    cashRegister: [10.5, 1.4, 3.2],
    

    
    // Support columns (más cerca del centro)
    columns: [
      [-7, 2, -7],
      [7, 2, -7],
      [-7, 2, 7],
      [7, 2, 7]
    ],
    
    // Ceiling pipes (espacio más cerrado)
    pipes: [
      { pos: [0, 3.8, -5], rot: [0, 0, Math.PI / 2] },
      { pos: [0, 3.8, 0], rot: [0, 0, Math.PI / 2] },
      { pos: [0, 3.8, 5], rot: [0, 0, Math.PI / 2] }
    ],
    
    // Hanging lights (más cerca y menos)
    hangingLights: [
      { pos: [-5, 3.2, -5], shade: [-5, 2.8, -5] },
      { pos: [5, 3.2, -5], shade: [5, 2.8, -5] },
      { pos: [-5, 3.2, 5], shade: [-5, 2.8, 5] },
      { pos: [5, 3.2, 5], shade: [5, 2.8, 5] }
    ],
    
    // Decorative elements (más cerca)
    crates: [
      [-11, 0.4, -5],
      [-11, 0.4, 5],
      [11, 0.4, -5],
      [11, 0.4, 5]
    ],
    
    dartboards: [
      { pos: [-12, 2, 0], rot: [0, Math.PI / 2, 0] },
      { pos: [12, 2, 0], rot: [0, -Math.PI / 2, 0] }
    ],
    
    posters: [
      { pos: [-12, 2, -5], rot: [0, Math.PI / 2, 0] },
      { pos: [-12, 2, 5], rot: [0, Math.PI / 2, 0] },
      { pos: [12, 2, -5], rot: [0, -Math.PI / 2, 0] },
      { pos: [12, 2, 5], rot: [0, -Math.PI / 2, 0] }
    ],
    
    // Basement stairs to main bar (corner stairs)
    stairs: {
      position: [-10, 0, -10], // Back corner
      steps: [
        { pos: [-10, -0.85, -10], rot: [0, 0, 0] },    // Step 1 (bottom)
        { pos: [-10, -0.70, -9.7], rot: [0, 0, 0] },   // Step 2
        { pos: [-10, -0.55, -9.4], rot: [0, 0, 0] },   // Step 3
        { pos: [-10, -0.40, -9.1], rot: [0, 0, 0] },   // Step 4
        { pos: [-10, -0.25, -8.8], rot: [0, 0, 0] },   // Step 5
        { pos: [-10, -0.10, -8.5], rot: [0, 0, 0] },   // Step 6
        { pos: [-10, 0.05, -8.2], rot: [0, 0, 0] },    // Step 7
        { pos: [-10, 0.20, -7.9], rot: [0, 0, 0] },    // Step 8 (top)
      ],
      railingPosts: [
        [-10.6, -0.4, -10], [-10.6, -0.4, -9.5], [-10.6, -0.4, -9], [-10.6, -0.4, -8.5], [-10.6, -0.4, -8]
      ],
      railingSupports: [
        { pos: [-10.6, -0.4, -9.25], rot: [0, 0, 0] },
        { pos: [-10.6, -0.4, -8.75], rot: [0, 0, 0] }
      ]
    },
    
    // Floor bottles scattered around corners (people drinking evidence)
    floorBottles: [
      // Corner 1 (back left)
      { pos: [-11, -0.87, -11], rot: [Math.PI/2, 0, Math.PI/4], type: 'beer' },
      { pos: [-10.2, -0.83, -10.8], rot: [0, 0, Math.PI/6], type: 'whiskey' },
      { pos: [-11.5, -0.85, -9.8], rot: [Math.PI/2, 0, -Math.PI/8], type: 'beer' },
      { pos: [-9.8, -0.84, -11.2], rot: [Math.PI/2, Math.PI/3, 0], type: 'beer' },
      
      // Corner 2 (back right) 
      { pos: [11, -0.86, -11], rot: [Math.PI/2, 0, -Math.PI/4], type: 'whiskey' },
      { pos: [10.3, -0.82, -10.5], rot: [0, 0, Math.PI/5], type: 'beer' },
      { pos: [11.8, -0.88, -9.9], rot: [Math.PI/2, 0, Math.PI/6], type: 'beer' },
      
      // Corner 3 (front left)
      { pos: [-10.8, -0.85, 11], rot: [Math.PI/2, Math.PI/4, 0], type: 'beer' },
      { pos: [-11.5, -0.83, 10.2], rot: [0, 0, -Math.PI/8], type: 'whiskey' },
      { pos: [-9.5, -0.87, 11.3], rot: [Math.PI/2, 0, Math.PI/3], type: 'beer' },
      
      // Corner 4 (front right)
      { pos: [10.5, -0.84, 10.8], rot: [Math.PI/2, 0, Math.PI/7], type: 'beer' },
      { pos: [11.2, -0.86, 11.5], rot: [0, Math.PI/6, 0], type: 'whiskey' },
      { pos: [9.8, -0.82, 10.1], rot: [Math.PI/2, -Math.PI/4, 0], type: 'beer' },
      
      // Some in the middle areas (near walls)
      { pos: [-8.5, -0.85, -8.2], rot: [Math.PI/2, 0, Math.PI/12], type: 'beer' },
      { pos: [8.8, -0.83, -8.7], rot: [0, 0, -Math.PI/10], type: 'whiskey' },
      { pos: [-9.2, -0.87, 8.5], rot: [Math.PI/2, Math.PI/8, 0], type: 'beer' },
      { pos: [9.1, -0.84, 9.3], rot: [Math.PI/2, 0, -Math.PI/6], type: 'beer' }
    ]
  }), []);

  // Cool electrical flickering effect
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Light 1 - Dramatic cinematic flickering (VERY NOTICEABLE)
    if (flickerLight1Ref.current) {
      const dramaticCycle = Math.sin(time * 0.5) * 0.8 + 0.2; // Even more dramatic cycles
      const powerSurge = Math.sin(time * 2) > 0.7 ? 2.8 : 1; // Much stronger, frequent surges
      const coolFlicker = Math.sin(time * 8) * 0.25; // Very noticeable flickering
      const electricalChaos = Math.sin(time * 15) < -0.9 ? 0.1 : 1; // Occasional blackouts
      flickerLight1Ref.current.intensity = (1.8 * dramaticCycle * powerSurge * electricalChaos) + coolFlicker;
    }
    
    // Light 2 - Breathing light with electrical glitches (MUCH MORE VISIBLE)
    if (flickerLight2Ref.current) {
      const breathingBase = Math.sin(time * 1) * 0.6 + 0.4; // Much stronger breathing effect
      const electricalGlitch = Math.sin(time * 8) < -0.8 ? 0.15 : 1; // Very frequent glitches
      const subtlePulse = Math.sin(time * 5) * 0.3; // Very noticeable pulsing
      const sparking = Math.sin(time * 12) > 0.95 ? 2.5 : 1; // Occasional sparking
      flickerLight2Ref.current.intensity = (1.8 * breathingBase * electricalGlitch * sparking) + subtlePulse;
    }
  });

  return (
    <group scale={[0.4, 0.4, 0.4]}> {/* Scale down basement much smaller to better match character size */}


      {/* Ceiling */}
      <mesh 
        geometry={geometries.ceiling} 
        material={materials.ceiling}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 4, 0]}
        receiveShadow
      />

      {/* Walls with brick texture effect (más cerrado) */}
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

      {/* MAIN LIQUOR BAR */}


      {/* Bar back panel */}
      <mesh
        geometry={geometries.barBack}
        material={materials.darkWood}
        position={elementPositions.mainBar.backPanel}
        castShadow
        receiveShadow
      />

      {/* Bar shelves */}
      {elementPositions.mainBar.shelves.map((pos, index) => (
        <mesh
          key={`shelf-${index}`}
          geometry={geometries.shelf}
          material={materials.wood}
          position={pos}
          castShadow
          receiveShadow
        />
      ))}

      {/* Bar mirror */}
      <mesh
        geometry={geometries.mirror}
        material={materials.mirror}
        position={elementPositions.mainBar.mirror}
        receiveShadow
      />



      {/* Extensive bottle collection */}
      {elementPositions.barBottles.map((pos, index) => (
        <mesh
          key={`bar-bottle-${index}`}
          geometry={index % 4 === 0 ? geometries.wineBottle : geometries.bottleLarge}
          material={index % 3 === 0 ? materials.bottleLabel : materials.liquor}
          position={pos}
          castShadow
        />
      ))}

      {/* Glasses */}
      {elementPositions.glasses.map((pos, index) => (
        <mesh
          key={`glass-${index}`}
          geometry={geometries.glass}
          material={materials.glass}
          position={pos}
          castShadow
        />
      ))}

      {/* Beer taps */}
      {elementPositions.beerTaps.map((pos, index) => (
        <mesh
          key={`tap-${index}`}
          geometry={geometries.beerTap}
          material={materials.copper}
          position={pos}
          castShadow
        />
      ))}

      {/* Cash register */}
      <mesh
        geometry={geometries.cashRegister}
        material={materials.metal}
        position={elementPositions.cashRegister}
        castShadow
        receiveShadow
      />



      {/* Barrels */}
      {elementPositions.barrels.map((pos, index) => (
        <mesh
          key={`barrel-${index}`}
          geometry={geometries.barrel}
          material={materials.barrel}
          position={pos}
          castShadow
          receiveShadow
        />
      ))}

      {/* Tables with chairs */}
      {elementPositions.tables.map((table, tableIndex) => (
        <group key={`table-${tableIndex}`}>
          {/* Table top */}
          <mesh
            geometry={geometries.table}
            material={materials.wood}
            position={table.pos}
            castShadow
            receiveShadow
          />
          {/* Table base */}
          <mesh
            geometry={geometries.tableBase}
            material={materials.darkWood}
            position={[table.pos[0], -0.35, table.pos[2]]}
            castShadow
          />
          {/* Chairs */}
          {table.chairs.map((chairPos, chairIndex) => (
            <group key={`chair-${tableIndex}-${chairIndex}`}>
              <mesh
                geometry={geometries.chair}
                material={materials.wood}
                position={chairPos}
                castShadow
                receiveShadow
              />
              <mesh
                geometry={geometries.chairBack}
                material={materials.wood}
                position={[chairPos[0], chairPos[1] + 0.3, chairPos[2] - 0.2]}
                castShadow
              />
            </group>
          ))}
        </group>
      ))}

      {/* Ceiling pipes */}
      {elementPositions.pipes.map((pipe, index) => (
        <mesh
          key={`pipe-${index}`}
          geometry={geometries.pipe}
          material={materials.metal}
          position={pipe.pos}
          rotation={pipe.rot}
          castShadow
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

      {/* Crates */}
      {elementPositions.crates.map((pos, index) => (
        <mesh
          key={`crate-${index}`}
          geometry={geometries.crate}
          material={materials.crate}
          position={pos}
          castShadow
          receiveShadow
        />
      ))}

      {/* Dartboards */}
      {elementPositions.dartboards.map((dartboard, index) => (
        <mesh
          key={`dartboard-${index}`}
          geometry={geometries.dartboard}
          material={materials.dartboard}
          position={dartboard.pos}
          rotation={dartboard.rot}
          castShadow
        />
      ))}

      {/* Posters */}
      {elementPositions.posters.map((poster, index) => (
        <mesh
          key={`poster-${index}`}
          geometry={geometries.poster}
          material={materials.poster}
          position={poster.pos}
          rotation={poster.rot}
          receiveShadow
        />
      ))}

      {/* Basement Stairs */}
      {elementPositions.stairs.steps.map((step, index) => (
        <mesh
          key={`stair-step-${index}`}
          geometry={geometries.stairStep}
          material={materials.stairWood}
          position={step.pos}
          rotation={step.rot}
          castShadow
          receiveShadow
        />
      ))}

      {/* Stair Railing Posts */}
      {elementPositions.stairs.railingPosts.map((post, index) => (
        <mesh
          key={`railing-post-${index}`}
          geometry={geometries.stairRailing}
          material={materials.stairWood}
          position={post}
          castShadow
          receiveShadow
        />
      ))}

      {/* Stair Railing Supports */}
      {elementPositions.stairs.railingSupports.map((support, index) => (
        <mesh
          key={`railing-support-${index}`}
          geometry={geometries.stairSupport}
          material={materials.stairWood}
          position={support.pos}
          rotation={support.rot}
          castShadow
          receiveShadow
        />
      ))}

      {/* Floor Bottles (Evidence of drinking) */}
      {elementPositions.floorBottles.map((bottle, index) => (
        <mesh
          key={`floor-bottle-${index}`}
          geometry={bottle.type === 'beer' ? geometries.beerBottleFloor : geometries.whiskeyBottleFloor}
          material={bottle.type === 'beer' ? materials.beerBottleEmpty : materials.whiskeyBottleEmpty}
          position={bottle.pos}
          rotation={bottle.rot}
          castShadow
          receiveShadow
        />
      ))}

      {/* ATMOSPHERIC FOG INSIDE BASEMENT */}
      <fog attach="fog" args={['#2a2318', 1.5, 8]} />

      {/* DARK TAVERN BASEMENT LIGHTING SYSTEM */}
      {/* Dark ambient light (less sepia) - INCREASED */}
      <ambientLight intensity={0.18} color="#3d3529" />
      
      {/* Main overhead dark lighting (less sepia) - INCREASED */}
      <directionalLight
        position={[0, 8, 0]}
        intensity={0.45}
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

      {/* Hanging tavern lights (subtle warm glow) */}
      {elementPositions.hangingLights.map((light, index) => (
        <spotLight
          key={`spot-${index}`}
          ref={index === 0 ? flickerLight1Ref : index === 1 ? flickerLight2Ref : null}
          position={[light.pos[0], light.pos[1] - 0.2, light.pos[2]]}
          intensity={1.8}
          angle={0.8}
          penumbra={0.6}
          color="#bb9955"
          castShadow
          target-position={[light.pos[0], 0, light.pos[2]]}
        />
      ))}

      {/* Main bar lighting (darker, less sepia) */}
      <spotLight
        position={[8, 3, 0]}
        intensity={1.2}
        angle={0.9}
        penumbra={0.5}
        color="#998844"
        castShadow
        target-position={[11, 1, 0]}
      />

      {/* Bar bottle shelf lighting (darker amber) */}
      <spotLight
        position={[9, 4, 0]}
        intensity={0.7}
        angle={1.4}
        penumbra={0.4}
        color="#887733"
        target-position={[10.4, 2.5, 0]}
      />

      {/* Small counter lighting (darker, less sepia) */}
      <spotLight
        position={[0, 2, -8]}
        intensity={0.6}
        angle={0.6}
        penumbra={0.7}
        color="#776644"
        target-position={[0, 1, -11]}
      />

      {/* Side atmospheric lighting (darker, less sepia) */}
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

      {/* Rim lighting for atmosphere (darker) */}
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

      {/* Additional underground atmosphere (darker) */}
      <directionalLight
        position={[0, -1, 0]}
        intensity={0.08}
        color="#332211"
      />
    </group>
  );
};

export default BarBasement;
