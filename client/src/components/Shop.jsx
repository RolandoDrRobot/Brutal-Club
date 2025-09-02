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
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "electricEntry 0.8s ease-out",
        padding: isMobile ? "40px 20px 20px 20px" : "60px 40px 40px 40px",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >


      {/* Main Content */}
      <Box style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px',
        animation: "electricFadeIn 0.7s ease-out 0.4s both"
      }}>
        
        {/* Fighter Pack Card */}
        <Box style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: '0px',
          padding: isMobile ? '30px 20px' : '40px 30px',
          textAlign: 'center',
          minWidth: isMobile ? '280px' : '350px',
          maxWidth: '400px',
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
              opacity: canAffordPack() ? 1 : 0.6,
              animation: "electricFlicker 0.6s ease-out 0.8s both"
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