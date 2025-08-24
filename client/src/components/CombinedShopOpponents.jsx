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
import punchImg from "../assets/punch.png";
import comboImg from "../assets/combo.png";

const CombinedShopOpponents = ({ onChallengeClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const { isExiting, selectedPlayer1Character, setSelectedPlayer1Character } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const [selectedCharacter, setSelectedCharacter] = useState(0);

    const {
    coins,
    purchaseCharacter, 
    getShopCharactersStatus, 
    getOpponentsStatus,
    isCharacterPurchased, 
    canAffordCharacter,
    startArcadeMode
  } = useGameState();
  const { lazyLoadModel } = useModelLoader();
  const [loadingModels, setLoadingModels] = useState(new Set());
  const [loadedModels, setLoadedModels] = useState(new Set());

  // Safety check - if coins is undefined, context is not ready yet
  if (coins === undefined) {
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
          color: "#f32210",
          fontFamily: "Anton, sans-serif"
        }}>
          Loading...
        </Text>
      </Box>
    );
  }

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

  // Get opponents with their current unlock status
  const opponents = getOpponentsStatus().map((opponent, index) => ({
    ...opponent,
    number: `${index + 1}.`,
    isLocked: !opponent.isUnlocked,
    price: opponent.coinReward // Show coin reward for defeating
  }));

  // Get characters with their current status from GameState
  const shopCharacters = getShopCharactersStatus();

  // Get purchased characters for selection
  const allCharacters = getShopCharactersStatus();
  const ownedCharacters = allCharacters.filter(char => char.isPurchased).map(char => ({
    id: char.id,
    name: char.name.toUpperCase(),
    model: char.model
  }));



  const handlePurchase = (character) => {
    if (character.price && character.canAfford && !character.isPurchased) {
      const success = purchaseCharacter(character.id);
      if (success) {
        playButtonSound();
      } else {
        // Purchase failed
      }
    }
  };

  const handleOpponentSelect = (opponent) => {
    // Check if opponent is available to fight
    const isLocked = opponent.isLocked;
    const isFirstOpponent = opponent.id === 'tyler_1';
    const hasNoCoins = coins === 0;
    
    if (!isLocked && !(isFirstOpponent && hasNoCoins)) {
      playButtonSound();
      
      // If fighting the first opponent, pay the arcade entry fee
      if (isFirstOpponent) {
        startArcadeMode(); // Deduct 1 coin
      }
      
      onChallengeClick(opponent);
    } else if (isFirstOpponent && hasNoCoins) {
      // Could add a sound effect or visual feedback for "no coins"
      console.log("Need at least 1 coin to start arcade mode!");
    }
  };

  // Character navigation functions
  const handlePreviousCharacter = () => {
    playButtonSound();
    const newIndex = selectedCharacter > 0 ? selectedCharacter - 1 : ownedCharacters.length - 1;
    setSelectedCharacter(newIndex);
    // Cambiar directamente el personaje activo
    if (ownedCharacters[newIndex]) {
      setSelectedPlayer1Character(ownedCharacters[newIndex].model);
    }
  };

  const handleNextCharacter = () => {
    playButtonSound();
    const newIndex = selectedCharacter < ownedCharacters.length - 1 ? selectedCharacter + 1 : 0;
    setSelectedCharacter(newIndex);
    // Cambiar directamente el personaje activo
    if (ownedCharacters[newIndex]) {
      setSelectedPlayer1Character(ownedCharacters[newIndex].model);
    }
  };

  const getCharacterCardStyle = (character, isOpponent = false) => {
    const baseStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '3px solid #f32210',
      borderRadius: '12px',
      padding: isMobile ? '8px' : '12px',
      aspectRatio: '1',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      transition: 'all 0.3s ease',
      boxShadow: `
        0 0 10px #f32210,
        0 0 20px rgba(243, 34, 16, 0.2),
        inset 0 0 10px rgba(243, 34, 16, 0.05)
      `,
      overflow: 'hidden'
    };

    if (isOpponent) {
      // Opponent styling with 4 states
      const isLocked = character.isLocked;
      const isDefeated = character.isDefeated;
      const isFirstOpponent = character.id === 'tyler_1';
      const hasNoCoins = coins === 0;
      const isActive = !isLocked && !isDefeated && !(isFirstOpponent && hasNoCoins);
      
      let borderColor = '#666'; // Default: locked (gray)
      let opacity = 0.6;
      let cursor = 'not-allowed';
      
      if (isDefeated) {
        borderColor = '#f32210'; // Defeated: red
        opacity = 0.8;
        cursor = 'not-allowed';
      } else if (isFirstOpponent && hasNoCoins) {
        borderColor = '#666'; // No coins: gray (same as locked)
        opacity = 0.4;
        cursor = 'not-allowed';
      } else if (isActive) {
        borderColor = '#FFD700'; // Active/Available: yellow
        opacity = 1;
        cursor = 'pointer';
      }
      
      return {
        ...baseStyle,
        cursor: cursor,
        opacity: opacity,
        border: `3px solid ${borderColor}`,
        boxShadow: isActive ? `
          0 0 10px ${borderColor},
          0 0 20px rgba(255, 215, 0, 0.3),
          inset 0 0 10px rgba(255, 215, 0, 0.1)
        ` : isDefeated ? `
          0 0 10px ${borderColor},
          0 0 20px rgba(243, 34, 16, 0.2),
          inset 0 0 10px rgba(243, 34, 16, 0.05)
        ` : baseStyle.boxShadow
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
        border: isLocked ? '3px solid #666' : '3px solid #f32210'
      };
    }
  };

  const getButtonStyle = (character, isOpponent = false) => {
    const baseStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: 'none',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: 700,
      padding: '6px 8px',
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
        color: isLocked ? '#666' : '#f32210',
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
        paddingTop: "20px",
        flexWrap: 'wrap',
        gap: isMobile ? '10px' : '15px',
        width: '100%'
      }}>
        {/* Left side: Coins and description text */}
        <Box 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flex: 1,
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
            fontSize: isMobile ? '24px' : '28px',
            fontWeight: 700,
            color: '#FFD700',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            whiteSpace: 'nowrap'
          }}>
            Arcade Mode
          </Text>
          
          <Text style={{
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 400,
            color: coins === 0 ? '#f32210' : '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '0.5px',
            marginTop: '4px',
            lineHeight: 1.2
          }}>
            Beat opponents to win 1 coin
          </Text>

          <Text style={{
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 400,
            color: coins === 0 ? '#f32210' : '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '0.5px',
            marginTop: '4px',
            lineHeight: 1.2
          }}>
            Arcade costs 1 coin
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
              borderColor: "#f32210",
              border: "3px solid #f32210",
              borderRadius: "10px",
              color: "#f32210",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontFamily: "Anton, sans-serif",
              height: "55px"
            }}
          >
            <span className="fight-button-text">X</span>
          </Button>
        </Box>
      </Box>

      {/* Scrollable Content Container - Vertically Centered */}
      <Box style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: isMobile ? "5px" : "10px",
        paddingTop: "20px",
        paddingBottom: isMobile ? "20px" : "30px", // Added bottom padding for balance
        animation: "fadeInSpray 0.7s ease-out 0.2s both",
        minHeight: 0,
        maxWidth: "100%", // ✅ Sin limitación de ancho para más espacio
        width: "100%",
        margin: "0 auto",
        marginBottom: isMobile ? "10px" : "15px"
      }}>
        {/* CHARACTER SELECTION Section */}
        {ownedCharacters.length > 0 && (
          <Box style={{ marginBottom: isMobile ? "30px" : "40px" }}>


            {/* Character Selection UI */}
            <Box style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isMobile ? '10px' : '20px',
              marginBottom: isMobile ? '20px' : '30px'
            }}>
              {/* Left Arrow */}
              <Button
                variant="unstyled"
                onClick={handlePreviousCharacter}
                style={{
                  width: isMobile ? '50px' : '60px',
                  height: isMobile ? '50px' : '60px',
                  cursor: ownedCharacters.length <= 1 ? 'default' : 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                  border: 'none',
                  backgroundColor: 'transparent',
                  position: 'relative',
                  opacity: ownedCharacters.length <= 1 ? 0.4 : 1
                }}
              >
                <div className="left-arrow-bg" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${comboImg})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  transform: 'scaleX(-1)',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none',
                  filter: ownedCharacters.length <= 1 ? 'grayscale(100%)' : 'none'
                }} />
              </Button>

              {/* Character Display */}
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: isMobile ? '200px' : '250px'
              }}>
                {/* Character Preview */}
                <Box style={{
                  width: isMobile ? '150px' : '200px',
                  height: isMobile ? '24vh' : '28vh',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '3px solid #f32210',
                  borderRadius: '20px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <CharacterPreview
                    characterName={ownedCharacters[selectedCharacter]?.name}
                    style={{
                      width: '120%',
                      height: '120%',
                      transform: 'scale(1.2)'
                    }}
                  />
                </Box>
                
                {/* Instruction Text */}
                <Text style={{
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: 700,
                  color: 'rgb(255, 215, 0)',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  maxWidth: '200px'
                }}>
                  SELECT YOUR FIGHTER AND YOUR NEXT OPPONENT
                </Text>
              </Box>

              {/* Right Arrow */}
              <Button
                variant="unstyled"
                onClick={handleNextCharacter}
                style={{
                  width: isMobile ? '50px' : '60px',
                  height: isMobile ? '50px' : '60px',
                  cursor: ownedCharacters.length <= 1 ? 'default' : 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                  border: 'none',
                  backgroundColor: 'transparent',
                  position: 'relative',
                  opacity: ownedCharacters.length <= 1 ? 0.4 : 1
                }}
              >
                <div className="left-arrow-bg" style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${comboImg})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none',
                  filter: ownedCharacters.length <= 1 ? 'grayscale(100%)' : 'none'
                }} />
              </Button>
            </Box>


          </Box>
        )}

        {/* OPPONENTS Section */}
        <Box style={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px'
        }}>
          
          <Grid 
            gutter={isMobile ? "sm" : "md"}
            style={{ 
              width: '100%',
              maxWidth: '400px', // ✅ Limitado a 400px para mejor proporción
              margin: '0 auto'
            }}
          >
            {opponents.map((opponent, index) => (
              <Grid.Col 
                key={opponent.id} 
                span={4}
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
                        top: '60%',
                        left: '40%',
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


                  </Card>
                  
                  {/* Fighter Name */}
                  <Text style={{
                    fontSize: isMobile ? '14px' : '16px',
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

          {/* Arcade Mechanic Label */}
          <Text style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'rgb(255, 215, 0)',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            textAlign: 'center',
            lineHeight: 1.3,
            maxWidth: '200px',
            animation: 'fadeInSpray 0.5s ease-out 0.6s both'
          }}>
            FIGHT THROUGH ALL OPPONENTS IN SEQUENCE TO UNLOCK THE NEXT ONE
          </Text>
        </Box>


      </Box>
    </Box>
  );
};

export default CombinedShopOpponents; 