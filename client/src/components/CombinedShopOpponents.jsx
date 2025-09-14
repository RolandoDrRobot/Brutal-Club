import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Box, Text, Stack, Grid, Card, Group, Paper, Progress } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useGameState } from '../contexts/GameState';
import { useButtonSound } from '../hooks/useButtonSound';
import { useCharacterEconomy, useRewards } from '../hooks/useEconomy';
import { useEconomy } from '../contexts/EconomyContext';
import CharacterPreview from './CharacterPreview';
import { useModelLoader } from '../hooks/useModelLoader';
import comboImg from "../assets/optimized/combo.webp";
import punchImg from "../assets/optimized/punch.webp";
import CharacterPurchaseModal from './CharacterPurchaseModal';
import LeaderboardModal from './LeaderboardModal';
import StatUpgradeModal from './StatUpgradeModal';

const CombinedShopOpponents = ({ onChallengeClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isExiting, selectedPlayer1Character, setSelectedPlayer1Character } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const [selectedCharacter, setSelectedCharacter] = useState(0);

    const {
    coins,
    statPoints,
    GAME_CONFIG,
    getShopCharactersStatus, 
    getOpponentsStatus
  } = useGameState();
  
  const { 
    purchaseCharacter, 
    isCharacterPurchased, 
    canAffordCharacter,
    upgradeCharacterStat,
    getCharacterStats: getCharacterStatsFromEconomy
  } = useCharacterEconomy();
  
  const { startArcadeMode } = useRewards();
  const { getCharacterStats } = useEconomy();
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
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showNoCoinsModal, setShowNoCoinsModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalData, setUpgradeModalData] = useState({
    statName: '',
    statDisplayName: '',
    newLevel: 0,
    characterName: ''
  });
  const [showOpponentsGrid, setShowOpponentsGrid] = useState(true);

  const purchasedCharacters = useMemo(() => 
    getShopCharactersStatus().filter(char => char.isPurchased),
    [getShopCharactersStatus]
  );

  const ownedCharacters = useMemo(() => 
    purchasedCharacters.map(char => ({
      id: char.id,
      name: char.name.toUpperCase(),
      description: char.description,
      model: char.model
    })),
    [purchasedCharacters]
  );

  const getStatLevel = useCallback((statName) => {
    if (ownedCharacters.length === 0) return 1;
    const characterId = ownedCharacters[selectedCharacter].id;
    const stats = getCharacterStatsFromEconomy(characterId);
    return stats[statName];
  }, [ownedCharacters, selectedCharacter, getCharacterStatsFromEconomy]);

  const getStatProgress = useCallback((statName) => {
    if (ownedCharacters.length === 0) return 0;
    const characterId = ownedCharacters[selectedCharacter].id;
    const stats = getCharacterStatsFromEconomy(characterId);
    const currentLevel = stats[statName];
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    return (currentLevel / maxLevel) * 100;
  }, [ownedCharacters, selectedCharacter, getCharacterStatsFromEconomy, GAME_CONFIG.STAT_CONFIG.MAX_LEVEL]);

  const handleUpgradeStat = useCallback((statName) => {
    if (ownedCharacters.length === 0) return;
    playButtonSound();
    const characterId = ownedCharacters[selectedCharacter].id;
    const currentLevel = getStatLevel(statName);
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = GAME_CONFIG.STAT_CONFIG.UPGRADE_COST;
    
    if (currentLevel >= maxLevel) {
      return;
    }
    
    if (statPoints < upgradeCost) {
      setShowNoCoinsModal(true);
      return;
    }
    
    const success = upgradeCharacterStat(characterId, statName);
    if (success) {
      const newLevel = getStatLevel(statName) + 1;
      setUpgradeModalData({
        statName: statName,
        statDisplayName: GAME_CONFIG.STAT_CONFIG.STAT_NAMES[statName],
        newLevel: newLevel,
        characterName: ownedCharacters[selectedCharacter].name
      });
      setShowUpgradeModal(true);
    }
  }, [playButtonSound, ownedCharacters, selectedCharacter, upgradeCharacterStat, statPoints, getStatLevel, GAME_CONFIG.STAT_CONFIG]);

  const canUpgrade = useCallback((statName) => {
    if (ownedCharacters.length === 0) return false;
    const currentLevel = getStatLevel(statName);
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = GAME_CONFIG.STAT_CONFIG.UPGRADE_COST;
    return currentLevel < maxLevel && statPoints >= upgradeCost;
  }, [ownedCharacters, getStatLevel, GAME_CONFIG.STAT_CONFIG.MAX_LEVEL, GAME_CONFIG.STAT_CONFIG.UPGRADE_COST, statPoints]);

  const isMaxLevel = useCallback((statName) => {
    if (ownedCharacters.length === 0) return false;
    const currentLevel = getStatLevel(statName);
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    return currentLevel >= maxLevel;
  }, [ownedCharacters, getStatLevel, GAME_CONFIG.STAT_CONFIG.MAX_LEVEL]);

  const handleToggleView = useCallback(() => {
    playButtonSound();
    setShowOpponentsGrid(prev => !prev);
  }, [playButtonSound]);

  const StatUpgradeTree = ({ statName }) => {
    const statConfig = GAME_CONFIG.STAT_CONFIG;
    const icon = statConfig.STAT_ICONS[statName];
    const displayName = statConfig.STAT_NAMES[statName];
    const currentLevel = getStatLevel(statName);
    const progress = getStatProgress(statName);
    const maxLevel = statConfig.MAX_LEVEL;
    const upgradeCost = statConfig.UPGRADE_COST;

    return (
      <Paper
        onClick={() => canUpgrade(statName) ? handleUpgradeStat(statName) : null}
        onMouseEnter={(e) => {
          if (canUpgrade(statName) && !isMobile) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 179, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (canUpgrade(statName) && !isMobile) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#000000';
          }
        }}
        style={{
          padding: isMobile ? '15px' : '25px',
          backgroundColor: '#000000',
          border: `2px solid ${isMaxLevel(statName) ? '#FFB300' : '#A00000'}`,
          borderRadius: '8px',
          width: '100%',
          maxWidth: isMobile ? 'calc(33.333% - 6px)' : '280px',
          flex: isMobile ? '1' : 'none',
          cursor: canUpgrade(statName) ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          opacity: canUpgrade(statName) ? 1 : 0.6
        }}
      >
        <Stack spacing="sm" align="center">
          <Text style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#bbb092',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            textAlign: 'center',
            lineHeight: 1,
            textShadow: '0 0 10px rgba(0,0,0,1), 0 0 20px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,1)'
          }}>
            {displayName}
          </Text>
          
          <Box style={{ width: '100%', marginBottom: '6px' }}>
            <Progress
              value={progress}
              color={isMaxLevel(statName) ? '#FFB300' : '#A00000'}
              size="lg"
              radius="md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                height: '30px'
              }}
            />
          </Box>
          
          {!isMaxLevel(statName) && (
            <Text style={{
              fontSize: '14px',
              fontWeight: 700,
              color: '#A00000',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '1px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              LEVEL {currentLevel}/{maxLevel}
            </Text>
          )}
          
          {isMaxLevel(statName) ? (
            <Text style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#FFB300',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '1px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              MAX LEVEL
            </Text>
          ) : (
            <Text style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#A00000',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '1px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              {upgradeCost} STAT POINT{upgradeCost > 1 ? 'S' : ''}
            </Text>
          )}
        </Stack>
      </Paper>
    );
  };

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

  const getPlayerLevel = () => {
    if (!selectedPlayer1Character) return 9;
    
    const characterId = selectedPlayer1Character.toLowerCase();
    const stats = getCharacterStats(characterId);
    
    const totalStats = (stats.speed || 1) + (stats.stamina || 1) + (stats.strength || 1);
    const baseLevel = Math.floor(totalStats / 3);
    
    return Math.max(9, baseLevel);
  };

  const playerLevel = getPlayerLevel();



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
        const arcadeStarted = startArcadeMode();
        if (!arcadeStarted) {
          return;
        }
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
      border: '3px solid #A00000',
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
        0 0 10px #A00000,
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
        borderColor = '#A00000';
        opacity = 0.8;
        cursor = 'not-allowed';
      } else if (isFirstOpponent && hasNoCoins) {
        borderColor = '#666';
        opacity = 0.4;
        cursor = 'not-allowed';
      } else if (isActive) {
        borderColor = '#bbb092';
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
          border: '3px solid #bbb092'
        };
      }
      
      const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
      return {
        ...baseStyle,
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.6 : 1,
        border: isLocked ? '3px solid #666' : '3px solid #A00000'
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
        color: isLocked ? '#666' : '#A00000',
        cursor: isLocked ? 'not-allowed' : 'pointer'
      };
    } else {

      if (character.isPurchased) {
        return {
          ...baseStyle,
              color: '#bbb092',
          cursor: 'default'
        };
      }
      
      const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
      return {
        ...baseStyle,
        color: isLocked ? '#666' : '#bbb092',
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
        minHeight: 0,
        maxWidth: "100%",
        width: "100%",
        position: 'relative'
      }}>
        {/* Arcade Title - Top Left Corner */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            minWidth: isMobile ? '120px' : '160px'
          }}
        >
          <div style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 900,
            color: '#bbb092',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '4px',
            textShadow: '0 0 8px #bbb092',
            textAlign: 'left'
          }}>
            ARCADE MODE
          </div>
          <div style={{
            fontSize: isMobile ? '14px' : '18px',
            fontWeight: 600,
            color: '#A00000',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            textAlign: 'left',
            lineHeight: 1.2,
            textShadow: '0 0 5px #A00000'
          }}>
            Defeat fighters to level up
          </div>
        </Box>

        {/* Level Indicator - Top Right Corner */}
        <Box 
          onClick={() => {
            playButtonSound();
            setShowLeaderboardModal(true);
          }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '8px',
            padding: 0,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: isMobile ? '60px' : '80px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.backgroundColor = 'rgba(243, 34, 16, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = 'scale(1)';
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            }
          }}
        >
          <div style={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 700,
            color: '#bbb092',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '2px'
          }}>
            LEVEL
          </div>
          <div style={{
            fontSize: isMobile ? '32px' : '40px',
            fontWeight: 900,
            color: '#A00000',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '2px',
            lineHeight: 1
          }}>
            {playerLevel}
          </div>
        </Box>
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
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '30px' : '50px',
          position: 'relative'
        }}>
          
          {/* Punch Icon Toggle */}
          <img
            src={punchImg}
            alt="Punch Icon"
            onClick={handleToggleView}
            style={{
              width: '50px',
              height: '50px',
              position: 'absolute',
              top: '-60px',
              right: '0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.opacity = '0.8';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.target.style.transform = 'scale(1)';
                e.target.style.opacity = '1';
              }
            }}
          />
          
          {/* Conditional Content Based on Toggle */}
          {showOpponentsGrid ? (
            /* Opponents Grid */
          <Grid 
            gutter={isMobile ? "sm" : "md"}
            style={{ 
              width: '100%',
              maxWidth: '400px',
                margin: '0 auto',
                minHeight: '151px'
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
                    color: opponent.isLocked ? '#666' : '#bbb092',
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
          ) : (
            /* Stats Display */
            ownedCharacters.length > 0 && (
              <Box style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '8px',
                width: '100%',
                maxWidth: '400px',
                margin: '0px',
                flexShrink: 0,
                padding: '0px 5px',
                minHeight: '151px',
                animation: 'electricStatic 0.6s ease-out 0.5s both'
              }}>
                <StatUpgradeTree statName="speed" />
                <StatUpgradeTree statName="stamina" />
                <StatUpgradeTree statName="strength" />
              </Box>
            )
          )}

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

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isVisible={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
      />

      {/* No Coins Modal */}
      {showNoCoinsModal && (
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
              INSUFFICIENT STAT POINTS
            </Text>
            
            <Text style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#bbb092',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '1px',
              marginBottom: '30px',
              lineHeight: 1.4
            }}>
              You need 1 stat point to upgrade your fighter's stats. Buy packs from the store to get more stat points!
            </Text>

            <Button
              onClick={() => setShowNoCoinsModal(false)}
              style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 700,
                padding: isMobile ? '12px 25px' : '15px 30px',
                backgroundColor: 'transparent',
                border: '3px solid #A00000',
                borderRadius: '8px',
                color: '#A00000',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontFamily: 'Anton, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.backgroundColor = 'rgba(243, 34, 16, 0.1)';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              OK
            </Button>
          </Box>
        </Box>
      )}

      {/* Stat Upgrade Success Modal */}
      <StatUpgradeModal
        isVisible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        statName={upgradeModalData.statName}
        statDisplayName={upgradeModalData.statDisplayName}
        newLevel={upgradeModalData.newLevel}
        characterName={upgradeModalData.characterName}
      />

    </Box>
  );
};

export default CombinedShopOpponents; 