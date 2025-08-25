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

const Shop = ({ onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const { 
    gameState = {}, 
    purchaseCharacter = () => {}, 
    getShopCharactersStatus = () => [], 
    isCharacterPurchased = () => false, 
    canAffordCharacter = () => false, 
    clearSavedData = () => {} 
  } = useGameState() || {};
  const { setSelectedPlayer1Character } = useCharacterAnimations();
  const { lazyLoadModel } = useModelLoader();
  const [loadingModels, setLoadingModels] = useState(new Set());
  const [loadedModels, setLoadedModels] = useState(new Set());

  // Lazy load shop models when component mounts
  useEffect(() => {
    const loadShopModels = async () => {
      setLoadingModels(new Set(['Vince', 'Bob']));
      
      const promises = [
        lazyLoadModel('Vince'),
        lazyLoadModel('Bob')
      ];
      
      const results = await Promise.allSettled(promises);
      const successful = new Set();
      
      results.forEach((result, index) => {
        const modelName = ['Vince', 'Bob'][index];
        if (result.status === 'fulfilled' && result.value) {
          successful.add(modelName);
        } else {
          console.warn(`⚠️ Shop model failed: ${modelName}`);
        }
      });
      
      setLoadedModels(successful);
      setLoadingModels(new Set());
    };

    loadShopModels();
  }, [lazyLoadModel]);

  // Get characters with their current status from GameState
  const shopCharacters = getShopCharactersStatus();

  const handlePurchase = (character) => {
    if (character.price && character.canAfford && !character.isPurchased) {
      const success = purchaseCharacter(character.id);
      if (success) {
        // Purchase successful
      } else {
        // Purchase failed
      }
    }
  };

  const getCharacterCardStyle = (character) => {
    if (character.isPurchased) {
      return {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '3px solid #f32210',
        borderRadius: '15px',
        padding: isMobile ? '15px' : '20px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        cursor: 'default',
        opacity: 1,
        transition: 'all 0.3s ease',
        boxShadow: `
          0 0 10px #f32210,
          0 0 20px rgba(243, 34, 16, 0.2),
          inset 0 0 10px rgba(243, 34, 16, 0.05)
        `,
        overflow: 'hidden'
      };
    }
    
    // Character is locked if price is not null and not affordable, or if it has no price and isn't purchased
    const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
    
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '3px solid #f32210',
      borderRadius: '15px',
      padding: isMobile ? '15px' : '20px',
      height: '200px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      cursor: isLocked ? 'not-allowed' : 'pointer',
      opacity: isLocked ? 0.6 : 1,
      transition: 'all 0.3s ease',
      boxShadow: `
        0 0 10px #f32210,
        0 0 20px rgba(243, 34, 16, 0.2),
        inset 0 0 10px rgba(243, 34, 16, 0.05)
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
        fontSize: isMobile ? '30px' : '35px',
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
        fontSize: isMobile ? '30px' : '35px',
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
        fontSize: isMobile ? '30px' : '35px',
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

  const isModelLoading = (characterName) => {
    return loadingModels.has(characterName);
  };

  const isModelLoaded = (characterName) => {
    return loadedModels.has(characterName);
  };

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
      {/* Header with coins, description and back button */}
      <Box style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: "fadeInSpray 0.7s ease-out 0.2s both",
        flexShrink: 0,
        paddingTop: "33px",
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
            Recruite Fighters
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
            Unlock fighters to recruit once you defeat them
          </Text>
        </Box>
        <Box style={{
          flexShrink: 0
        }}>
          <Button
            variant="outline"
            onClick={() => {
              playButtonSound();
              onBackClick();
            }}
            style={{
              fontSize: '20px',
              fontWeight: 700,
              padding: '12px 20px',
              backgroundColor: 'transparent',
              border: '3px solid #f32210',
              borderRadius: '10px',
              color: '#f32210',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontFamily: 'Anton, sans-serif',
              height: '55px'
            }}
          >
            <span className="fight-button-text">X</span>
          </Button>
        </Box>
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
            paddingBottom: isMobile ? "20px" : "30px",
            display: 'flex',
            alignItems: 'center',
            height: '100%'
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

      {/* Buy Coins Button */}
      <Box style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '20px',
        paddingBottom: isMobile ? '20px' : '30px'
      }}>
        <Button
          variant="outline"
          size="xl"
          onClick={() => {
            playButtonSound();
            // TODO: Implement buy coins functionality
            console.log('Buy Coins clicked');
          }}
          style={{
            fontSize: isMobile ? "45px" : "60px",
            fontWeight: 700,
            padding: isMobile ? "20px 50px" : "25px 70px",
            minHeight: isMobile ? "100px" : "120px",
            minWidth: isMobile ? "280px" : "350px",
            maxWidth: isMobile ? "calc(100vw - 40px)" : "350px",
            margin: "0",
            width: "100%",
            backgroundColor: "transparent",
            backgroundImage: `url(${mainButtonImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderColor: "#f32210",
            border: "4px solid #f32210",
            borderRadius: "15px",
            color: "#f32210",
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontFamily: "Anton, sans-serif",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textShadow: `
              0 0 10px #000000,
              0 0 20px #000000,
              2px 2px 4px #000000
            `,
            boxShadow: `
              0 0 20px #f32210,
              0 0 40px rgba(243, 34, 16, 0.3),
              inset 0 0 20px rgba(243, 34, 16, 0.1)
            `,
            transition: "all 0.3s ease",
            cursor: "pointer",
            animation: "fadeInSpray 0.5s ease-out 0.6s both"
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.05)";
              e.target.style.backgroundColor = "rgba(243, 34, 16, 0.1)";
              e.target.style.animation = "impactShake 0.3s ease-out";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.backgroundColor = "transparent";
              e.target.style.animation = "none";
            }
          }}
        >
          <span className="fight-button-text">
            BUY COINS
          </span>
        </Button>
      </Box>

      {/* Back Button - Hidden since it's now in header */}
      <Box style={{
        display: 'none'
      }}>
        <Button
          variant="outline"
          size="xl"
          onClick={() => {
            playButtonSound();
            onBackClick();
          }}
          style={{
            fontSize: isMobile ? "25px" : "30px",
            fontWeight: 700,
            padding: isMobile ? "15px 40px" : "20px 60px",
            minHeight: isMobile ? "60px" : "80px",
            minWidth: isMobile ? "200px" : "250px",
            backgroundImage: `url(${mainButtonImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "transparent",
            borderColor: "#f32210",
            border: "4px solid #f32210",
            borderRadius: "15px",
            color: "#f32210",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontFamily: "Anton, sans-serif",
            boxShadow: `
              0 0 20px #f32210,
              0 0 40px rgba(243, 34, 16, 0.3),
              inset 0 0 20px rgba(243, 34, 16, 0.1)
            `,
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = `
                0 0 30px #f32210,
                0 0 60px rgba(243, 34, 16, 0.5),
                inset 0 0 30px rgba(243, 34, 16, 0.2)
              `;
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = `
                0 0 20px #f32210,
                0 0 40px rgba(243, 34, 16, 0.3),
                inset 0 0 20px rgba(243, 34, 16, 0.1)
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