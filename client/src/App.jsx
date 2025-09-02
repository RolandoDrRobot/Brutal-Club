import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState, useEffect } from "react";
import Experience from "./components/Experience";
import LoadingScreen from "./components/LoadingScreen";
import { useModelLoader } from "./hooks/useModelLoader";
import { useCharacterAnimations } from "./contexts/CharacterAnimations";

// Lazy loading for heavy non-critical components
const Interface = React.lazy(() => import("./components/Interface"));
const HealthBars = React.lazy(() => import("./components/HealthBars"));
const CrowdSound = React.lazy(() => import("./components/CrowdSound"));
const PunchSound = React.lazy(() => import("./components/PunchSound"));
const CurrencyBar = React.lazy(() => import("./components/CurrencyBar"));

// 🚀 OPTIMIZATION: Lazy load even more components
const MusicPlayer = React.lazy(() => import("./components/MusicPlayer"));
const ParticleEffect = React.lazy(() => import("./components/ParticleEffect"));

// Componente de fallback ligero para Suspense
const ComponentFallback = () => (
  <div style={{ 
    position: 'fixed', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)',
    color: 'transparent',
    fontSize: '14px',
    opacity: 0
  }}>
  </div>
);

function App() {
  const { isLoading, loadingProgress, loadingStatus } = useModelLoader();
  const { currentScreen } = useCharacterAnimations();
  
  // 🚀 MOBILE OPTIMIZATION: Track if UI is ready to show
  const [uiReady, setUiReady] = useState(false);
  const [showAudioComponents, setShowAudioComponents] = useState(false);

  // 🚀 MOBILE OPTIMIZATION: Show UI only after initial load
  useEffect(() => {
    if (!isLoading && loadingProgress >= 35) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setUiReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingProgress]);

  // 🚀 MOBILE OPTIMIZATION: Show audio components after UI is ready
  useEffect(() => {
    if (uiReady) {
      const timer = setTimeout(() => {
        setShowAudioComponents(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [uiReady]);

  return (
    <>
      {/* Pantalla de carga - se muestra mientras cargan los modelos y audio */}
      {isLoading && <LoadingScreen progress={loadingProgress} status={loadingStatus} />}
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000000',
        zIndex: -1
      }} />
      
      <Canvas
        camera={{ position: [0, 1.5, 3.0], fov: 75 }}
        shadows
        gl={{ 
          preserveDrawingBuffer: true, 
          alpha: true,
          // 🚀 MOBILE OPTIMIZATION: WebGL optimizations for mobile
          powerPreference: 'high-performance',
          antialias: false, // Disable antialiasing for better performance
          stencil: false,   // Disable stencil buffer if not needed
          depth: true       // Keep depth buffer for 3D rendering
        }}
        style={{ background: 'transparent' }}
        // 🚀 MOBILE OPTIMIZATION: Performance optimizations
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        dpr={[1, 2]} // Limit device pixel ratio for better performance
      >
        {/* Atmospheric fog for dark tavern basement - Enhanced */}
        <fog attach="fog" args={['#1a1610', 3, 12]} />
        <Experience />
      </Canvas>
      
      {/* Cargar UI componentes de forma lazy solo después de que el 3D esté listo */}
      {uiReady && (
        <Suspense fallback={<ComponentFallback />}>
          <Interface />
          {/* Solo mostrar HealthBars durante el combate */}
          {currentScreen === 'combat' && <HealthBars />}
        </Suspense>
      )}
      
      {/* 🚀 MOBILE OPTIMIZATION: Load audio components with delay */}
      {showAudioComponents && (
        <Suspense fallback={null}>
          <CrowdSound />
          <PunchSound />
        </Suspense>
      )}
      
      {/* Persistent Currency Bar - Visible on all screens except cover/dance */}
      {uiReady && currentScreen !== 'dance' && (
        <Suspense fallback={null}>
          <CurrencyBar />
        </Suspense>
      )}
    </>
  );
}

export default App;
