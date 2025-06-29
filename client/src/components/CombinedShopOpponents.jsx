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

const CombinedShopOpponents = ({ onChallengeClick, onBackClick }) => {
  console.log('🏪 CombinedShopOpponents rendering...');
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const { 
    coins,
    purchaseCharacter, 
    getShopCharactersStatus, 
    getOpponentsStatus,
    isCharacterPurchased, 
    canAffordCharacter 
  } = useGameState();
  console.log('🏪 CombinedShopOpponents - coins:', coins);
  const { lazyLoadModel } = useModelLoader();
  const [loadingModels, setLoadingModels] = useState(new Set());
  const [loadedModels, setLoadedModels] = useState(new Set());

  // Safety check - if coins is undefined, context is not ready yet
  if (coins === undefined) {
    console.log('🏪 CombinedShopOpponents - coins undefined, showing loading...');
    return (
      <Box
        className="fight-screen-container fight-screen-background"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh"
        }}
      >
        <Text style={{
          fontSize: "24px",
          color: "#fc3f31",
          fontFamily: "Anton, sans-serif"
        }}>
          Loading...
        </Text>
      </Box>
    );
  }

  console.log('🏪 CombinedShopOpponents - rendering main content');

  // Lazy load shop models when component mounts
  useEffect(() => {
    const loadShopModels = async () => {
      console.log('🏪 Loading shop character models...');
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
          console.log(`✅ Shop model loaded: ${modelName}`);
        } else {
          console.warn(`⚠️ Shop model failed: ${modelName}`);
        }
      });
      
      setLoadedModels(successful);
      setLoadingModels(new Set());
    };

    loadShopModels();
  }, [lazyLoadModel]);

  // Get opponents with their current unlock status
  const opponents = getOpponentsStatus().map((opponent, index) => ({
    ...opponent,
    number: `${index + 1}.`,
    isLocked: !opponent.isUnlocked,
    price: opponent.coinReward // Show coin reward for defeating
  }));

  // Get characters with their current status from GameState
  const shopCharacters = getShopCharactersStatus();

  const handlePurchase = (character) => {
    if (character.price && character.canAfford && !character.isPurchased) {
      const success = purchaseCharacter(character.id);
      if (success) {
        console.log(`Successfully purchased ${character.name} for ${character.price} coins`);
        playButtonSound();
      } else {
        console.log(`Failed to purchase ${character.name}`);
      }
    }
  };

  const handleOpponentSelect = (opponent) => {
    if (!opponent.isLocked) {
      console.log(`Selected opponent: ${opponent.name}`);
      playButtonSound();
      onChallengeClick(opponent);
    }
  };

  const getCharacterCardStyle = (character, isOpponent = false) => {
    const baseStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '3px solid #fc3f31',
      borderRadius: '15px',
      padding: isMobile ? '10px' : '15px',
      height: isMobile ? '200px' : '250px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      transition: 'all 0.3s ease',
      boxShadow: `
        0 0 10px #fc3f31,
        0 0 20px rgba(252, 63, 49, 0.2),
        inset 0 0 10px rgba(252, 63, 49, 0.05)
      `,
      overflow: 'hidden'
    };

    if (isOpponent) {
      // Opponent styling
      const isLocked = character.isLocked;
      return {
        ...baseStyle,
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.6 : 1,
        border: isLocked ? '3px solid #666' : '3px solid #fc3f31'
      };
    } else {
      // Shop character styling
      if (character.isPurchased) {
        return {
          ...baseStyle,
          cursor: 'default',
          opacity: 1,
          border: '3px solid #FFD700'
        };
      }
      
      const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
      return {
        ...baseStyle,
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.6 : 1,
        border: isLocked ? '3px solid #666' : '3px solid #fc3f31'
      };
    }
  };

  const getButtonStyle = (character, isOpponent = false) => {
    const baseStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: 'none',
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: 700,
      padding: '8px 12px',
      borderRadius: '8px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontFamily: 'Anton, sans-serif',
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      minHeight: '36px'
    };

    if (isOpponent) {
      // Opponent button styling
      const isLocked = character.isLocked;
      return {
        ...baseStyle,
        color: isLocked ? '#666' : '#fc3f31',
        cursor: isLocked ? 'not-allowed' : 'pointer'
      };
    } else {
      // Shop button styling
      if (character.isPurchased) {
        return {
          ...baseStyle,
          color: '#FFD700',
          cursor: 'default'
        };
      }
      
      const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
      return {
        ...baseStyle,
        color: isLocked ? '#666' : '#FFD700',
        cursor: isLocked ? 'not-allowed' : 'pointer'
      };
    }
  };

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.6s ease-out",
        padding: isMobile ? "30px 15px 25px" : "50px 30px 40px",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header with coins and back button */}
      <Box style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: "fadeInSpray 0.7s ease-out 0.2s both",
        flexShrink: 0,
        marginBottom: isMobile ? "20px" : "25px",
        paddingTop: isMobile ? "10px" : "15px",
        flexWrap: 'wrap',
        gap: isMobile ? '10px' : '15px',
        width: '100%'
      }}>
        {/* Left side: Coins and description text */}
        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          flex: 1
        }}>
          <Text style={{
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: 700,
            color: '#FFD700',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            whiteSpace: 'nowrap'
          }}>
            {coins} COINS
          </Text>
          
          <Text style={{
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 400,
            color: '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '0.5px',
            marginTop: '4px',
            lineHeight: 1.2
          }}>
            Defeat opponents to earn coins, then unlock new fighters in the store
          </Text>
        </Box>

        {/* Right side: Back Button */}
        <Box style={{
          flexShrink: 0
        }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              playButtonSound();
              onBackClick();
            }}
            style={{
              fontSize: "16px",
              fontWeight: 700,
              padding: "12px 20px",
              backgroundColor: "transparent",
              borderColor: "#fc3f31",
              border: "3px solid #fc3f31",
              borderRadius: "10px",
              color: "#fc3f31",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontFamily: "Anton, sans-serif",
              height: "55px"
            }}
          >
            <span className="fight-button-text">BACK</span>
          </Button>
        </Box>
      </Box>

      {/* Scrollable Content Container */}
      <Box style={{ 
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: isMobile ? "5px" : "10px",
        paddingTop: isMobile ? "15px" : "20px",
        animation: "fadeInSpray 0.7s ease-out 0.2s both",
        minHeight: 0,
        maxWidth: "400px",
        width: "100%",
        margin: "0 auto",
        marginBottom: isMobile ? "10px" : "15px"
      }}>
        {/* OPPONENTS Section */}
        <Box style={{ marginBottom: isMobile ? "30px" : "40px" }}>
          <Text style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 700,
            color: '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '2px',
            textAlign: 'center',
            marginBottom: isMobile ? '15px' : '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            OPPONENTS
          </Text>
          
          <Grid 
            gutter={isMobile ? "sm" : "md"}
            style={{ 
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            {opponents.map((opponent, index) => (
              <Grid.Col 
                key={opponent.id} 
                span={6}
                style={{
                  animation: `fadeInSpray 0.5s ease-out ${0.3 + index * 0.1}s both`
                }}
              >
                <Box style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Card
                    style={getCharacterCardStyle(opponent, true)}
                    onClick={() => handleOpponentSelect(opponent)}
                  >
                    {/* 3D Model */}
                    {opponent.model && (
                      <Box style={{
                        position: 'absolute',
                        top: '55%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        height: '55%',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CharacterPreview
                          characterName={opponent.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            transform: 'scale(1.4)',
                            filter: opponent.isLocked ? 'grayscale(100%)' : 'none'
                          }}
                        />
                      </Box>
                    )}

                    {/* Action Button - Moved to bottom */}
                    <Box style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      right: '8px',
                      zIndex: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <Button
                        style={{
                          ...getButtonStyle(opponent, true),
                          width: '100%'
                        }}
                        disabled={opponent.isLocked}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpponentSelect(opponent);
                        }}
                      >
                        {opponent.isLocked ? (
                          <span>{opponent.price}</span>
                        ) : opponent.isDefeated ? (
                          <span>DEFEATED</span>
                        ) : (
                          <span>{opponent.price}</span>
                        )}
                      </Button>
                    </Box>
                  </Card>
                  
                  {/* Fighter Name */}
                  <Text style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 700,
                    color: opponent.isLocked ? '#666' : '#F5F5DC',
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}>
                    {opponent.name}
                  </Text>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        </Box>

        {/* STORE Section */}
        <Box style={{ marginBottom: isMobile ? "20px" : "30px" }}>
          <Text style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 700,
            color: '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '2px',
            textAlign: 'center',
            marginBottom: isMobile ? '15px' : '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}>
            STORE
          </Text>
          
          <Grid 
            gutter={isMobile ? "sm" : "md"}
            style={{ 
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            {shopCharacters.map((character, index) => (
              <Grid.Col 
                key={character.id} 
                span={6}
                style={{
                  animation: `fadeInSpray 0.5s ease-out ${0.5 + index * 0.1}s both`
                }}
              >
                <Box style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Card
                    style={getCharacterCardStyle(character, false)}
                    onClick={() => {
                      const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
                      if (!isLocked && !character.isPurchased) {
                        handlePurchase(character);
                      }
                    }}
                  >
                    {/* 3D Model as Background */}
                    {character.model && (
                      <Box style={{
                        position: 'absolute',
                        top: '55%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        height: '55%',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CharacterPreview
                          characterName={character.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            transform: 'scale(1.4)'
                          }}
                        />
                      </Box>
                    )}

                    {/* Action Button - Moved to bottom */}
                    <Box style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      right: '8px',
                      zIndex: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <Button
                        style={{
                          ...getButtonStyle(character, false),
                          width: '100%'
                        }}
                        disabled={
                          (character.price !== null && !character.canAfford && !character.isPurchased) || 
                          character.isPurchased
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
                          if (!isLocked && !character.isPurchased) {
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
                          <span>{character.price}</span>
                        )}
                      </Button>
                    </Box>
                  </Card>
                  
                  {/* Fighter Name */}
                  <Text style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 700,
                    color: (character.price !== null && !character.canAfford && !character.isPurchased) ? '#666' : '#F5F5DC',
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}>
                    {character.name}
                  </Text>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CombinedShopOpponents; 