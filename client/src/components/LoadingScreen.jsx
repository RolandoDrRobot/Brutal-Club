import React from 'react';
import { Box, Text } from '@mantine/core';

const LoadingScreen = ({ progress = 0, status = 'Starting...' }) => {
  // Definir las animaciones como estilos CSS en string
  const keyframes = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes rotate {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    @keyframes glow {
      from { text-shadow: 0 0 15px rgba(245, 245, 220, 0.8); }
      to { text-shadow: 0 0 25px rgba(245, 245, 220, 1), 0 0 35px rgba(245, 245, 220, 0.8); }
    }
    
    @keyframes shimmer {
      0% { 
        background: linear-gradient(90deg, #f32210 0%, #ff6b53 50%, #f32210 100%);
        background-size: 200% 100%;
        background-position: 200% 0;
      }
      100% { 
        background-position: -200% 0;
      }
    }
    
    @keyframes fadeInOut {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { 
        opacity: 0;
        transform: translateY(20px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes buttonPulse {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 0 15px rgba(243, 34, 16, 0.6);
      }
      50% { 
        transform: scale(1.02);
        box-shadow: 0 0 25px rgba(243, 34, 16, 0.8);
      }
    }
  `;

  // 🚀 MOBILE OPTIMIZATION: Show different messages based on progress
  const getProgressMessage = () => {
    if (progress >= 35) {
      return "🎮 ¡Listo para jugar!";
    } else if (progress >= 30) {
      return "🔊 Cargando audio esencial...";
    } else if (progress >= 20) {
      return "🎨 Cargando interfaz...";
    } else if (progress >= 0) {
      return "🚀 Cargando modelos 3D...";
    }
    return status;
  };

  // 🚀 MOBILE OPTIMIZATION: Show playable indicator
  const isPlayable = progress >= 35;

  return (
    <>
      {/* Inyectar estilos CSS */}
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: '#000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        
        {/* Texto de carga principal con efecto neón */}
        <Text 
          size="md" 
          style={{ 
            color: '#F5F5DC',
            marginBottom: '30px',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 500,
            textShadow: '0 0 8px rgba(245, 245, 220, 0.5)',
            animation: 'fadeInOut 2s ease-in-out infinite',
            minHeight: '20px'
          }}
        >
          {getProgressMessage()}
        </Text>
        
        {/* Barra de progreso mejorada */}
        <Box
          style={{
            width: '350px',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0px',
            overflow: 'hidden',
            marginBottom: '15px',
            border: '1px solid rgba(243, 34, 16, 0.3)',
            boxShadow: '0 0 10px rgba(243, 34, 16, 0.2)'
          }}
        >
          <Box
            style={{
              width: `${progress}%`,
              height: '100%',
              background: isPlayable 
                ? 'linear-gradient(90deg, #00ff00, #00cc00, #00ff00)' // Green when playable
                : 'linear-gradient(90deg, #f32210, #ff6b53, #f32210)', // Red when loading
              backgroundSize: '200% 100%',
              borderRadius: '0px',
              transition: 'width 0.5s ease-out, background 0.3s ease-in-out',
              boxShadow: isPlayable 
                ? '0 0 15px rgba(0, 255, 0, 0.8)' // Green glow
                : '0 0 15px rgba(243, 34, 16, 0.8)', // Red glow
              animation: progress > 0 ? 'shimmer 2s ease-in-out infinite' : 'none'
            }}
          />
        </Box>
        
        {/* Porcentaje con estilo mejorado */}
        <Text 
          size="lg" 
          style={{ 
            color: isPlayable ? '#00ff00' : '#f32210',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '18px',
            textShadow: isPlayable 
              ? '0 0 10px rgba(0, 255, 0, 0.6)' // Green shadow
              : '0 0 10px rgba(243, 34, 16, 0.6)', // Red shadow
            transition: 'color 0.3s ease-in-out, text-shadow 0.3s ease-in-out'
          }}
        >
          {Math.round(progress)}%
        </Text>

        {/* 🚀 MOBILE OPTIMIZATION: Show playable indicator */}
        {isPlayable && (
          <Text 
            size="sm" 
            style={{ 
              color: '#00ff00',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '14px',
              marginTop: '10px',
              textShadow: '0 0 8px rgba(0, 255, 0, 0.6)',
              animation: 'fadeInOut 1.5s ease-in-out infinite'
            }}
          >
            ¡Toca para comenzar!
          </Text>
        )}

        {/* 🚀 MOBILE OPTIMIZATION: Show loading tips */}
        {!isPlayable && progress < 20 && (
          <Text 
            size="xs" 
            style={{ 
              color: '#F5F5DC',
              textAlign: 'center',
              opacity: 0.7,
              marginTop: '20px',
              fontSize: '12px',
              maxWidth: '300px'
            }}
          >
            💡 Consejo: En conexiones lentas, la carga puede tomar unos segundos más
          </Text>
        )}
      </Box>
    </>
  );
};

export default LoadingScreen; 