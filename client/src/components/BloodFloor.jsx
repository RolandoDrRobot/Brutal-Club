import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BloodFloor = () => {
  const meshRef = useRef();
  
  // Create blood puddles on the floor - MUCH MORE BLOOD!
  const bloodPuddles = useMemo(() => {
    const puddleCount = 6; // Optimized: 50% less instances for better performance
    const positions = new Float32Array(puddleCount * 3);
    const scales = new Float32Array(puddleCount);
    const opacities = new Float32Array(puddleCount);
    
    for (let i = 0; i < puddleCount; i++) {
      // Concentrated around the fighting area where fighters stand
      const fightCenterX = Math.random() > 0.5 ? -0.5 : 0.5; // Around fighter positions
      const fightCenterZ = 0; // Center Z where fighters are
      
      positions[i * 3] = fightCenterX + (Math.random() - 0.5) * 2.5; // x - around fight area
      positions[i * 3 + 1] = -0.99; // y - just above the floor
      positions[i * 3 + 2] = fightCenterZ + (Math.random() - 0.5) * 2.0; // z - around fight center
      
      // Varied sizes - smaller puddles
      scales[i] = Math.random() * 0.4 + 0.1; // 0.1 to 0.5 - SMALLER puddles
      
      // Higher opacities - more visible blood
      opacities[i] = Math.random() * 0.4 + 0.6; // 0.6 to 1.0 - MORE VISIBLE
    }
    
    return { positions, scales, opacities, puddleCount };
  }, []);
  
  // Subtle animation of the stains - Optimized with frame skipping
  useFrame((state) => {
    // Skip frames for better performance (run at ~15 FPS instead of 60 for subtle effects)
    if (Math.floor(state.clock.getElapsedTime() * 60) % 4 !== 0) return;
    
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Subtle pulsing effect on the stains
      meshRef.current.children.forEach((puddle, index) => {
        if (puddle.material) {
          puddle.material.opacity = bloodPuddles.opacities[index] + 
            Math.sin(time * 0.5 + index) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={meshRef}>
      {Array.from({ length: bloodPuddles.puddleCount }).map((_, index) => (
        <mesh
          key={index}
          position={[
            bloodPuddles.positions[index * 3],
            bloodPuddles.positions[index * 3 + 1],
            bloodPuddles.positions[index * 3 + 2]
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
          scale={[bloodPuddles.scales[index], bloodPuddles.scales[index], 1]}
        >
          <circleGeometry args={[1, 12]} /> {/* Optimized: 25% fewer vertices */}
          <meshBasicMaterial
            color="#4A0000" // Dark blood red
            transparent={true}
            opacity={bloodPuddles.opacities[index]}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
              {/* Additional smaller stains - OPTIMIZED */}
        {Array.from({ length: 4 }).map((_, index) => (
        <mesh
          key={`splatter-${index}`}
          position={[
            (Math.random() - 0.5) * 3.0, // Concentrated around center
            -0.98,
            (Math.random() - 0.5) * 2.5   // Near fight area
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
          scale={[Math.random() * 0.15 + 0.03, Math.random() * 0.15 + 0.03, 1]} // Much smaller
        >
          <circleGeometry args={[0.5, 6]} /> {/* Optimized: 25% fewer vertices */}
          <meshBasicMaterial
            color="#2D0000" // Even darker blood red
            transparent={true}
            opacity={Math.random() * 0.7 + 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
              {/* Salpicaduras muy pequeñas adicionales - OPTIMIZED */}
        {Array.from({ length: 8 }).map((_, index) => (
        <mesh
          key={`micro-splatter-${index}`}
          position={[
            (Math.random() - 0.5) * 3.5, // Around fighting area
            -0.97,
            (Math.random() - 0.5) * 3.0   // Near fight zone
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
          scale={[Math.random() * 0.08 + 0.02, Math.random() * 0.08 + 0.02, 1]} // Tiny
        >
          <circleGeometry args={[0.3, 5]} /> {/* Optimized: 17% fewer vertices */}
          <meshBasicMaterial
            color="#1A0000" // Rojo sangre muy oscuro
            transparent={true}
            opacity={Math.random() * 0.6 + 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
              {/* NUEVOS: Charcos medianos - OPTIMIZED */}
        {Array.from({ length: 2 }).map((_, index) => (
        <mesh
          key={`big-puddle-${index}`}
          position={[
            (Math.random() - 0.5) * 2.5, // Close to fight center
            -0.995,
            (Math.random() - 0.5) * 2.0   // Right in fight area
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
          scale={[Math.random() * 0.6 + 0.4, Math.random() * 0.6 + 0.4, 1]} // Medium size
        >
          <circleGeometry args={[1.5, 16]} /> {/* Optimized: 20% fewer vertices */}
          <meshBasicMaterial
            color="#380000" // Sangre coagulada muy oscura
            transparent={true}
            opacity={Math.random() * 0.3 + 0.7} // Muy visible
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
              {/* NUEVOS: Rastros de sangre (como arrastrado) - OPTIMIZED */}
        {Array.from({ length: 3 }).map((_, index) => (
        <mesh
          key={`blood-trail-${index}`}
          position={[
            (Math.random() - 0.5) * 4.0, // Around fighters area
            -0.99,
            (Math.random() - 0.5) * 3.0   // Extended fight zone
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
          scale={[Math.random() * 0.4 + 0.3, Math.random() * 0.15 + 0.05, 1]} // Small trails
        >
          <planeGeometry args={[2, 0.5]} />
          <meshBasicMaterial
            color="#2A0000" // Sangre seca
            transparent={true}
            opacity={Math.random() * 0.4 + 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default BloodFloor; 