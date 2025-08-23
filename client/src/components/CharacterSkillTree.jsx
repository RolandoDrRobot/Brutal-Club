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
  const { isExiting } = useCharacterAnimations();
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
    playButtonSound();
    setSelectedCharacter((prev) => (prev > 0 ? prev - 1 : characters.length - 1));
  }, [playButtonSound, characters.length]);

  const handleNextCharacter = useCallback(() => {
    playButtonSound();
    setSelectedCharacter((prev) => (prev < characters.length - 1 ? prev + 1 : 0));
  }, [playButtonSound, characters.length]);

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
        style={{
          padding: isMobile ? '8px' : '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #f32210',
          borderRadius: '15px',
          boxShadow: `
            0 0 15px rgba(243, 34, 16, 0.3),
            inset 0 0 15px rgba(243, 34, 16, 0.1)
          `,
          width: '100%',
          maxWidth: isMobile ? 'calc(33.333% - 6px)' : '280px', // 3 cajas en una fila móvil
          minHeight: 'auto',
          flex: isMobile ? '1' : 'none' // Flex igual para las 3 cajas en móvil
        }}
      >
        {/* Stat Header */}
        <Stack spacing={isMobile ? 'xs' : 'sm'} align="center">
          <Text style={{
            fontSize: isMobile ? '14px' : '18px',
            lineHeight: 1,
            fontWeight: 900,
            color: '#f32210',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            backgroundColor: 'rgba(243, 34, 16, 0.1)',
            padding: isMobile ? '4px 8px' : '6px 12px',
            borderRadius: '6px',
            border: '1px solid #f32210'
          }}>
            {icon}
          </Text>
          <Text style={{
            fontSize: isMobile ? '12px' : '20px',
            fontWeight: 700,
            color: '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            textAlign: 'center',
            lineHeight: 1
          }}>
            {displayName}
          </Text>
          
          {/* Level Display */}
          <Text style={{
            fontSize: isMobile ? '10px' : '16px',
            color: '#f32210',
            fontWeight: 600,
            fontFamily: 'Anton, sans-serif',
            lineHeight: 1
          }}>
            LEVEL {currentLevel}/{maxLevel}
          </Text>

          {/* Progress Bar */}
          <Box style={{ width: '100%', marginBottom: isMobile ? '6px' : '10px' }}>
            <Progress
              value={progress}
              color="#f32210"
              size={isMobile ? 'sm' : 'lg'}
              radius="md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }}
              styles={{
                bar: {
                  background: `linear-gradient(90deg, #f32210, #ff4444)`,
                  boxShadow: '0 0 10px rgba(243, 34, 16, 0.5)'
                }
              }}
            />
          </Box>

          {/* Upgrade Button or Max Level Indicator */}
          {isMaxLevel(statName) ? (
            <Button
              disabled
              style={{
                fontSize: isMobile ? '8px' : '14px',
                fontWeight: 700,
                padding: isMobile ? '4px 8px' : '8px 16px',
                backgroundColor: '#444',
                borderColor: '#666',
                border: '2px solid #666',
                borderRadius: '8px',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: 'Anton, sans-serif',
                width: '100%',
                minHeight: isMobile ? '28px' : 'auto'
              }}
            >
              MAXED OUT
            </Button>
          ) : (
            <Button
              onClick={() => handleUpgradeStat(statName)}
              disabled={!canUpgrade(statName)}
              style={{
                fontSize: isMobile ? '8px' : '14px',
                fontWeight: 700,
                padding: isMobile ? '4px 6px' : '8px 16px',
                backgroundColor: canUpgrade(statName) ? 'transparent' : 'rgba(100, 100, 100, 0.3)',
                borderColor: canUpgrade(statName) ? '#f32210' : '#666',
                border: `2px solid ${canUpgrade(statName) ? '#f32210' : '#666'}`,
                borderRadius: '8px',
                color: canUpgrade(statName) ? '#f32210' : '#999',
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.5px' : '1px',
                fontFamily: 'Anton, sans-serif',
                width: '100%',
                cursor: canUpgrade(statName) ? 'pointer' : 'not-allowed',
                minHeight: isMobile ? '28px' : 'auto',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (canUpgrade(statName) && !isMobile) {
                  e.target.style.backgroundColor = 'rgba(243, 34, 16, 0.1)';
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (canUpgrade(statName) && !isMobile) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              +1 ({upgradeCost}C)
            </Button>
          )}
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
            borderColor: "#f32210",
            border: "3px solid #f32210",
            borderRadius: "10px",
            color: "#f32210",
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
        justifyContent: "center", // Centrar verticalmente
        alignItems: "center"
      }}
    >
      {/* Header with coin count */}
      <Box style={{ 
        textAlign: 'center', 
        marginBottom: isMobile ? '15px' : '25px',
        animation: "fadeInSpray 0.6s ease-out",
        flexShrink: 0,
        width: '100%'
      }}>
        <div 
          className="fight-title"
          style={{
            fontSize: isMobile ? '32px' : '66px', // Escalado para móvil pero manteniendo proporciones
            marginBottom: '20px'
          }}
        >
          BRUTAL CLUB
        </div>
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
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.3s ease',
            border: 'none',
            backgroundColor: 'transparent'
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
              pointerEvents: 'none'
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
              height: '85%', // Mayor porcentaje de la caja
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
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.3s ease',
            border: 'none',
            backgroundColor: 'transparent'
          }}
        />
      </Box>

      {/* Skill Trees Grid */}
      <Box style={{
        display: 'flex',
        flexDirection: 'row', // Siempre horizontal, tanto móvil como desktop
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: isMobile ? '8px' : '25px',
        width: '100%',
        maxWidth: isMobile ? '100%' : '900px',
        margin: '0 auto',
        marginBottom: isMobile ? '20px' : '30px',
        flexShrink: 0,
        padding: isMobile ? '0 5px' : '0'
      }}>
        <StatUpgradeTree statName="speed" />
        <StatUpgradeTree statName="stamina" />
        <StatUpgradeTree statName="strength" />
      </Box>

      {/* Action buttons */}
      <Group spacing={isMobile ? "md" : "lg"} position="center" style={{ 
        width: '100%',
        justifyContent: 'center',
        flexShrink: 0,
        paddingTop: isMobile ? '15px' : '0'
      }}>
        {/* Back Button */}
        <Button
          variant="outline"
          size={isMobile ? "md" : "lg"}
          onClick={() => {
            playButtonSound();
            onBackClick();
          }}
          style={{
            fontSize: isMobile ? "14px" : "20px",
            fontWeight: 700,
            padding: isMobile ? "10px 16px" : "15px 30px",
            backgroundColor: "transparent",
            borderColor: "#f32210",
            border: "3px solid #f32210",
            borderRadius: "10px",
            color: "#f32210",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontFamily: "Anton, sans-serif",
            minHeight: isMobile ? '40px' : 'auto'
          }}
        >
          BACK
        </Button>

        {/* Select Button */}
        <Button
          variant="outline"
          size={isMobile ? "lg" : "xl"}
          onClick={handleSelectCharacter}
          className="fight-button"
          style={{
            fontSize: isMobile ? "16px" : "24px",
            padding: isMobile ? "10px 16px" : "15px 30px",
            minHeight: isMobile ? "40px" : "70px",
            minWidth: isMobile ? "100px" : "160px",
            backgroundImage: `url(${mainButtonImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textShadow: `
              0 0 10px #000000,
              0 0 20px #000000,
              2px 2px 4px #000000
            `,
          }}
        >
          SELECT
        </Button>
      </Group>
    </Box>
  );
};

export default CharacterSkillTree;
