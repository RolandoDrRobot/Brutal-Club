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

  // Cámara cinematográfica de pelea para capturar luchadores de perfil - Optimized with frame skipping
  useFrame((state, delta) => {
    if (!isCombatMode && orbitControlsRef.current) {
      // Skip frames for better performance (run at ~30 FPS instead of 60)
      if (Math.floor(state.clock.getElapsedTime() * 60) % 2 !== 0) return;
      
      timeRef.current += delta;
      
              // CÁMARA ORBITAL MUY CERCA DE LOS MODELOS
        const orbitSpeed = 0.3; // Velocidad del giro orbital
        const orbitAngle = timeRef.current * orbitSpeed; // Ángulo que incrementa continuamente
        const baseDistance = 3.0; // Distancia alejada para mejor vista general
        const baseHeight = 1.5; // Altura elevada para ver mejor los peleadores

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
      const targetY = -0.5; // Apuntando a la parte media de los personajes
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
      // Perfect fighting game camera position (side profile view showing both fighters)
      camera.position.set(0, 0.2, 2.8); // Side view from Z-axis, closer to fighters
      camera.rotation.z = 0; // Reset roll
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.set(0, -0.3, 0); // Look at fighter upper torso level
        orbitControlsRef.current.update();
      }
      // Ensure camera looks at the center between both fighters at torso level
      camera.lookAt(0, -0.3, 0);
    }
  }, [isCombatMode, camera]);

  return (
    <>
      <OrbitControls 
        ref={orbitControlsRef}
        enabled={isCombatMode} // Only enable manual controls in combat mode
        enablePan={true} // Allow panning for full camera freedom
        enableZoom={true}
        enableRotate={isCombatMode}
        minDistance={1.5} // Allow getting very close to the action
        maxDistance={10} // Allow wider shots for full scene view
        minPolarAngle={0} // Full vertical range
        maxPolarAngle={Math.PI} // Full vertical range
        // No azimuth angle limits - full 360° rotation freedom
      />
    </>
  );
};
