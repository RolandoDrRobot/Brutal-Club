import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane, Cylinder } from '@react-three/drei';

const BarBasement = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child.type === 'PointLight') {
          child.intensity = 0.6 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Suelo de concreto del sótano */}
      <Plane
        args={[12, 12]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.01, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.9}
          metalness={0.1}
        />
      </Plane>

      {/* Techo bajo del sótano */}
      <Plane
        args={[12, 12]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 6, 0]}
      >
        <meshStandardMaterial 
          color="#0d0d0d" 
          roughness={0.8}
        />
      </Plane>

      {/* Paredes del sótano */}
      {/* Pared trasera */}
      <Box args={[12, 8, 0.3]} position={[0, 3, -6]} castShadow>
        <meshStandardMaterial 
          color="#2d2d2d" 
          roughness={0.9}
        />
      </Box>

      {/* Pared frontal */}
      <Box args={[12, 8, 0.3]} position={[0, 3, 6]} castShadow>
        <meshStandardMaterial 
          color="#2d2d2d" 
          roughness={0.9}
        />
      </Box>

      {/* Pared izquierda */}
      <Box args={[0.3, 8, 12]} position={[-6, 3, 0]} castShadow>
        <meshStandardMaterial 
          color="#2d2d2d" 
          roughness={0.9}
        />
      </Box>

      {/* Pared derecha */}
      <Box args={[0.3, 8, 12]} position={[6, 3, 0]} castShadow>
        <meshStandardMaterial 
          color="#2d2d2d" 
          roughness={0.9}
        />
      </Box>

      {/* BARRA DEL BAR DETALLADA */}
      <group position={[0, -0.7, -5.5]}>
        {/* Base principal de la barra */}
        <Box args={[4, 0.8, 1]} position={[0, 0.1, 0]} castShadow>
          <meshStandardMaterial 
            color="#5c4033" 
            roughness={0.8}
          />
        </Box>

        {/* Mostrador superior de madera con vetas */}
        <Box args={[4.2, 0.05, 1.2]} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial 
            color="#8b6f47" 
            roughness={0.3}
            metalness={0.1}
          />
        </Box>

        {/* Borde del mostrador con detalles */}
        <Box args={[4.2, 0.03, 0.06]} position={[0, 0.53, 0.57]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        <Box args={[4.2, 0.03, 0.06]} position={[0, 0.53, -0.57]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>

        {/* Soportes verticales del mostrador */}
        <Box args={[0.1, 0.8, 0.1]} position={[-1.8, 0.1, 0]} castShadow>
          <meshStandardMaterial color="#5c4033" />
        </Box>
        <Box args={[0.1, 0.8, 0.1]} position={[0, 0.1, 0]} castShadow>
          <meshStandardMaterial color="#5c4033" />
        </Box>
        <Box args={[0.1, 0.8, 0.1]} position={[1.8, 0.1, 0]} castShadow>
          <meshStandardMaterial color="#5c4033" />
        </Box>

        {/* Estantes traseros con marco decorativo */}
        {/* Marco lateral izquierdo */}
        <Box args={[0.05, 1, 0.3]} position={[-1.9, 1.1, -0.5]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        {/* Marco lateral derecho */}
        <Box args={[0.05, 1, 0.3]} position={[1.9, 1.1, -0.5]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        
        {/* Estante inferior */}
        <Box args={[3.8, 0.03, 0.25]} position={[0, 0.8, -0.5]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        
        {/* Estante medio */}
        <Box args={[3.8, 0.03, 0.25]} position={[0, 1.1, -0.5]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        
        {/* Estante superior */}
        <Box args={[3.8, 0.03, 0.25]} position={[0, 1.4, -0.5]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>

        {/* Respaldo de los estantes con textura */}
        <Box args={[3.8, 0.8, 0.03]} position={[0, 1.1, -0.62]} castShadow>
          <meshStandardMaterial 
            color="#5c4033" 
            roughness={0.9}
          />
        </Box>

        {/* Botellas en estante inferior con más variedad */}
        {Array.from({ length: 5 }, (_, i) => (
          <group key={`bottom-group-${i}`} position={[-1.6 + i * 0.8, 0.9, -0.5]}>
            <Cylinder 
              args={[0.025, 0.025, 0.2]} 
              castShadow
            >
              <meshStandardMaterial 
                color={
                  i % 5 === 0 ? "#2d5a2d" :
                  i % 5 === 1 ? "#8b4513" :
                  i % 5 === 2 ? "#4a4a4a" :
                  i % 5 === 3 ? "#654321" :
                  "#1a1a1a"
                }
                roughness={0.1}
                metalness={0.3}
              />
            </Cylinder>
            {/* Etiquetas en las botellas */}
            <Box args={[0.04, 0.06, 0.01]} position={[0, 0, 0.026]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
          </group>
        ))}

        {/* Botellas en estante medio con formas variadas */}
        {Array.from({ length: 4 }, (_, i) => (
          <group key={`middle-group-${i}`} position={[-1.2 + i * 0.8, 1.2, -0.5]}>
            <Cylinder 
              args={i % 2 === 0 ? [0.025, 0.025, 0.2] : [0.02, 0.03, 0.25]} 
              castShadow
            >
              <meshStandardMaterial 
                color={
                  i % 4 === 0 ? "#8b0000" :
                  i % 4 === 1 ? "#4169e1" :
                  i % 4 === 2 ? "#228b22" :
                  "#800080"
                }
                roughness={0.1}
                metalness={0.2}
              />
            </Cylinder>
            {/* Etiquetas doradas para licores premium */}
            <Box args={[0.04, 0.05, 0.01]} position={[0, 0, 0.026]}>
              <meshStandardMaterial color="#ffd700" />
            </Box>
          </group>
        ))}

        {/* Botellas en estante superior - licores premium */}
        {Array.from({ length: 3 }, (_, i) => (
          <group key={`top-group-${i}`} position={[-0.8 + i * 0.8, 1.5, -0.5]}>
            <Cylinder 
              args={[0.025, 0.025, 0.2]} 
              castShadow
            >
              <meshStandardMaterial 
                color={
                  i % 3 === 0 ? "#ffd700" :
                  i % 3 === 1 ? "#8b008b" :
                  "#ff6347"
                }
                roughness={0.1}
                metalness={0.4}
              />
            </Cylinder>
            {/* Etiquetas premium con detalles */}
            <Box args={[0.04, 0.08, 0.01]} position={[0, 0, 0.026]}>
              <meshStandardMaterial color="#000000" />
            </Box>
            <Box args={[0.03, 0.02, 0.01]} position={[0, 0.02, 0.027]}>
              <meshStandardMaterial color="#ffd700" />
            </Box>
          </group>
        ))}

        {/* Vasos y copas con más variedad - EN LA BARRA */}
        {Array.from({ length: 3 }, (_, i) => (
          <Cylinder 
            key={`glass-${i}`}
            args={i === 1 ? [0.025, 0.02, 0.12] : [0.02, 0.025, 0.08]} 
            position={[-0.8 + i * 0.8, 0.58, 0.25]}
            castShadow
          >
            <meshStandardMaterial 
              color="#f0f8ff"
              transparent
              opacity={0.7}
              roughness={0.1}
              metalness={0.1}
            />
          </Cylinder>
        ))}

        {/* Jarras de cerveza con más detalle - EN LA BARRA */}
        {Array.from({ length: 2 }, (_, i) => (
          <group key={`mug-${i}`} position={[-0.5 + i * 1, 0.58, -0.08]}>
            <Cylinder args={[0.04, 0.04, 0.1]} castShadow>
              <meshStandardMaterial 
                color="#8b4513" 
                roughness={0.6}
              />
            </Cylinder>
            {/* Asa de la jarra con más detalle */}
            <Box args={[0.012, 0.06, 0.012]} position={[0.05, 0, 0]}>
              <meshStandardMaterial color="#8b4513" />
            </Box>
            {/* Espuma de cerveza */}
            <Cylinder args={[0.035, 0.035, 0.02]} position={[0, 0.06, 0]}>
              <meshStandardMaterial color="#fffacd" />
            </Cylinder>
          </group>
        ))}

        {/* Sistema de grifos mejorado - EN LA BARRA */}
        <group position={[0.8, 0.57, 0.2]}>
          {/* Base del grifo */}
          <Box args={[0.15, 0.03, 0.08]} position={[0, -0.02, 0]}>
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
          </Box>
          {/* Grifo principal */}
          <Cylinder args={[0.015, 0.015, 0.12]} rotation={[Math.PI/2, 0, 0]}>
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
          </Cylinder>
          {/* Manija del grifo */}
          <Box args={[0.025, 0.05, 0.012]} position={[0, 0, -0.06]}>
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
          </Box>
          {/* Segundo grifo */}
          <Cylinder args={[0.012, 0.012, 0.1]} rotation={[Math.PI/2, 0, 0]} position={[0.08, 0, 0]}>
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
          </Cylinder>
        </group>

        {/* Accesorios del bar mejorados - EN LA BARRA */}
        {/* Servilletas apiladas */}
        <Box args={[0.06, 0.012, 0.06]} position={[-0.2, 0.55, 0]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <Box args={[0.05, 0.008, 0.05]} position={[-0.2, 0.56, 0]} castShadow>
          <meshStandardMaterial color="#f5f5f5" />
        </Box>

        {/* Cenicero con colillas - EN LA BARRA */}
        <Cylinder args={[0.05, 0.05, 0.02]} position={[0.2, 0.55, 0]} castShadow>
          <meshStandardMaterial color="#2f2f2f" />
        </Cylinder>
        {/* Colillas */}
        <Cylinder args={[0.003, 0.003, 0.02]} position={[0.18, 0.56, 0.02]} castShadow>
          <meshStandardMaterial color="#8b4513" />
        </Cylinder>
        <Cylinder args={[0.003, 0.003, 0.015]} position={[0.22, 0.56, -0.015]} castShadow>
          <meshStandardMaterial color="#8b4513" />
        </Cylinder>

        {/* Botella destacada con más detalle - EN LA BARRA */}
        <Cylinder args={[0.03, 0.03, 0.25]} position={[0, 0.67, 0]} castShadow>
          <meshStandardMaterial 
            color="#8b0000" 
            roughness={0.1}
            metalness={0.3}
          />
        </Cylinder>
        {/* Corcho */}
        <Cylinder args={[0.02, 0.02, 0.03]} position={[0, 0.81, 0]} castShadow>
          <meshStandardMaterial color="#daa520" />
        </Cylinder>
        {/* Etiqueta principal */}
        <Box args={[0.05, 0.1, 0.01]} position={[0, 0.67, 0.031]} castShadow>
          <meshStandardMaterial color="#000000" />
        </Box>

        {/* Posavasos - EN LA BARRA */}
        {Array.from({ length: 3 }, (_, i) => (
          <Cylinder 
            key={`coaster-${i}`}
            args={[0.04, 0.04, 0.005]} 
            position={[-0.6 + i * 0.6, 0.525, -0.2]}
            castShadow
          >
            <meshStandardMaterial color="#654321" />
          </Cylinder>
        ))}

        {/* Dispensador de palillos - EN LA BARRA */}
        <Cylinder args={[0.02, 0.02, 0.06]} position={[0.4, 0.56, 0.1]} castShadow>
          <meshStandardMaterial color="#c0c0c0" metalness={0.7} />
        </Cylinder>

        {/* Shaker de cóctel - EN LA BARRA */}
        <Cylinder args={[0.025, 0.02, 0.15]} position={[-0.4, 0.58, 0.1]} castShadow>
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
        </Cylinder>

        {/* Espejo detrás del bar con marco */}
        <Box args={[3.5, 0.6, 0.012]} position={[0, 1.1, -0.66]} castShadow>
          <meshStandardMaterial 
            color="#4a4a4a"
            metalness={0.9}
            roughness={0.1}
          />
        </Box>
        {/* Marco del espejo */}
        <Box args={[3.6, 0.05, 0.02]} position={[0, 1.4, -0.65]} castShadow>
          <meshStandardMaterial color="#8b6f47" />
        </Box>
        <Box args={[3.6, 0.05, 0.02]} position={[0, 0.8, -0.65]} castShadow>
          <meshStandardMaterial color="#8b6f47" />
        </Box>

        {/* Iluminación LED bajo los estantes */}
        <Box args={[3.6, 0.01, 0.02]} position={[0, 0.78, -0.48]} castShadow>
          <meshStandardMaterial 
            color="#ffaa44"
            emissive="#ff8800"
            emissiveIntensity={0.3}
          />
        </Box>
        <Box args={[3.6, 0.01, 0.02]} position={[0, 1.08, -0.48]} castShadow>
          <meshStandardMaterial 
            color="#ffaa44"
            emissive="#ff8800"
            emissiveIntensity={0.3}
          />
        </Box>
      </group>

      {/* TABURETES DEL BAR */}
      {Array.from({ length: 4 }, (_, i) => (
        <group key={`stool-${i}`} position={[-1.5 + i * 1, -1, -3.8]}>
          {/* Base del taburete */}
          <Cylinder args={[0.2, 0.2, 0.05]} position={[0, 0.025, 0]} castShadow>
            <meshStandardMaterial color="#333333" metalness={0.7} />
          </Cylinder>
          {/* Poste central */}
          <Cylinder args={[0.03, 0.03, 0.6]} position={[0, 0.3, 0]} castShadow>
            <meshStandardMaterial color="#333333" metalness={0.7} />
          </Cylinder>
          {/* Asiento */}
          <Cylinder args={[0.18, 0.18, 0.04]} position={[0, 0.62, 0]} castShadow>
            <meshStandardMaterial 
              color="#654321" 
              roughness={0.6}
            />
          </Cylinder>
          {/* Respaldo */}
          <Box args={[0.3, 0.25, 0.03]} position={[0, 0.8, -0.15]} castShadow>
            <meshStandardMaterial 
              color="#654321" 
              roughness={0.6}
            />
          </Box>
          {/* Reposapiés */}
          <Cylinder args={[0.12, 0.12, 0.02]} position={[0, 0.25, 0]} castShadow>
            <meshStandardMaterial color="#333333" metalness={0.7} />
          </Cylinder>
        </group>
      ))}

      {/* ELEMENTOS DECORATIVOS ADICIONALES EN LA BARRA */}
      <group position={[0, -0.7, -5.5]}>
        {/* Caja registradora antigua */}
        <group position={[1.5, 0.55, 0.1]}>
          <Box args={[0.25, 0.15, 0.2]} castShadow>
            <meshStandardMaterial color="#8b4513" />
          </Box>
          {/* Teclas de la caja */}
          {Array.from({ length: 6 }, (_, i) => (
            <Box key={i} args={[0.02, 0.01, 0.02]} position={[-0.08 + (i % 3) * 0.03, 0.08, 0.05 - Math.floor(i / 3) * 0.03]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
          ))}
        </group>

        {/* Bandeja de propinas */}
        <Cylinder args={[0.08, 0.08, 0.02]} position={[-1.5, 0.53, 0.2]} castShadow>
          <meshStandardMaterial color="#8b6f47" />
        </Cylinder>
        {/* Monedas en la bandeja */}
        {Array.from({ length: 3 }, (_, i) => (
          <Cylinder key={i} args={[0.01, 0.01, 0.002]} position={[-1.5 + i * 0.015, 0.542, 0.2 + i * 0.01]} castShadow>
            <meshStandardMaterial color="#ffd700" metalness={0.8} />
          </Cylinder>
        ))}

        {/* Menú de bebidas en la pared */}
        <Box args={[0.01, 0.4, 0.3]} position={[0, 1.8, -0.6]} castShadow>
          <meshStandardMaterial color="#000000" />
        </Box>
        <Box args={[0.005, 0.35, 0.25]} position={[0, 1.8, -0.595]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </Box>

        {/* Estante para copas colgando */}
        <Box args={[1.5, 0.03, 0.15]} position={[0, 1.7, 0.3]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        {/* Copas colgando */}
        {Array.from({ length: 4 }, (_, i) => (
          <Cylinder 
            key={`hanging-glass-${i}`}
            args={[0.02, 0.025, 0.1]} 
            position={[-0.6 + i * 0.4, 1.62, 0.3]}
            castShadow
          >
            <meshStandardMaterial 
              color="#f0f8ff"
              transparent
              opacity={0.7}
            />
          </Cylinder>
        ))}

        {/* Limones y limas decorativos */}
        <group position={[0.6, 0.55, 0.3]}>
          {/* Limones */}
          {Array.from({ length: 3 }, (_, i) => (
            <Cylinder key={`lemon-${i}`} args={[0.02, 0.02, 0.03]} position={[i * 0.04, 0, 0]} castShadow>
              <meshStandardMaterial color="#ffff00" />
            </Cylinder>
          ))}
          {/* Limas */}
          {Array.from({ length: 2 }, (_, i) => (
            <Cylinder key={`lime-${i}`} args={[0.018, 0.018, 0.025]} position={[i * 0.04, 0, -0.05]} castShadow>
              <meshStandardMaterial color="#32cd32" />
            </Cylinder>
          ))}
        </group>

        {/* Cubo de hielo */}
        <Box args={[0.12, 0.08, 0.12]} position={[-0.6, 0.54, 0.3]} castShadow>
          <meshStandardMaterial 
            color="#e6f3ff"
            transparent
            opacity={0.8}
          />
        </Box>

        {/* Abridor de botellas montado */}
        <Box args={[0.08, 0.02, 0.01]} position={[-1.8, 0.6, 0]} castShadow>
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
        </Box>

        {/* Reloj de pared vintage */}
        <group position={[0, 2.5, -0.6]}>
          <Cylinder args={[0.15, 0.15, 0.03]} castShadow>
            <meshStandardMaterial color="#8b4513" />
          </Cylinder>
          <Cylinder args={[0.12, 0.12, 0.005]} position={[0, 0, 0.02]} castShadow>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
          {/* Manecillas del reloj */}
          <Box args={[0.08, 0.005, 0.001]} position={[0, 0, 0.025]} castShadow>
            <meshStandardMaterial color="#000000" />
          </Box>
          <Box args={[0.05, 0.003, 0.001]} position={[0, 0, 0.026]} rotation={[0, 0, Math.PI/3]} castShadow>
            <meshStandardMaterial color="#000000" />
          </Box>
        </group>

        {/* Espejo pequeño decorativo */}
        <Cylinder args={[0.08, 0.08, 0.01]} position={[1.8, 1.5, -0.6]} castShadow>
          <meshStandardMaterial 
            color="#4a4a4a"
            metalness={0.9}
            roughness={0.1}
          />
        </Cylinder>

        {/* Botella de aceitunas */}
        <Cylinder args={[0.02, 0.02, 0.08]} position={[0.8, 0.54, 0.25]} castShadow>
          <meshStandardMaterial 
            color="#f0f8ff"
            transparent
            opacity={0.8}
          />
        </Cylinder>
        {/* Aceitunas dentro */}
        {Array.from({ length: 4 }, (_, i) => (
          <Cylinder key={`olive-${i}`} args={[0.004, 0.004, 0.006]} position={[0.8, 0.52 + i * 0.01, 0.25]} castShadow>
            <meshStandardMaterial color="#228b22" />
          </Cylinder>
        ))}
      </group>

      {/* Tuberías del techo */}
      <group position={[0, 5.5, 0]}>
        {/* Tubería principal horizontal */}
        <Cylinder args={[0.1, 0.1, 10]} rotation={[0, 0, Math.PI/2]} position={[0, 0, -2]}>
          <meshStandardMaterial 
            color="#666666" 
            roughness={0.4}
            metalness={0.8}
          />
        </Cylinder>
        
        {/* Tuberías secundarias */}
        <Cylinder args={[0.08, 0.08, 8]} position={[-3, 0, 0]}>
          <meshStandardMaterial 
            color="#666666" 
            roughness={0.4}
            metalness={0.8}
          />
        </Cylinder>
        
        <Cylinder args={[0.08, 0.08, 8]} position={[3, 0, 0]}>
          <meshStandardMaterial 
            color="#666666" 
            roughness={0.4}
            metalness={0.8}
          />
        </Cylinder>

        {/* Conexiones de tubería */}
        {[-3, 0, 3].map((x, i) => (
          <Box key={i} args={[0.2, 0.2, 0.2]} position={[x, 0, -2]}>
            <meshStandardMaterial color="#555555" metalness={0.8} />
          </Box>
        ))}
      </group>

      {/* Luces colgantes del techo */}
      <group>
        {[-2, 0, 2].map((x, i) => (
          <group key={i} position={[x, 5.5, 1]}>
            {/* Cable */}
            <Cylinder args={[0.015, 0.015, 1.5]} position={[0, -0.75, 0]}>
              <meshStandardMaterial color="#333333" />
            </Cylinder>
            {/* Pantalla de lámpara */}
            <Cylinder args={[0.4, 0.3, 0.6]} position={[0, -1.8, 0]}>
              <meshStandardMaterial 
                color="#ffaa44"
                emissive="#ff8800"
                emissiveIntensity={0.4}
              />
            </Cylinder>
            {/* Luz */}
            <pointLight
              position={[0, -1.8, 0]}
              intensity={1}
              distance={8}
              color="#ffaa44"
              castShadow
            />
          </group>
        ))}
      </group>

      {/* Ventilador de techo en una esquina */}
      <group position={[-4, 5.5, -4]}>
        <Cylinder args={[0.08, 0.08, 0.2]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#333333" />
        </Cylinder>
        {/* Aspas del ventilador */}
        {Array.from({ length: 4 }, (_, i) => (
          <Box 
            key={i}
            args={[1.5, 0.04, 0.15]} 
            position={[0, -0.15, 0]}
            rotation={[0, (i * Math.PI) / 2, 0]}
          >
            <meshStandardMaterial color="#555555" />
          </Box>
        ))}
      </group>

      {/* Señales y carteles en las paredes */}
      <group position={[-5.9, 2.5, 0]}>
        <Box args={[0.04, 0.8, 1.2]} castShadow>
          <meshStandardMaterial color="#8b0000" />
        </Box>
      </group>

      <group position={[5.9, 3, -3]}>
        <Box args={[0.04, 0.6, 1]} castShadow>
          <meshStandardMaterial color="#2d5a2d" />
        </Box>
      </group>

      {/* ELEMENTOS DE ALMACÉN DEL SÓTANO */}
      {/* Estantería de almacén en la pared izquierda */}
      <group position={[-5, 0, 2]}>
        {/* Estructura principal del estante */}
        <Box args={[0.8, 3, 0.05]} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.8} />
        </Box>
        
        {/* Estantes horizontales */}
        {Array.from({ length: 4 }, (_, i) => (
          <Box key={`shelf-${i}`} args={[0.8, 0.03, 0.3]} position={[0, 0.2 + i * 0.4, 0.125]} castShadow>
            <meshStandardMaterial color="#654321" roughness={0.8} />
          </Box>
        ))}
        
        {/* Soportes verticales */}
        <Box args={[0.05, 3, 0.3]} position={[-0.35, 0.5, 0.125]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
        <Box args={[0.05, 3, 0.3]} position={[0.35, 0.5, 0.125]} castShadow>
          <meshStandardMaterial color="#654321" />
        </Box>
      </group>

      {/* Cajas de licor en los estantes */}
      <group position={[-5, 0, 2]}>
        {/* Cajas en estante inferior */}
        {Array.from({ length: 3 }, (_, i) => (
          <Box key={`box-bottom-${i}`} args={[0.2, 0.15, 0.25]} position={[-0.25 + i * 0.25, 0.275, 0.125]} castShadow>
            <meshStandardMaterial 
              color={i % 3 === 0 ? "#8b4513" : i % 3 === 1 ? "#654321" : "#5c4033"} 
              roughness={0.9}
            />
          </Box>
        ))}
        
        {/* Cajas en segundo estante */}
        {Array.from({ length: 2 }, (_, i) => (
          <Box key={`box-mid1-${i}`} args={[0.18, 0.12, 0.22]} position={[-0.15 + i * 0.3, 0.66, 0.125]} castShadow>
            <meshStandardMaterial color="#8b4513" roughness={0.9} />
          </Box>
        ))}
        
        {/* Cajas en tercer estante */}
        {Array.from({ length: 3 }, (_, i) => (
          <Box key={`box-mid2-${i}`} args={[0.15, 0.1, 0.2]} position={[-0.2 + i * 0.2, 1.05, 0.125]} castShadow>
            <meshStandardMaterial color="#654321" roughness={0.9} />
          </Box>
        ))}
        
        {/* Cajas en estante superior */}
        <Box args={[0.25, 0.18, 0.24]} position={[0, 1.49, 0.125]} castShadow>
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </Box>
      </group>

      {/* Etiquetas en algunas cajas */}
      <group position={[-5, 0, 2]}>
        <Box args={[0.12, 0.06, 0.001]} position={[-0.25, 0.275, 0.251]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <Box args={[0.1, 0.04, 0.001]} position={[0, 0.275, 0.251]} castShadow>
          <meshStandardMaterial color="#ffd700" />
        </Box>
        <Box args={[0.08, 0.05, 0.001]} position={[-0.15, 0.66, 0.231]} castShadow>
          <meshStandardMaterial color="#ff0000" />
        </Box>
      </group>

      {/* Más cajas sueltas distribuidas */}
      <group position={[1, -1, 4.8]}>
        <Box args={[0.4, 0.3, 0.35]} position={[0, 0.15, 0]} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </Box>
        <Box args={[0.35, 0.25, 0.3]} position={[0, 0.425, 0]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.9} />
        </Box>
      </group>

      <group position={[-4.5, -1, 0]}>
        <Box args={[0.3, 0.2, 0.28]} position={[0, 0.1, 0]} castShadow>
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </Box>
      </group>

      <group position={[4.2, -1, -1]}>
        <Box args={[0.32, 0.22, 0.3]} position={[0, 0.11, 0]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.9} />
        </Box>
        <Box args={[0.28, 0.18, 0.26]} position={[0, 0.33, 0]} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </Box>
      </group>

      {/* CAJAS ADICIONALES DISTRIBUIDAS POR EL SÓTANO */}
      {/* Esquina delantera izquierda */}
      <group position={[-4, -1, 4]}>
        <Box args={[0.35, 0.25, 0.32]} position={[0, 0.125, 0]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.9} />
        </Box>
        <Box args={[0.3, 0.2, 0.28]} position={[0.4, 0.1, 0]} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </Box>
        <Box args={[0.25, 0.15, 0.25]} position={[0, 0.375, 0]} castShadow>
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </Box>
      </group>

      {/* Esquina delantera derecha */}
      <group position={[4, -1, 4]}>
        <Box args={[0.4, 0.3, 0.35]} position={[0, 0.15, 0]} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </Box>
        <Box args={[0.35, 0.25, 0.3]} position={[-0.5, 0.125, 0]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.9} />
        </Box>
        <Box args={[0.28, 0.18, 0.26]} position={[0, 0.45, 0]} castShadow>
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </Box>
      </group>

      {/* Centro-derecha */}
      <group position={[3, -1, 1]}>
        <Box args={[0.3, 0.22, 0.28]} position={[0, 0.11, 0]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.9} />
        </Box>
        <Box args={[0.25, 0.18, 0.24]} position={[0.35, 0.09, 0]} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </Box>
      </group>

      {/* Centro-izquierda */}
      <group position={[-3, -1, 1]}>
        <Box args={[0.32, 0.24, 0.3]} position={[0, 0.12, 0]} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </Box>
        <Box args={[0.28, 0.2, 0.26]} position={[-0.4, 0.1, 0]} castShadow>
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </Box>
      </group>

      {/* Lado izquierdo medio */}
      <group position={[-4.5, -1, -2]}>
        <Box args={[0.35, 0.28, 0.32]} position={[0, 0.14, 0]} castShadow>
          <meshStandardMaterial color="#8b4513" roughness={0.9} />
        </Box>
        <Box args={[0.3, 0.22, 0.28]} position={[0, 0.42, 0]} castShadow>
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </Box>
      </group>

      {/* Lado derecho medio */}
      <group position={[4.5, -1, -2]}>
        <Box args={[0.33, 0.26, 0.3]} position={[0, 0.13, 0]} castShadow>
          <meshStandardMaterial color="#5c4033" roughness={0.9} />
        </Box>
      </group>

      {/* Botellas sueltas en el suelo - MÁS DISTRIBUIDAS */}
      <group position={[-1, -1, -3]}>
        {Array.from({ length: 4 }, (_, i) => (
          <Cylinder key={`floor-bottle-${i}`} args={[0.025, 0.025, 0.2]} position={[i * 0.15, 0.1, 0]} castShadow>
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#2d5a2d" : "#8b4513"} 
              roughness={0.1}
              metalness={0.3}
            />
          </Cylinder>
        ))}
      </group>

      {/* Más botellas dispersas */}
      <group position={[2, -1, -4]}>
        {Array.from({ length: 6 }, (_, i) => (
          <Cylinder key={`scatter-bottle-1-${i}`} args={[0.025, 0.025, 0.2]} position={[(i % 3) * 0.2, 0.1, Math.floor(i / 3) * 0.15]} castShadow>
            <meshStandardMaterial 
              color={
                i % 4 === 0 ? "#2d5a2d" :
                i % 4 === 1 ? "#8b4513" :
                i % 4 === 2 ? "#4a4a4a" :
                "#8b0000"
              }
              roughness={0.1}
              metalness={0.3}
            />
          </Cylinder>
        ))}
      </group>

      {/* Grupo de botellas en esquina */}
      <group position={[-3.5, -1, -4.5]}>
        {Array.from({ length: 5 }, (_, i) => (
          <Cylinder key={`corner-bottle-${i}`} args={[0.025, 0.025, 0.2]} position={[(i % 3) * 0.12, 0.1, Math.floor(i / 3) * 0.12]} castShadow>
            <meshStandardMaterial 
              color={
                i % 5 === 0 ? "#ffd700" :
                i % 5 === 1 ? "#8b008b" :
                i % 5 === 2 ? "#228b22" :
                i % 5 === 3 ? "#ff6347" :
                "#4169e1"
              }
              roughness={0.1}
              metalness={0.4}
            />
          </Cylinder>
        ))}
      </group>

      {/* Botellas cerca del bar */}
      <group position={[1.5, -1, -3.5]}>
        {Array.from({ length: 4 }, (_, i) => (
          <Cylinder key={`bar-area-bottle-${i}`} args={[0.025, 0.025, 0.2]} position={[i * 0.18, 0.1, 0]} castShadow>
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#654321" : "#1a1a1a"} 
              roughness={0.1}
              metalness={0.3}
            />
          </Cylinder>
        ))}
      </group>

      {/* Cajas con etiquetas adicionales */}
      <group position={[-4, -1, 4]}>
        <Box args={[0.08, 0.04, 0.001]} position={[0, 0.25, 0.161]} castShadow>
          <meshStandardMaterial color="#ffffff" />
        </Box>
      </group>

      <group position={[4, -1, 4]}>
        <Box args={[0.1, 0.05, 0.001]} position={[0, 0.3, 0.176]} castShadow>
          <meshStandardMaterial color="#ffd700" />
        </Box>
      </group>

      <group position={[3, -1, 1]}>
        <Box args={[0.06, 0.03, 0.001]} position={[0, 0.22, 0.141]} castShadow>
          <meshStandardMaterial color="#ff0000" />
        </Box>
      </group>
    </group>
  );
};

export default BarBasement; 