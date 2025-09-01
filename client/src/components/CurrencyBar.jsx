import React from 'react';
import { Box } from '@mantine/core';
import { useGameState } from '../contexts/GameState';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useMediaQuery } from '@mantine/hooks';
import { useButtonSound } from '../hooks/useButtonSound';
import coinImg from '../assets/coin.png';
import statCoinImg from '../assets/statCoin.png';
import homeImg from '../assets/home.png';

const CurrencyBar = () => {
  const { coins, statPoints } = useGameState() || {};
  const { navigateToMenu } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
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
            fontSize: isMobile ? '18px' : '22px',
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

        {/* Center - Home icon */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            padding: '4px',
            borderRadius: '50%'
          }}
          onClick={() => {
            playButtonSound();
            navigateToMenu();
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.opacity = "1";
          }}
        >
          <img 
            src={homeImg}
            alt="Home"
            style={{
              width: isMobile ? '32px' : '40px',
              height: isMobile ? '32px' : '40px',
              filter: 'none',
              pointerEvents: 'none'
            }}
          />
        </Box>

        {/* Right side - Currency elements */}
        <Box
          style={{
            display: 'flex',
            gap: isMobile ? '10px' : '15px',
            alignItems: 'center'
          }}
        >
          {/* Skill Points */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '6px' : '8px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 700,
              backgroundColor: 'transparent',
              color: '#f32210',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'Anton, sans-serif',
              minWidth: isMobile ? '70px' : '80px',
              justifyContent: 'center'
            }}
          >
            <img 
              src={statCoinImg}
              alt="Stat Points"
              style={{
                width: isMobile ? '24px' : '28px',
                height: isMobile ? '24px' : '28px',
                filter: 'none'
              }}
            />
            <span style={{
              fontWeight: 900,
              color: '#F5F5DC'
            }}>
              {statPoints || 0}
            </span>
          </Box>

          {/* Gold Coins */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '6px' : '8px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 700,
              backgroundColor: 'transparent',
              color: '#FFD700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontFamily: 'Anton, sans-serif',
              minWidth: isMobile ? '70px' : '80px',
              justifyContent: 'center'
            }}
          >
            <img 
              src={coinImg}
              alt="Coin"
              style={{
                width: isMobile ? '24px' : '28px',
                height: isMobile ? '24px' : '28px',
                filter: 'none'
              }}
            />
            <span style={{
              fontWeight: 900
            }}>
              {coins || 0}
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
            filter: 
              drop-shadow(0 0 3px rgba(255, 215, 0, 0.8))
              drop-shadow(0 0 6px rgba(255, 215, 0, 0.6));
          }
          50% {
            text-shadow: 
              0 0 5px #FFD700,
              0 0 10px #FFD700,
              0 0 15px rgba(255, 215, 0, 0.6),
              0 0 20px rgba(255, 215, 0, 0.3),
              1px 1px 2px rgba(0,0,0,0.8);
            filter: 
              drop-shadow(0 0 5px rgba(255, 215, 0, 1))
              drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))
              drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
          }
          100% {
            text-shadow: 
              0 0 3px #FFD700,
              0 0 6px #FFD700,
              0 0 9px rgba(255, 215, 0, 0.4),
              1px 1px 2px rgba(0,0,0,0.8);
            filter: 
              drop-shadow(0 0 3px rgba(255, 215, 0, 0.8))
              drop-shadow(0 0 6px rgba(255, 215, 0, 0.6));
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
