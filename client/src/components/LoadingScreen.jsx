import React from 'react';
import { Box, Text } from '@mantine/core';

const LoadingScreen = ({ progress = 0, status = 'Starting...', isPlayable = false, onSkipToPlay }) => {
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
        box-shadow: 0 0 15px rgba(252, 63, 49, 0.6);
      }
      50% { 
        transform: scale(1.02);
        box-shadow: 0 0 25px rgba(252, 63, 49, 0.8);
      }
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
        <Box
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          <div className="fight-title">
            FIGHT CLUB
          </div>
          <div className="fight-subtitle">
            You do not talk about fight club
          </div>
        </Box>
        
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
            transition: 'color 0.3s ease-in-out, text-shadow 0.3s ease-in-out',
            marginBottom: isPlayable ? '20px' : '0'
          }}
        >
          {Math.round(progress)}%
        </Text>
        
        {/* Botón Skip to Play - aparece cuando el juego es playable */}
        {isPlayable && (
          <Box
            style={{
              animation: 'slideUp 0.5s ease-out'
            }}
          >
            <button
              onClick={onSkipToPlay}
              style={{
                background: 'linear-gradient(135deg, #fc3f31, #ff6b53)',
                border: '2px solid rgba(252, 63, 49, 0.8)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                padding: '12px 24px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                animation: 'buttonPulse 2s ease-in-out infinite',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ff6b53, #fc3f31)';
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 0 30px rgba(252, 63, 49, 1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #fc3f31, #ff6b53)';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 0 15px rgba(252, 63, 49, 0.6)';
              }}
            >
              🎮 SKIP TO PLAY
            </button>
            
            <Text 
              size="sm" 
              style={{ 
                color: 'rgba(245, 245, 220, 0.8)',
                textAlign: 'center',
                fontSize: '12px',
                marginTop: '8px',
                textShadow: '0 0 5px rgba(245, 245, 220, 0.3)'
              }}
            >
              Game is ready! Other assets will load in background
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};

export default LoadingScreen; 