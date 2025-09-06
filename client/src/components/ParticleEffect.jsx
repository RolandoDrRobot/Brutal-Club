import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleEffect = () => {
  const groupRef = useRef();
  
  const particleCount = 25;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const initialY = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.random() * 8 + 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      
      initialY[i] = positions[i * 3 + 1];
      
      velocities[i * 3] = 0.015 + Math.random() * 0.01;
      velocities[i * 3 + 1] = -Math.random() * 0.03 - 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
    }
    
    return { positions, velocities, initialY };
  }, []);

  const droplets = useMemo(() => {
    const drops = [];
    for (let i = 0; i < particleCount; i++) {
      drops.push({
        position: [
          particles.positions[i * 3],
          particles.positions[i * 3 + 1],
          particles.positions[i * 3 + 2]
        ],
        velocity: [
          particles.velocities[i * 3],
          particles.velocities[i * 3 + 1],
          particles.velocities[i * 3 + 2]
        ]
      });
    }
    return drops;
  }, [particles]);
  
  useFrame((state) => {
    if (groupRef.current && groupRef.current.children) {
      groupRef.current.children.forEach((drop, i) => {
        if (drop && drop.position) {
          drop.position.x += droplets[i].velocity[0];
          drop.position.y += droplets[i].velocity[1];
          drop.position.z += droplets[i].velocity[2];
          
          droplets[i].velocity[1] -= 0.0005;
          
          if (drop.position.y < -3) {
            drop.position.x = (Math.random() - 0.5) * 15;
            drop.position.y = Math.random() * 3 + 6;
            drop.position.z = (Math.random() - 0.5) * 8;
            droplets[i].velocity[0] = 0.015 + Math.random() * 0.01;
            droplets[i].velocity[1] = -Math.random() * 0.02 - 0.01;
            droplets[i].velocity[2] = (Math.random() - 0.5) * 0.008;
          }
          
          if (Math.abs(drop.position.x) > 8) {
            drop.position.x = (Math.random() - 0.5) * 15;
          }
          if (Math.abs(drop.position.z) > 5) {
            drop.position.z = (Math.random() - 0.5) * 8;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {droplets.map((droplet, index) => (
        <mesh
          key={index}
          position={droplet.position}
        >
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial
            color="#8B0000"
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export default ParticleEffect; 