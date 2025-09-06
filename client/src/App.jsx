import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState, useEffect } from "react";
import Experience from "./components/Experience";
import LoadingScreen from "./components/LoadingScreen";
import { useModelLoader } from "./hooks/useModelLoader";
import { useCharacterAnimations } from "./contexts/CharacterAnimations";
import { AudioProvider } from "./contexts/AudioContext";
import { InputProvider } from "./contexts/InputContext";
import { EffectProvider } from "./contexts/EffectContext";

const Interface = React.lazy(() => import("./components/Interface"));
const HealthBars = React.lazy(() => import("./components/HealthBars"));
const CrowdSound = React.lazy(() => import("./components/CrowdSound"));
const PunchSound = React.lazy(() => import("./components/PunchSound"));
const CurrencyBar = React.lazy(() => import("./components/CurrencyBar"));


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
  
  const [uiReady, setUiReady] = useState(false);
  const [showAudioComponents, setShowAudioComponents] = useState(false);

  useEffect(() => {
    if (!isLoading && loadingProgress >= 35) {
      const timer = setTimeout(() => {
        setUiReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, loadingProgress]);

  useEffect(() => {
    if (uiReady) {
      const timer = setTimeout(() => {
        setShowAudioComponents(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [uiReady]);

  return (
    <AudioProvider>
      <InputProvider>
        <EffectProvider>
          {(isLoading || loadingProgress < 100) && <LoadingScreen progress={loadingProgress} status={loadingStatus} />}
      
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
          powerPreference: 'high-performance',
          antialias: false,
          stencil: false,
          depth: true
        }}
        style={{ background: 'transparent' }}
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        dpr={[1, 2]}
      >
        <fog attach="fog" args={['#1a1610', 3, 12]} />
        <Experience />
      </Canvas>
      
      {uiReady && (
        <Suspense fallback={<ComponentFallback />}>
          <Interface />
          {currentScreen === 'combat' && <HealthBars />}
        </Suspense>
      )}
      
      {showAudioComponents && (
        <Suspense fallback={null}>
          <CrowdSound />
          <PunchSound />
        </Suspense>
      )}
      
      {uiReady && (
        <Suspense fallback={null}>
          <CurrencyBar />
        </Suspense>
      )}
        </EffectProvider>
      </InputProvider>
    </AudioProvider>
  );
}

export default App;
