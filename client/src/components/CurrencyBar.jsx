import React from 'react';
import { Box } from '@mantine/core';
import { useGameState } from '../contexts/GameState';
import { useMediaQuery } from '@mantine/hooks';
import mainButtonImg from '../assets/mainbutton.jpeg';

const CurrencyBar = () => {
  const { coins, statPoints } = useGameState() || {};
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backgroundImage: `url(${mainButtonImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderTop: '2px solid #f32210',
        padding: isMobile ? '8px 15px' : '10px 20px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(243, 34, 16, 0.3)',
        borderRadius: '0px'
      }}
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* Left side - ROLOXWORLD */}
        <Box
          style={{
            fontSize: isMobile ? '16px' : '20px',
            fontWeight: 700,
            color: '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textShadow: '0 0 5px rgba(245, 245, 220, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}
        >
          ROLOXWORLD
        </Box>

        {/* Right side - Currency elements */}
        <Box
          style={{
            display: 'flex',
            gap: isMobile ? '10px' : '15px',
            alignItems: 'center'
          }}
        >
          {/* Gold Coins */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '6px' : '8px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: 700,
              padding: isMobile ? '6px 12px' : '8px 16px',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              border: '2px solid #FFD700',
              borderRadius: '12px',
              color: '#FFD700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'Anton, sans-serif',
              minWidth: isMobile ? '70px' : '80px',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.8)'
            }}
          >
            <span style={{
              fontSize: isMobile ? '16px' : '18px',
              animation: 'goldNeonText 2s ease-in-out infinite'
            }}>
              🪙
            </span>
            <span style={{
              fontWeight: 900,
              animation: 'goldNeonText 2s ease-in-out infinite'
            }}>
              {coins || 0}
            </span>
          </Box>

          {/* Skill Points */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '6px' : '8px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: 700,
              padding: isMobile ? '6px 12px' : '8px 16px',
              backgroundColor: 'rgba(243, 34, 16, 0.1)',
              border: '2px solid #f32210',
              borderRadius: '12px',
              color: '#f32210',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'Anton, sans-serif',
              minWidth: isMobile ? '70px' : '80px',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(243, 34, 16, 0.4)',
              textShadow: '0 0 5px rgba(243, 34, 16, 0.8)'
            }}
          >
            <span style={{
              fontSize: isMobile ? '16px' : '18px',
              animation: 'redNeonText 2s ease-in-out infinite'
            }}>
              ⚡
            </span>
            <span style={{
              fontWeight: 900,
              animation: 'redNeonText 2s ease-in-out infinite'
            }}>
              {statPoints || 0}
            </span>
          </Box>
        </Box>
      </Box>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes goldNeonText {
          0% {
            text-shadow: 
              0 0 3px #FFD700,
              0 0 6px #FFD700,
              0 0 9px rgba(255, 215, 0, 0.4),
              1px 1px 2px rgba(0,0,0,0.8);
          }
          50% {
            text-shadow: 
              0 0 5px #FFD700,
              0 0 10px #FFD700,
              0 0 15px rgba(255, 215, 0, 0.6),
              0 0 20px rgba(255, 215, 0, 0.3),
              1px 1px 2px rgba(0,0,0,0.8);
          }
          100% {
            text-shadow: 
              0 0 3px #FFD700,
              0 0 6px #FFD700,
              0 0 9px rgba(255, 215, 0, 0.4),
              1px 1px 2px rgba(0,0,0,0.8);
          }
        }

        @keyframes redNeonText {
          0% {
            text-shadow: 
              0 0 3px #f32210,
              0 0 6px #f32210,
              0 0 9px rgba(243, 34, 16, 0.4),
              2px 2px 4px rgba(0,0,0,0.8);
          }
          50% {
            text-shadow: 
              0 0 5px #f32210,
              0 0 10px #f32210,
              0 0 15px rgba(243, 34, 16, 0.6),
              0 0 20px rgba(243, 34, 16, 0.3),
              2px 2px 4px rgba(0,0,0,0.8);
          }
          100% {
            text-shadow: 
              0 0 3px #f32210,
              0 0 6px #f32210,
              0 0 9px rgba(243, 34, 16, 0.4),
              2px 2px 4px rgba(0,0,0,0.8);
          }
        }
      `}</style>
    </Box>
  );
};

export default CurrencyBar;
