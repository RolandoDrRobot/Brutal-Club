import React, { useState } from 'react';
import { Button, Box, Text, Stack, Grid, Card, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useGameState } from '../contexts/GameState';
import { useButtonSound } from '../hooks/useButtonSound';
import mainButtonImg from '../assets/mainbutton.jpeg';
import CharacterPreview from './CharacterPreview';

const Shop = ({ onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  
  // Use GameState instead of local state
  const { 
    coins, 
    purchaseCharacter, 
    getShopCharactersStatus,
    isCharacterPurchased,
    canAffordCharacter,
    clearSavedData
  } = useGameState();

  // Get characters with their current status from GameState
  const shopCharacters = getShopCharactersStatus();

  const handlePurchase = (character) => {
    if (character.price && character.canAfford && !character.isPurchased) {
      const success = purchaseCharacter(character.id);
      if (success) {
        console.log(`Successfully purchased ${character.name} for ${character.price} coins`);
      } else {
        console.log(`Failed to purchase ${character.name}`);
      }
    }
  };

  const getCharacterCardStyle = (character) => {
    if (character.isPurchased) {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '3px solid #fc3f31',
        borderRadius: '15px',
        padding: isMobile ? '15px' : '20px',
        height: '250px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        cursor: 'default',
        opacity: 1,
        transition: 'all 0.3s ease',
        boxShadow: `
          0 0 10px #fc3f31,
          0 0 20px rgba(252, 63, 49, 0.2),
          inset 0 0 10px rgba(252, 63, 49, 0.05)
        `,
        overflow: 'hidden'
      };
    }
    
    // Character is locked if price is not null and not affordable, or if it has no price and isn't purchased
    const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
    
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '3px solid #fc3f31',
      borderRadius: '15px',
      padding: isMobile ? '15px' : '20px',
      height: '250px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      cursor: isLocked ? 'not-allowed' : 'pointer',
      opacity: isLocked ? 0.6 : 1,
      transition: 'all 0.3s ease',
      boxShadow: `
        0 0 10px #fc3f31,
        0 0 20px rgba(252, 63, 49, 0.2),
        inset 0 0 10px rgba(252, 63, 49, 0.05)
      `,
      overflow: 'hidden'
    };
  };

  const getButtonStyle = (character) => {
    if (character.isPurchased) {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#FFD700',
        border: 'none',
        fontSize: isMobile ? '24px' : '28px',
        fontWeight: 700,
        padding: '0px',
        borderRadius: '8px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontFamily: 'Anton, sans-serif',
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
        cursor: 'default',
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      };
    }
    
    const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
    
    if (isLocked) {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#FFD700',
        border: 'none',
        fontSize: isMobile ? '24px' : '28px',
        fontWeight: 700,
        padding: '0px',
        borderRadius: '8px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontFamily: 'Anton, sans-serif',
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
        cursor: 'not-allowed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      };
    } else {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: '#FFD700',
        border: 'none',
        fontSize: isMobile ? '24px' : '28px',
        fontWeight: 700,
        padding: '0px',
        borderRadius: '8px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontFamily: 'Anton, sans-serif',
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
        cursor: 'pointer',
        boxShadow: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      };
    }
  };

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.6s ease-out",
        padding: isMobile ? "40px 20px 20px 20px" : "60px 40px 40px 40px",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header with title and coins */}
      <Box style={{ 
        textAlign: 'center',
        animation: "fadeInSpray 0.7s ease-out 0.2s both",
        flexShrink: 0,
        marginBottom: isMobile ? "15px" : "20px"
      }}>
        <Text className="fight-title" style={{ 
          marginBottom: '10px'
        }}>
          FIGHT CLUB
        </Text>
        <Text className="fight-subtitle">
          STORE
        </Text>
        
        {/* Coins display */}
        <Text style={{
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: 700,
          color: '#FFD700',
          fontFamily: 'Anton, sans-serif',
          letterSpacing: '1px'
        }}>
          {coins} COINS
        </Text>
      </Box>

      {/* Scrollable Character Grid Container */}
      <Box style={{ 
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: isMobile ? "5px" : "10px",
        animation: "fadeInSpray 0.7s ease-out 0.2s both",
        minHeight: 0 // Ensure flex child can shrink
      }}>
        <Grid 
          gutter={isMobile ? "md" : "lg"}
          style={{ 
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            paddingBottom: isMobile ? "20px" : "30px"
          }}
        >
          {shopCharacters.map((character, index) => (
            <Grid.Col 
              key={character.id} 
              span={6}
              style={{
                animation: `fadeInSpray 0.5s ease-out ${0.3 + index * 0.1}s both`
              }}
            >
              <Card
                style={getCharacterCardStyle(character)}
                onClick={() => {
                  const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
                  if (!isLocked && !character.isPurchased) {
                    playButtonSound();
                    handlePurchase(character);
                  }
                }}
                onMouseEnter={(e) => {
                  // No hover effects for clean appearance
                }}
                onMouseLeave={(e) => {
                  // No hover effects for clean appearance
                }}
              >
                {/* 3D Model as Background */}
                {character.model && (
                  <Box style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CharacterPreview
                      characterName={character.name}
                      style={{
                        position: 'relative',
                        left: '-13%',
                        width: '100%',
                        height: '100%',
                        transform: 'scale(1.2)',
                        margin: '0px',
                        padding: '0px',
                        border: 'none',
                        outline: 'none',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '200px',
                        minHeight: '200px'
                      }}
                    />
                  </Box>
                )}

                {/* Character Info - Above the 3D model */}
                <Stack spacing="xs" align="center" style={{ 
                  flex: 0, 
                  zIndex: 2, 
                  position: 'relative',
                  marginTop: 'auto'
                }}>
                  {/* Character name removed */}
                </Stack>

                {/* Action Button - Above the 3D model */}
                <Button
                  style={{
                    ...getButtonStyle(character),
                    zIndex: 2,
                    position: 'relative'
                  }}
                  disabled={
                    (character.price !== null && !character.canAfford && !character.isPurchased) || 
                    character.isPurchased
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
                    if (!isLocked && !character.isPurchased) {
                      playButtonSound();
                      handlePurchase(character);
                    }
                  }}
                >
                  {character.isPurchased ? (
                    <span>OWNED</span>
                  ) : (character.price !== null && !character.canAfford && !character.isPurchased) ? (
                    <span>LOCKED</span>
                  ) : character.price === null ? (
                    <span>FREE</span>
                  ) : (
                    `BUY ${character.price} COINS`
                  )}
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      {/* Back Button */}
      <Box style={{
        animation: "fadeInSpray 0.5s ease-out 0.4s both",
        flexShrink: 0,
        paddingTop: isMobile ? "15px" : "20px",
        textAlign: "center"
      }}>
        <Button
          variant="outline"
          size="xl"
          onClick={() => {
            playButtonSound();
            onBackClick();
          }}
          style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: 700,
            padding: isMobile ? "15px 40px" : "20px 60px",
            minHeight: isMobile ? "60px" : "80px",
            minWidth: isMobile ? "200px" : "250px",
            backgroundImage: `url(${mainButtonImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "transparent",
            borderColor: "#fc3f31",
            border: "4px solid #fc3f31",
            borderRadius: "15px",
            color: "#fc3f31",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontFamily: "Anton, sans-serif",
            boxShadow: `
              0 0 20px #fc3f31,
              0 0 40px rgba(252, 63, 49, 0.3),
              inset 0 0 20px rgba(252, 63, 49, 0.1)
            `,
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = `
                0 0 30px #fc3f31,
                0 0 60px rgba(252, 63, 49, 0.5),
                inset 0 0 30px rgba(252, 63, 49, 0.2)
              `;
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = `
                0 0 20px #fc3f31,
                0 0 40px rgba(252, 63, 49, 0.3),
                inset 0 0 20px rgba(252, 63, 49, 0.1)
              `;
            }
          }}
        >
          BACK
        </Button>
      </Box>
    </Box>
  );
};

export default Shop;