import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BloodFloor = () => {
  const meshRef = useRef();
  
  const bloodPuddles = useMemo(() => {
    const puddleCount = 0;
    const positions = new Float32Array(puddleCount * 3);
    const scales = new Float32Array(puddleCount);
    const opacities = new Float32Array(puddleCount);
    
    for (let i = 0; i < puddleCount; i++) {
      const fightCenterX = Math.random() > 0.5 ? -0.4 : 0.4;
      const fightCenterZ = 0;
      
      positions[i * 3] = fightCenterX + (Math.random() - 0.5) * 1.0;
      positions[i * 3 + 1] = -2.98;
      positions[i * 3 + 2] = fightCenterZ + (Math.random() - 0.5) * 0.8;
      
      scales[i] = Math.random() * 0.3 + 0.15;
      
      opacities[i] = Math.random() * 0.4 + 0.7;
    }
    
    return { positions, scales, opacities, puddleCount };
  }, []);
  
  useFrame((state) => {
    if (Math.floor(state.clock.getElapsedTime() * 60) % 4 !== 0) return;
    
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
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
            color="#8B0000"
            transparent={true}
            opacity={bloodPuddles.opacities[index]}
            side={THREE.DoubleSide}
            depthWrite={false}
            renderOrder={1}
          />
        </mesh>
      ))}
      
      {/* Additional smaller stains - VISIBLE splatters */}
      {Array.from({ length: 3 }).map((_, index) => (
        <mesh
          key={`splatter-${index}`}
          position={[
            (Math.random() - 0.5) * 1.5,
            -2.97,
            (Math.random() - 0.5) * 1.0
          ]}
          rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]}
          scale={[Math.random() * 0.15 + 0.05, Math.random() * 0.15 + 0.05, 1]}
        >
          <circleGeometry args={[0.5, 8]} /> {/* Slightly larger geometry */}
          <meshBasicMaterial
            color="#660000"
            transparent={true}
            opacity={Math.random() * 0.4 + 0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
            renderOrder={2}
          />
        </mesh>
      ))}



    </group>
  );
};

export default BloodFloor; 