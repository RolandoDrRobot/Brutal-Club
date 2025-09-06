import React, { useState, useEffect } from 'react';
import { Button, Box, Text, Stack, Grid, Card, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useGameState } from '../contexts/GameState';
import { useButtonSound } from '../hooks/useButtonSound';
import { useCharacterEconomy, useRewards } from '../hooks/useEconomy';
import CharacterPreview from './CharacterPreview';
import { useModelLoader } from '../hooks/useModelLoader';
import punchImg from "../assets/optimized/punch.webp";
import comboImg from "../assets/optimized/combo.webp";
import CharacterPurchaseModal from './CharacterPurchaseModal';

const CombinedShopOpponents = ({ onChallengeClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isExiting, selectedPlayer1Character, setSelectedPlayer1Character } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const [selectedCharacter, setSelectedCharacter] = useState(0);

    const {
    coins,
    getShopCharactersStatus, 
    getOpponentsStatus
  } = useGameState();
  
  const { 
    purchaseCharacter, 
    isCharacterPurchased, 
    canAffordCharacter 
  } = useCharacterEconomy();
  
  const { startArcadeMode } = useRewards();
  const { lazyLoadModel } = useModelLoader();
  const [loadingModels, setLoadingModels] = useState(new Set());
  const [loadedModels, setLoadedModels] = useState(new Set());
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseModalData, setPurchaseModalData] = useState({
    characterName: '',
    characterDescription: '',
    characterEmoji: '',
    coinsSpent: 0
  });


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
                      fontSize: "30px",
          color: "transparent",
          fontFamily: "Anton, sans-serif"
        }}>
        </Text>
      </Box>
    );
  }


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

        }
      });
      
      setLoadedModels(successful);
      setLoadingModels(new Set());
    };

    loadShopModels();
  }, []);


  const opponents = getOpponentsStatus().map((opponent, index) => ({
    ...opponent,
    number: `${index + 1}.`,
    isLocked: !opponent.isUnlocked,
    price: opponent.coinReward
  }));


  const shopCharacters = getShopCharactersStatus();


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

        setPurchaseModalData({
          characterName: character.name,
          characterDescription: character.description,
          characterEmoji: character.emoji,
          coinsSpent: character.price
        });
        setShowPurchaseModal(true);
      } else {


      }
    }
  };

  const handleOpponentSelect = (opponent) => {
    const isLocked = opponent.isLocked;
    const isDefeated = opponent.isDefeated;
    const isFirstOpponent = opponent.id === 'tyler_1';
    const hasNoCoins = coins === 0;
    

    if (!isLocked && !isDefeated && !(isFirstOpponent && hasNoCoins)) {
      playButtonSound();
      

      if (isFirstOpponent) {
        startArcadeMode();
      }
      
      onChallengeClick(opponent);
    } else if (isFirstOpponent && hasNoCoins) {
    } else if (isDefeated) {
    }
  };


  const handlePreviousCharacter = () => {
    playButtonSound();
    const newIndex = selectedCharacter > 0 ? selectedCharacter - 1 : ownedCharacters.length - 1;
    setSelectedCharacter(newIndex);

    if (ownedCharacters[newIndex]) {
      setSelectedPlayer1Character(ownedCharacters[newIndex].model);
    }
  };

  const handleNextCharacter = () => {
    playButtonSound();
    const newIndex = selectedCharacter < ownedCharacters.length - 1 ? selectedCharacter + 1 : 0;
    setSelectedCharacter(newIndex);

    if (ownedCharacters[newIndex]) {
      setSelectedPlayer1Character(ownedCharacters[newIndex].model);
    }
  };

  const getCharacterCardStyle = (character, isOpponent = false) => {
    const baseStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '3px solid #f32210',
      borderRadius: '8px',
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

      const isLocked = character.isLocked;
      const isDefeated = character.isDefeated;
      const isFirstOpponent = character.id === 'tyler_1';
      const hasNoCoins = coins === 0;
      const isActive = !isLocked && !isDefeated && !(isFirstOpponent && hasNoCoins);
      
      let borderColor = '#666';
      let opacity = 0.6;
      let cursor = 'not-allowed';
      
      if (isDefeated) {
        borderColor = '#f32210';
        opacity = 0.8;
        cursor = 'not-allowed';
      } else if (isFirstOpponent && hasNoCoins) {
        borderColor = '#666';
        opacity = 0.4;
        cursor = 'not-allowed';
      } else if (isActive) {
        borderColor = '#F5F5DC';
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
          0 0 20px rgba(245, 245, 220, 0.3),
          inset 0 0 10px rgba(245, 245, 220, 0.1)
        ` : isDefeated ? `
          0 0 10px ${borderColor},
          0 0 20px rgba(243, 34, 16, 0.2),
          inset 0 0 10px rgba(243, 34, 16, 0.05)
        ` : baseStyle.boxShadow
      };
    } else {

      if (character.isPurchased) {
        return {
          ...baseStyle,
          cursor: 'default',
          opacity: 1,
          border: '3px solid #F5F5DC'
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
                  fontSize: isMobile ? '15px' : '18px',
      fontWeight: 700,
      padding: '6px 8px',
      borderRadius: '0px',
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

      const isLocked = character.isLocked;
      return {
        ...baseStyle,
        color: isLocked ? '#666' : '#f32210',
        cursor: isLocked ? 'not-allowed' : 'pointer'
      };
    } else {

      if (character.isPurchased) {
        return {
          ...baseStyle,
          color: '#F5F5DC',
          cursor: 'default'
        };
      }
      
      const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
      return {
        ...baseStyle,
        color: isLocked ? '#666' : '#F5F5DC',
        cursor: isLocked ? 'not-allowed' : 'pointer'
      };
    }
  };

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "electricEntry 0.8s ease-out",
        padding: isMobile ? "30px 15px 25px" : "50px 30px 40px",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >


      {/* Scrollable Content Container - Vertically Centered */}
      <Box style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: "auto",
        overflowX: "hidden",
        animation: "electricFadeIn 0.8s ease-out 0.3s both",
        minHeight: 0,
        maxWidth: "100%",
        width: "100%"
      }}>
        {/* CHARACTER SELECTION Section */}
        {ownedCharacters.length > 0 && (
          <Box style={{ width: '100%' }}>


            {/* Character Selection UI */}
            <Box style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '55dvh',
              maxWidth: isMobile ? '100%' : '800px',
              margin: '0 auto',
              marginBottom: 0,
              flexShrink: 0
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
                width: '100%',
                maxWidth: '500px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                margin: isMobile ? '0 10px' : '0 20px',
                position: 'relative'
              }}>
                {/* Character Preview */}
                <Box style={{
                  width: '100%',
                  height: '120%',
                  borderRadius: '8px',
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
                      position: 'absolute',
                      top: '55%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) scale(1.2)',
                      zIndex: 2
                    }}
                  />
                </Box>
                

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
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            {opponents.map((opponent, index) => (
              <Grid.Col 
                key={opponent.id} 
                span={4}
                style={{
                  animation: `electricStatic 0.6s ease-out ${0.5 + index * 0.12}s both`
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
                    fontSize: isMobile ? '18px' : '20px',
                    fontWeight: 700,
                    color: opponent.isLocked ? '#666' : '#F5F5DC',
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '1px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}>
                    {opponent.isDefeated ? 'DEFEATED' : opponent.isUnlocked ? 'FIGHT' : opponent.name}
                  </Text>
                </Box>
              </Grid.Col>
            ))}
          </Grid>


        </Box>


      </Box>

      {/* Character Purchase Success Modal */}
      <CharacterPurchaseModal
        isVisible={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        characterName={purchaseModalData.characterName}
        characterDescription={purchaseModalData.characterDescription}
        characterEmoji={purchaseModalData.characterEmoji}
        coinsSpent={purchaseModalData.coinsSpent}
      />

    </Box>
  );
};

export default CombinedShopOpponents; 