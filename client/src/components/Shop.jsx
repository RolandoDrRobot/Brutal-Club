import React, { useState, useEffect } from 'react';
import { Button, Box, Text, Stack, Grid, Card, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useGameState } from '../contexts/GameState';
import { useButtonSound } from '../hooks/useButtonSound';
import { useCurrency, usePackSystem } from '../hooks/useEconomy';
import mainButtonImg from '../assets/mainbutton.jpeg';
import packImg from '../assets/optimized/pack.webp';
import coverbgImg from '../assets/optimized/coverbg.webp';
import CharacterPreview from './CharacterPreview';
import CoinPurchaseModal from './CoinPurchaseModal';
import PackOpeningModal from './PackOpeningModal';

const Shop = ({ onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const { coins, GAME_CONFIG } = useGameState() || {};
  const { addCoins } = useCurrency();
  const { openPack } = usePackSystem();

  const [showCoinPurchaseModal, setShowCoinPurchaseModal] = useState(false);
  const [showPackOpeningModal, setShowPackOpeningModal] = useState(false);
  const [showInsufficientCoinsModal, setShowInsufficientCoinsModal] = useState(false);
  const [packContents, setPackContents] = useState([]);

  useEffect(() => {
    if (showInsufficientCoinsModal) {
      const timer = setTimeout(() => {
        setShowInsufficientCoinsModal(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showInsufficientCoinsModal]);

  const handleBuyPack = () => {
    if (!openPack) return;
    
    const result = openPack();
    if (result.success) {
      playButtonSound();
      setPackContents(result.contents);
      setShowPackOpeningModal(true);
    } else {
      setShowInsufficientCoinsModal(true);
    }
  };

  const handleBuyCoins = (packageData) => {
    addCoins(packageData.coins);
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
        backgroundImage: `url(${coverbgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "electricEntry 0.8s ease-out",
        padding: isMobile ? "40px 20px 20px 20px" : "60px 40px 40px 40px",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >



      <Box style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '40px'
      }}>
        

        <Box style={{
          borderRadius: '0px',
          padding: isMobile ? '30px 20px' : '40px 30px',
          textAlign: 'center',
          minWidth: isMobile ? '280px' : '350px',
          maxWidth: '400px',
          position: 'relative',
          overflow: 'hidden'
        }}>

          <Box style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img 
              src={packImg}
              alt="Fighter Pack"
              style={{
                height: '45dvh',
                animation: 'packFloat 3s ease-in-out infinite, packGlow 2s ease-in-out infinite',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.animation = 'packHover 0.3s ease-out forwards';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.animation = 'packFloat 3s ease-in-out infinite, packGlow 2s ease-in-out infinite';
                }
              }}
              onClick={() => {
                if (canAffordPack()) {
                  handleBuyPack();
                }
              }}
            />
          </Box>
          

          <Text style={{
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: 900,
            color: '#bbb092',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}>
            Fighter Pack
          </Text>
          

          <Text style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#bbb092',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '0.5px',
            marginBottom: !canAffordPack() ? '10px' : '20px',
            lineHeight: 1.4
          }}>
            Contains fighters & stat points!
          </Text>
          

          {!canAffordPack() && (
            <Text style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#A00000',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '0.5px',
              marginBottom: '20px',
              textAlign: 'center',
              animation: "electricFlicker 0.6s ease-out 0.8s both"
            }}>
              Need {packCost - coins} more coins to open!
            </Text>
          )}
          


        </Box>

      </Box>




      {/* Insufficient Coins Modal */}
      {showInsufficientCoinsModal && (
        <Box style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Box style={{
            backgroundColor: '#000000',
            border: '3px solid #A00000',
            borderRadius: '12px',
            padding: isMobile ? '30px' : '40px',
            maxWidth: isMobile ? '90%' : '500px',
            textAlign: 'center',
            animation: 'electricEntry 0.8s ease-out'
          }}>
            <Text style={{
              fontSize: isMobile ? '24px' : '28px',
              fontWeight: 700,
              color: '#A00000',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '2px',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              INSUFFICIENT COINS
            </Text>
            
            <Text style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#bbb092',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '1px',
              lineHeight: 1.4
            }}>
              You need {packCost} coins to open a Fighter Pack. You currently have {coins} coins.
            </Text>
          </Box>
        </Box>
      )}

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