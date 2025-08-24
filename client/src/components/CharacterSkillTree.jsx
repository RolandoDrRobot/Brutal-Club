import React, { useState, useMemo, useCallback } from 'react';
import { Button, Box, Text, Stack, Group, Paper, Progress } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useGameState } from '../contexts/GameState';
import { useButtonSound } from '../hooks/useButtonSound';
import mainButtonImg from '../assets/mainbutton.jpeg';
import comboImg from '../assets/combo.png';
import CharacterPreview from './CharacterPreview';

const CharacterSkillTree = ({ onSelectClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isVerySmall = useMediaQuery("(max-width: 480px)");
  const { isExiting, setSelectedPlayer1Character } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const [selectedCharacter, setSelectedCharacter] = useState(0);

  // Use GameState to get purchased characters and stats
  const { 
    getShopCharactersStatus, 
    upgradeCharacterStat, 
    getCharacterStats, 
    coins,
    GAME_CONFIG 
  } = useGameState();
  
  // Filter only purchased characters - Memoized for performance
  const purchasedCharacters = useMemo(() => 
    getShopCharactersStatus().filter(char => char.isPurchased),
    [getShopCharactersStatus]
  );
  
  // Map to the expected format for character selection - Memoized to prevent re-renders
  const characters = useMemo(() => 
    purchasedCharacters.map(char => ({
      id: char.id,
      name: char.name,
      description: char.description,
      model: char.model
    })),
    [purchasedCharacters]
  );

  const handlePreviousCharacter = useCallback(() => {
    if (characters.length <= 1) return; // No action if only one character
    playButtonSound();
    const newIndex = selectedCharacter > 0 ? selectedCharacter - 1 : characters.length - 1;
    setSelectedCharacter(newIndex);
    // Update active fighter
    if (characters[newIndex]) {
      setSelectedPlayer1Character(characters[newIndex].model);
    }
  }, [playButtonSound, characters, selectedCharacter, setSelectedPlayer1Character]);

  const handleNextCharacter = useCallback(() => {
    if (characters.length <= 1) return; // No action if only one character
    playButtonSound();
    const newIndex = selectedCharacter < characters.length - 1 ? selectedCharacter + 1 : 0;
    setSelectedCharacter(newIndex);
    // Update active fighter
    if (characters[newIndex]) {
      setSelectedPlayer1Character(characters[newIndex].model);
    }
  }, [playButtonSound, characters, selectedCharacter, setSelectedPlayer1Character]);

  const handleSelectCharacter = useCallback(() => {
    playButtonSound();
    onSelectClick(characters[selectedCharacter]);
  }, [playButtonSound, onSelectClick, characters, selectedCharacter]);

  const handleUpgradeStat = useCallback((statName) => {
    playButtonSound();
    const characterId = characters[selectedCharacter].id;
    const success = upgradeCharacterStat(characterId, statName);
    if (!success) {
      // Could add feedback for failed upgrade (no coins, max level, etc.)
      console.log(`Failed to upgrade ${statName} for ${characterId}`);
    }
  }, [playButtonSound, characters, selectedCharacter, upgradeCharacterStat]);

  const getStatProgress = useCallback((statName) => {
    const characterId = characters[selectedCharacter].id;
    const stats = getCharacterStats(characterId);
    const currentLevel = stats[statName];
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    return (currentLevel / maxLevel) * 100;
  }, [characters, selectedCharacter, getCharacterStats, GAME_CONFIG.STAT_CONFIG.MAX_LEVEL]);

  const getStatLevel = useCallback((statName) => {
    const characterId = characters[selectedCharacter].id;
    const stats = getCharacterStats(characterId);
    return stats[statName];
  }, [characters, selectedCharacter, getCharacterStats]);

  const canUpgrade = useCallback((statName) => {
    const currentLevel = getStatLevel(statName);
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = GAME_CONFIG.STAT_CONFIG.UPGRADE_COST;
    return currentLevel < maxLevel && coins >= upgradeCost;
  }, [getStatLevel, GAME_CONFIG.STAT_CONFIG.MAX_LEVEL, GAME_CONFIG.STAT_CONFIG.UPGRADE_COST, coins]);

  const isMaxLevel = useCallback((statName) => {
    const currentLevel = getStatLevel(statName);
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    return currentLevel >= maxLevel;
  }, [getStatLevel, GAME_CONFIG.STAT_CONFIG.MAX_LEVEL]);

  // Skill tree component for a single stat
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
            e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (canUpgrade(statName) && !isMobile) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
          }
        }}
        style={{
          padding: isMobile ? '15px' : '25px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backgroundImage: `url(${mainButtonImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: `2px solid ${canUpgrade(statName) ? '#FFD700' : '#666'}`,
          borderRadius: '15px',
          boxShadow: canUpgrade(statName) ? `
            0 0 15px rgba(255, 215, 0, 0.3),
            inset 0 0 15px rgba(255, 215, 0, 0.1)
          ` : `
            0 0 15px rgba(102, 102, 102, 0.3),
            inset 0 0 15px rgba(102, 102, 102, 0.1)
          `,
          width: '100%',
          maxWidth: isMobile ? 'calc(33.333% - 6px)' : '280px', // 3 cajas en una fila móvil
          minHeight: isMobile ? '120px' : '160px',
          flex: isMobile ? '1' : 'none', // Flex igual para las 3 cajas en móvil
          cursor: canUpgrade(statName) ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          opacity: canUpgrade(statName) ? 1 : 0.6
        }}
      >
        {/* Stat Header */}
        <Stack spacing={isMobile ? 'xs' : 'sm'} align="center">

          <Text style={{
            fontSize: isMobile ? '12px' : '20px',
            fontWeight: 700,
            color: '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            textAlign: 'center',
            lineHeight: 1,
            textShadow: `
              0 0 10px #000000,
              0 0 20px #000000,
              2px 2px 4px #000000
            `
          }}>
            {displayName}
          </Text>
          
          {/* Level Display */}
          <Text style={{
            fontSize: isMobile ? '10px' : '16px',
            color: '#FFD700',
            fontWeight: 600,
            fontFamily: 'Anton, sans-serif',
            lineHeight: 1,
            textShadow: `
              0 0 10px #000000,
              0 0 20px #000000,
              2px 2px 4px #000000
            `
          }}>
            LEVEL {currentLevel}/{maxLevel}
          </Text>

          {/* Progress Bar */}
          <Box style={{ width: '100%', marginBottom: isMobile ? '6px' : '10px' }}>
            <Progress
              value={progress}
              color="#FFD700"
              size={isMobile ? 'sm' : 'lg'}
              radius="md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
              styles={{
                bar: {
                  background: `linear-gradient(90deg, #FFD700, #FFA500)`,
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                }
              }}
            />
          </Box>

          {/* Upgrade Button or Max Level Indicator */}
          {/* Status indicator */}
          <Text style={{
            fontSize: isMobile ? '8px' : '12px',
            fontWeight: 600,
            color: isMaxLevel(statName) ? '#999' : canUpgrade(statName) ? '#FFD700' : '#666',
            fontFamily: 'Anton, sans-serif',
            textAlign: 'center',
            marginTop: isMobile ? '4px' : '8px',
            textShadow: `
              0 0 10px #000000,
              0 0 20px #000000,
              2px 2px 4px #000000
            `
          }}>
            {isMaxLevel(statName) ? 'MAX LEVEL' : canUpgrade(statName) ? `CLICK TO UPGRADE (${upgradeCost}C)` : 'INSUFFICIENT COINS'}
          </Text>
        </Stack>
      </Paper>
    );
  };

  // If no characters are available, show a message
  if (characters.length === 0) {
    return (
      <Box
        className="fight-screen-container fight-screen-background"
        style={{
          animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.6s ease-out",
          padding: isMobile ? "20px" : "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100dvh"
        }}
      >
        <Text style={{
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: 700,
          color: '#f32210',
          fontFamily: 'Anton, sans-serif',
          letterSpacing: '2px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          NO CHARACTERS AVAILABLE
        </Text>
        <Text style={{
          fontSize: isMobile ? '16px' : '20px',
          color: '#F5F5DC',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          Visit the shop to purchase characters
        </Text>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            playButtonSound();
            onBackClick();
          }}
          style={{
            fontSize: isMobile ? "16px" : "20px",
            fontWeight: 700,
            padding: isMobile ? "12px 20px" : "15px 30px",
            backgroundColor: "transparent",
            borderColor: "#FFD700",
            border: "3px solid #FFD700",
            borderRadius: "10px",
            color: "#FFD700",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontFamily: "Anton, sans-serif",
          }}
        >
          BACK
        </Button>
      </Box>
    );
  }

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.6s ease-out",
        padding: isMobile ? "10px" : "40px",
        minHeight: "100dvh",
        height: "auto",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Distribuir espacios
        alignItems: "center"
      }}
    >
      {/* Header with Arcade Mode info and close button */}
      <Box style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        animation: "fadeInSpray 0.7s ease-out 0.2s both",
        flexShrink: 0,
        paddingTop: '20px',
        paddingBottom: '30px',
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
            fontSize: '24px',
            fontWeight: 700,
            color: '#FFD700',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            whiteSpace: 'nowrap'
          }}>
            Welcome to the Club
          </Text>
          <Text style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgb(245, 245, 220)',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '0.5px',
            marginTop: '4px',
            lineHeight: 1.2
          }}>
            Get your fighters trained using your coins
            </Text>
        </Box>
        <Box style={{ flexShrink: 0 }}>
          <Button
            variant="outline"
            onClick={() => {
              playButtonSound();
              onBackClick();
            }}
            style={{
              fontSize: '16px',
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

      {/* Character selection area */}
      <Box style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: isMobile ? '100%' : '800px',
        margin: '0 auto',
        marginBottom: isMobile ? '20px' : '25px',
        flexShrink: 0
      }}>
        {/* Left Arrow */}
        <Button
          variant="unstyled"
          onClick={handlePreviousCharacter}
          style={{
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            position: 'relative',
            cursor: characters.length <= 1 ? 'default' : 'pointer',
            padding: 0,
            transition: 'all 0.3s ease',
            border: 'none',
            backgroundColor: 'transparent',
            opacity: characters.length <= 1 ? 0.4 : 1
          }}
        >
          <div 
            style={{
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
              filter: characters.length <= 1 ? 'grayscale(100%)' : 'none'
            }}
          />
        </Button>

        {/* Character Display */}
        <Box style={{
          width: isMobile ? '180px' : '250px',
          height: isMobile ? '280px' : '320px', // Aún más alta
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: isMobile ? '0 10px' : '0 20px',
          position: 'relative'
        }}>
          {/* Character 3D Model Container */}
          <Box
            key={selectedCharacter}
            style={{
              width: '100%',
              height: '98%', // Mayor porcentaje de la caja
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '3px solid #f32210',
              borderRadius: '15px',
              marginBottom: '10px',
              boxShadow: `
                0 0 20px rgba(243, 34, 16, 0.3),
                inset 0 0 20px rgba(243, 34, 16, 0.1)
              `,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CharacterPreview
              characterName={characters[selectedCharacter].name}
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

          {/* Character Name */}
          <Text style={{
            fontSize: isMobile ? '16px' : '24px',
            fontWeight: 700,
            color: '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            textAlign: 'center',
            lineHeight: 1
          }}>
            {characters[selectedCharacter].name}
          </Text>
        </Box>

        {/* Right Arrow */}
        <Button
          variant="unstyled"
          onClick={handleNextCharacter}
          style={{
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            backgroundImage: `url(${comboImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            cursor: characters.length <= 1 ? 'default' : 'pointer',
            padding: 0,
            transition: 'all 0.3s ease',
            border: 'none',
            backgroundColor: 'transparent',
            opacity: characters.length <= 1 ? 0.4 : 1,
            filter: characters.length <= 1 ? 'grayscale(100%)' : 'none'
          }}
        />
      </Box>

      {/* Skill Trees Grid */}
      <Box style={{
        display: 'flex',
        flexDirection: 'row', // Siempre horizontal, tanto móvil como desktop
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: isMobile ? '8px' : '25px',
        width: '100%',
        maxWidth: isMobile ? '100%' : '900px',
        margin: '0 auto',
        marginBottom: '40px',
        flexShrink: 0,
        padding: isMobile ? '0 5px' : '0'
      }}>
        <StatUpgradeTree statName="speed" />
        <StatUpgradeTree statName="stamina" />
        <StatUpgradeTree statName="strength" />
      </Box>


    </Box>
  );
};

export default CharacterSkillTree;
