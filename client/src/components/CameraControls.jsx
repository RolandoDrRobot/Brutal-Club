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
  
  // Store initial camera position
  useEffect(() => {
    if (!initialCameraPosition.current) {
      initialCameraPosition.current = camera.position.clone();
    }
  }, [camera]);

  // Cámara cinematográfica de pelea para capturar luchadores de perfil
  useFrame((state, delta) => {
    if (!isCombatMode && orbitControlsRef.current) {
      timeRef.current += delta;
      
              // CÁMARA ORBITAL MUY CERCA DE LOS MODELOS
        const orbitSpeed = 0.3; // Velocidad del giro orbital
        const orbitAngle = timeRef.current * orbitSpeed; // Ángulo que incrementa continuamente
        const baseDistance = 2.2; // Distancia MUY CERCANA a los modelos
        const baseHeight = 0.8; // Altura cercana para capturar mejor los modelos

        // Variaciones sutiles para movimiento más natural
        const heightVariation = Math.sin(timeRef.current * 0.4) * 0.15; // Ligera variación de altura
        const distanceVariation = Math.cos(timeRef.current * 0.6) * 0.2; // Ligera variación de distancia
        const heightOffset = Math.cos(orbitAngle * 1.3) * 0.1; // Altura que varía con el orbit
      
              // POSICIÓN ORBITAL ALREDEDOR DE LOS MODELOS
        const finalDistance = baseDistance + distanceVariation;
        const x = finalDistance * Math.cos(orbitAngle);
        const z = finalDistance * Math.sin(orbitAngle);
        const y = baseHeight + heightVariation + heightOffset;
      
      // Posicionar cámara lateralmente
      camera.position.x = x;
      camera.position.y = y; 
      camera.position.z = z;
      
      // SIEMPRE APUNTAR AL CENTRO DONDE ESTÁN LOS MODELOS
      const targetX = 0; // Centro exacto donde están los luchadores
      const targetY = 0.3; // Nivel del pecho/torso de los modelos
      const targetZ = 0; // Centro exacto
      
      // Enfocar directamente a los luchadores
      camera.lookAt(targetX, targetY, targetZ);
      
      // Sin roll, queremos una toma limpia y profesional
      camera.rotation.z = 0;
      
      // Update orbit controls target
      orbitControlsRef.current.target.set(targetX, targetY, targetZ);
      orbitControlsRef.current.update();
    }
  });

  // Reset camera when switching modes
  useEffect(() => {
    if (isCombatMode && initialCameraPosition.current) {
      // Reset to initial position for combat mode
      camera.position.copy(initialCameraPosition.current);
      camera.rotation.z = 0; // Reset roll
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(0, 0, 0);
        orbitControlsRef.current.update();
      }
    }
  }, [isCombatMode, camera]);

  return (
    <>
      <OrbitControls 
        ref={orbitControlsRef}
        enabled={isCombatMode} // Only enable manual controls in combat mode
        enablePan={true}
        enableZoom={true}
        enableRotate={isCombatMode}
        minDistance={3}
        maxDistance={5}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};
