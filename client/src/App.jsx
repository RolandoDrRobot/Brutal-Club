import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import Experience from "./components/Experience";
import LoadingScreen from "./components/LoadingScreen";
import { useModelLoader } from "./hooks/useModelLoader";

// Lazy loading for heavy non-critical components
const Interface = React.lazy(() => import("./components/Interface"));
const HealthBars = React.lazy(() => import("./components/HealthBars"));
const CrowdSound = React.lazy(() => import("./components/CrowdSound"));
const PunchSound = React.lazy(() => import("./components/PunchSound"));

// Componente de fallback ligero para Suspense
const ComponentFallback = () => (
  <div style={{ 
    position: 'fixed', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)',
    color: '#F5F5DC',
    fontSize: '14px',
    opacity: 0.7
  }}>
    Loading...
  </div>
);

function App() {
  const { isLoading, loadingProgress, loadingStatus } = useModelLoader();

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
        camera={{ position: [1.8, 0.3, 0], fov: 80 }}
        shadows
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Experience />
      </Canvas>
      
      {/* Cargar UI componentes de forma lazy solo después de que el 3D esté listo */}
      <Suspense fallback={<ComponentFallback />}>
        <Interface />
        <HealthBars />
        <CrowdSound />
        <PunchSound />
      </Suspense>
    </>
  );
}

export default App;
