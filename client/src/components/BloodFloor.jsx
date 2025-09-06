import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BloodFloor = () => {
  const meshRef = useRef();
  
  

  return (
    <group ref={meshRef}>
      
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