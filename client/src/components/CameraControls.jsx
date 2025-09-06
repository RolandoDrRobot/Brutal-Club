import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import * as THREE from "three";

export const CameraControls = () => {
  const { isCombatMode } = useCharacterAnimations();
  const { camera } = useThree();
  const orbitControlsRef = useRef();
  const timeRef = useRef(0);
  const initialCameraPosition = useRef(null);
  
  useEffect(() => {
    if (!initialCameraPosition.current) {
      initialCameraPosition.current = camera.position.clone();
    }
  }, [camera]);

  useFrame((state, delta) => {
    if (!isCombatMode && orbitControlsRef.current) {
      timeRef.current += delta;
      
      const orbitSpeed = 0.2;
      const orbitAngle = timeRef.current * orbitSpeed;
      const baseDistance = 3.0;
      const baseHeight = 1.9;

      const heightVariation = Math.sin(timeRef.current * 0.3) * 0.1;
      const distanceVariation = Math.cos(timeRef.current * 0.4) * 0.15;
      const heightOffset = Math.cos(orbitAngle * 1.1) * 0.08;
      
        const finalDistance = baseDistance + distanceVariation;
        const x = finalDistance * Math.cos(orbitAngle);
        const z = finalDistance * Math.sin(orbitAngle);
        const y = baseHeight + heightVariation + heightOffset;
      
      camera.position.x = x;
      camera.position.y = y; 
      camera.position.z = z;
      
      const targetX = 0;
      const targetY = -0.5;
      const targetZ = 0;
      
      camera.lookAt(targetX, targetY, targetZ);
      
      camera.rotation.z = 0;
      
      orbitControlsRef.current.target.set(targetX, targetY, targetZ);
      orbitControlsRef.current.update();
    }
  });

  useEffect(() => {
    if (isCombatMode && initialCameraPosition.current) {
      camera.position.set(0, 0.6, 2.8);
      camera.rotation.z = 0;
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(0, -0.1, 0);
        orbitControlsRef.current.update();
      }
      camera.lookAt(0, -0.1, 0);
    }
  }, [isCombatMode, camera]);

  return (
    <>
      <OrbitControls 
        ref={orbitControlsRef}
        enabled={isCombatMode}
        enablePan={true}
        enableZoom={true}
        enableRotate={isCombatMode}
        minDistance={1.5}
        maxDistance={6}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </>
  );
};
