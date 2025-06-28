import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BloodFloor = () => {
  const meshRef = useRef();
  
  // Create blood puddles on the floor with reduced count for better performance
  const bloodPuddles = useMemo(() => {
    const puddleCount = 15; // Reduced from 25
    const positions = new Float32Array(puddleCount * 3);
    const scales = new Float32Array(puddleCount);
    const opacities = new Float32Array(puddleCount);
    
    for (let i = 0; i < puddleCount; i++) {
      // Random positions on the floor
      positions[i * 3] = (Math.random() - 0.5) * 14; // x - wider area
      positions[i * 3 + 1] = -0.99; // y - just above the floor
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14; // z - wider area
      
      // Smaller sizes
      scales[i] = Math.random() * 0.6 + 0.2; // 0.2 to 0.8 - smaller
      
      // Random opacities
      opacities[i] = Math.random() * 0.5 + 0.4; // 0.4 to 0.9 - more visible
    }
    
    return { positions, scales, opacities, puddleCount };
  }, []);
  
  // Subtle animation of the stains
  useFrame((state) => {
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
          <circleGeometry args={[1, 16]} />
          <meshBasicMaterial
            color="#4A0000" // Dark blood red
            transparent={true}
            opacity={bloodPuddles.opacities[index]}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Additional smaller stains - REDUCED QUANTITY */}
      {Array.from({ length: 15 }).map((_, index) => (
        <mesh
          key={`splatter-${index}`}
          position={[
            (Math.random() - 0.5) * 12,
            -0.98,
            (Math.random() - 0.5) * 12
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
          scale={[Math.random() * 0.25 + 0.05, Math.random() * 0.25 + 0.05, 1]} // Smaller
        >
          <circleGeometry args={[0.5, 8]} />
          <meshBasicMaterial
            color="#2D0000" // Even darker blood red
            transparent={true}
            opacity={Math.random() * 0.7 + 0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Salpicaduras muy pequeñas adicionales */}
      {Array.from({ length: 40 }).map((_, index) => (
        <mesh
          key={`micro-splatter-${index}`}
          position={[
            (Math.random() - 0.5) * 14,
            -0.97,
            (Math.random() - 0.5) * 14
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
          scale={[Math.random() * 0.15 + 0.03, Math.random() * 0.15 + 0.03, 1]} // Muy pequeñas
        >
          <circleGeometry args={[0.3, 6]} />
          <meshBasicMaterial
            color="#1A0000" // Rojo sangre muy oscuro
            transparent={true}
            opacity={Math.random() * 0.6 + 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default BloodFloor; 