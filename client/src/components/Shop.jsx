import React, { useState, useEffect } from 'react';
import { Button, Box, Text, Stack, Grid, Card, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useGameState } from '../contexts/GameState';
import { useButtonSound } from '../hooks/useButtonSound';
import mainButtonImg from '../assets/mainbutton.jpeg';
import CharacterPreview from './CharacterPreview';
import { useModelLoader } from '../hooks/useModelLoader';
import CharacterPurchaseModal from './CharacterPurchaseModal';
import CoinPurchaseModal from './CoinPurchaseModal';
import PackOpeningModal from './PackOpeningModal';

const Shop = ({ onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const { 
    coins,
    statPoints,
    addCoins,
    openPack,
    GAME_CONFIG
  } = useGameState() || {};
  
  // Modal states
  const [showCoinPurchaseModal, setShowCoinPurchaseModal] = useState(false);
  const [showPackOpeningModal, setShowPackOpeningModal] = useState(false);
  const [packContents, setPackContents] = useState([]);

  // Pack system functions
  const handleBuyPack = () => {
    if (!openPack) return;
    
    const result = openPack();
    if (result.success) {
      playButtonSound();
      setPackContents(result.contents);
      setShowPackOpeningModal(true);
    } else {
      // Handle insufficient coins
      console.log('Not enough coins for pack!');
    }
  };

  const handleBuyCoins = (amount) => {
    // In real app, this would process payment
    // For demo, just add coins directly
    addCoins(amount);
    playButtonSound();
  };

  const canAffordPack = () => {
    return coins >= (GAME_CONFIG?.PACK_CONFIG?.PACK_COST || 5);
  };

  const packCost = GAME_CONFIG?.PACK_CONFIG?.PACK_COST || 5;

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.6s ease-out",
        padding: isMobile ? "40px 20px 20px 20px" : "60px 40px 40px 40px",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header with coins, stat points and back button */}
      <Box style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: "fadeInSpray 0.7s ease-out 0.2s both",
        flexShrink: 0,
        paddingTop: "0",
        paddingBottom: "30px",
        flexWrap: 'wrap',
        gap: '10px',
        width: '100%'
      }}>
        <Box 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flex: '1 1 0%',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => {
            playButtonSound();
            onBackClick();
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.02)";
              e.target.style.opacity = "0.8";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.opacity = "1";
            }
          }}
        >
          <Text style={{
            fontSize: '30px',
            fontWeight: 700,
            color: 'rgb(255, 215, 0)',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            whiteSpace: 'nowrap'
          }}>
            🎁 Pack Store
          </Text>
          <Text style={{
            fontSize: '20px',
            fontWeight: 400,
            color: 'rgb(245, 245, 220)',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '0.5px',
            marginTop: '4px',
            lineHeight: 1.2
          }}>
            Buy packs to get fighters & stat points!
          </Text>
        </Box>
        
        {/* Currency Display */}

      </Box>

      {/* Main Content */}
      <Box style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        animation: "fadeInSpray 0.7s ease-out 0.2s both"
      }}>
        
        {/* Fighter Pack Card */}
        <Box style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          border: '4px solid #f32210',
          borderRadius: '0px',
          padding: isMobile ? '30px 20px' : '40px 30px',
          textAlign: 'center',
          minWidth: isMobile ? '280px' : '350px',
          maxWidth: '400px',
          boxShadow: `
            0 0 20px #f32210,
            0 0 40px rgba(243, 34, 16, 0.3),
            inset 0 0 20px rgba(243, 34, 16, 0.1)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Pack Icon */}
          <Text style={{
            fontSize: '80px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 0 10px #f32210)'
          }}>
            📦
          </Text>
          
          {/* Pack Title */}
          <Text style={{
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: 900,
            color: '#FFD700',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}>
            Fighter Pack
          </Text>
          
          {/* Pack Description */}
          <Text style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '0.5px',
            marginBottom: '20px',
            lineHeight: 1.4
          }}>
            Contains fighters & stat points!
          </Text>
          
          {/* Pack Probabilities */}
          <Box style={{
            marginBottom: '25px',
            textAlign: 'left'
          }}>
            <Text style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFD700',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '1px',
              marginBottom: '10px'
            }}>
              DROP RATES:
            </Text>
            <Text style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#FFD700',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '0.5px',
              lineHeight: 1.3
            }}>
              🥊 LEGENDARY FIGHTER: 10%<br/>
              ⚡ RARE STAT POINTS (8-12): 30%<br/>
              ⚡ COMMON STAT POINTS (3-5): 60%
            </Text>
          </Box>
          
          {/* Buy Pack Button */}
          <Button
            onClick={handleBuyPack}
            disabled={!canAffordPack()}
            style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: 700,
              padding: isMobile ? '15px 30px' : '18px 40px',
              width: '100%',
              backgroundColor: canAffordPack() ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
              border: `3px solid ${canAffordPack() ? '#FFD700' : '#666'}`,
              borderRadius: '0px',
              color: canAffordPack() ? '#FFD700' : '#666',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontFamily: 'Anton, sans-serif',
              cursor: canAffordPack() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity: canAffordPack() ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (!isMobile && canAffordPack()) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile && canAffordPack()) {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            🪙 BUY PACK ({packCost} COINS)
          </Button>
          
          {!canAffordPack() && (
            <Text style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#f32210',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '0.5px',
              marginTop: '10px'
            }}>
              Need {packCost - coins} more coins!
            </Text>
          )}
        </Box>

      </Box>



      {/* Modals */}
      <CoinPurchaseModal
        isVisible={showCoinPurchaseModal}
        onClose={() => setShowCoinPurchaseModal(false)}
        onPurchase={handleBuyCoins}
      />

      <PackOpeningModal
        isVisible={showPackOpeningModal}
        onClose={() => setShowPackOpeningModal(false)}
        packContents={packContents}
      />

    </Box>
  );
};

export default Shop;