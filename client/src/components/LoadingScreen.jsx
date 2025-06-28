import React from 'react';
import { Box, Text } from '@mantine/core';

const LoadingScreen = ({ progress = 0, status = 'Iniciando...' }) => {
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
        background: linear-gradient(90deg, #fc3f31 0%, #ff6b53 50%, #fc3f31 100%);
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
  `;

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
        {/* Título FIGHT CLUB centrado con animación */}
        <div
          style={{
            position: 'relative',
            marginBottom: '40px',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          <div style={{
            color: 'rgb(252, 63, 49)',
            textShadow: 'rgb(252, 63, 49) 0px 0px 3px, rgb(252, 63, 49) 0px 0px 6px, rgba(0, 0, 0, 0.8) 2px 2px 4px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: 'Anton, sans-serif',
            fontSize: '50px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ display: 'inline-block', margin: '0px' }}>F</span>
            <span style={{ display: 'inline-block', margin: '0px' }}>I</span>
            <span style={{ display: 'inline-block', margin: '0px' }}>G</span>
            <span style={{ display: 'inline-block', margin: '0px' }}>H</span>
            <span style={{ display: 'inline-block', margin: '0px' }}>T</span>
            <span style={{ display: 'inline-block', margin: '0px 8px' }}>&nbsp;</span>
            <span style={{ display: 'inline-block', margin: '0px' }}>C</span>
            <span style={{ display: 'inline-block', margin: '0px' }}>L</span>
            <span style={{ display: 'inline-block', margin: '0px' }}>U</span>
            <span style={{ display: 'inline-block', margin: '0px' }}>B</span>
          </div>
        </div>
        
        {/* Texto de carga principal con efecto neón */}
        <div className="fight-subtitle">
          You do not talk about fight club
        </div>
        
        {/* Estado detallado de carga */}
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
          {status}
        </Text>
        
        {/* Barra de progreso mejorada */}
        <Box
          style={{
            width: '350px',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '15px',
            border: '1px solid rgba(252, 63, 49, 0.3)',
            boxShadow: '0 0 10px rgba(252, 63, 49, 0.2)'
          }}
        >
          <Box
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #fc3f31, #ff6b53, #fc3f31)',
              backgroundSize: '200% 100%',
              borderRadius: '3px',
              transition: 'width 0.5s ease-out, background 0.3s ease-in-out',
              boxShadow: '0 0 15px rgba(252, 63, 49, 0.8)',
              animation: progress > 0 ? 'shimmer 2s ease-in-out infinite' : 'none'
            }}
          />
        </Box>
        
        {/* Porcentaje con estilo mejorado */}
        <Text 
          size="lg" 
          style={{ 
            color: '#fc3f31',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '18px',
            textShadow: '0 0 10px rgba(252, 63, 49, 0.6)',
            transition: 'color 0.3s ease-in-out, text-shadow 0.3s ease-in-out'
          }}
        >
          {Math.round(progress)}%
        </Text>
      </Box>
    </>
  );
};

export default LoadingScreen; 