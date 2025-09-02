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
import StatUpgradeModal from './StatUpgradeModal';

const CharacterSkillTree = ({ onSelectClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isVerySmall = useMediaQuery("(max-width: 480px)");
  const { isExiting, setSelectedPlayer1Character } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [showNoCoinsModal, setShowNoCoinsModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalData, setUpgradeModalData] = useState({
    statName: '',
    statDisplayName: '',
    newLevel: 0,
    characterName: ''
  });

  // Use GameState to get purchased characters and stats
  const { 
    getShopCharactersStatus, 
    upgradeCharacterStat, 
    getCharacterStats, 
    coins,
    statPoints,
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

  const getStatLevel = useCallback((statName) => {
    const characterId = characters[selectedCharacter].id;
    const stats = getCharacterStats(characterId);
    return stats[statName];
  }, [characters, selectedCharacter, getCharacterStats]);

  const getStatProgress = useCallback((statName) => {
    const characterId = characters[selectedCharacter].id;
    const stats = getCharacterStats(characterId);
    const currentLevel = stats[statName];
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    return (currentLevel / maxLevel) * 100;
  }, [characters, selectedCharacter, getCharacterStats, GAME_CONFIG.STAT_CONFIG.MAX_LEVEL]);

  const handleUpgradeStat = useCallback((statName) => {
    playButtonSound();
    const characterId = characters[selectedCharacter].id;
    const currentLevel = getStatLevel(statName);
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = GAME_CONFIG.STAT_CONFIG.UPGRADE_COST;
    
    // Check if upgrade is possible
    if (currentLevel >= maxLevel) {
      // Already at max level
      return;
    }
    
    if (statPoints < upgradeCost) {
      // Not enough stat points - show modal
      setShowNoCoinsModal(true);
      return;
    }
    
    const success = upgradeCharacterStat(characterId, statName);
    if (success) {
      // Show upgrade success modal with animation
      const newLevel = getStatLevel(statName) + 1; // This will be the new level after upgrade
      setUpgradeModalData({
        statName: statName,
        statDisplayName: GAME_CONFIG.STAT_CONFIG.STAT_NAMES[statName],
        newLevel: newLevel,
        characterName: characters[selectedCharacter].name
      });
      setShowUpgradeModal(true);
    } else {
      // Could add feedback for failed upgrade
      console.log(`Failed to upgrade ${statName} for ${characterId}`);
    }
  }, [playButtonSound, characters, selectedCharacter, upgradeCharacterStat, statPoints, getStatLevel, GAME_CONFIG.STAT_CONFIG]);

  const canUpgrade = useCallback((statName) => {
    const currentLevel = getStatLevel(statName);
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = GAME_CONFIG.STAT_CONFIG.UPGRADE_COST;
    // Verificación estricta: debe tener al menos el costo exacto de la mejora
    return currentLevel < maxLevel && statPoints >= upgradeCost;
  }, [getStatLevel, GAME_CONFIG.STAT_CONFIG.MAX_LEVEL, GAME_CONFIG.STAT_CONFIG.UPGRADE_COST, statPoints]);

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
          border: `2px solid ${isMaxLevel(statName) ? '#FFD700' : '#f32210'}`,
          borderRadius: '8px',
          boxShadow: isMaxLevel(statName) ? `
            0 0 15px rgba(255, 215, 0, 0.3),
            inset 0 0 15px rgba(255, 215, 0, 0.1)
          ` : `
            0 0 15px rgba(243, 34, 16, 0.3),
            inset 0 0 15px rgba(243, 34, 16, 0.1)
          `,
          width: '100%',
          maxWidth: isMobile ? 'calc(33.333% - 6px)' : '280px', // 3 cajas en una fila móvil
          flex: isMobile ? '1' : 'none', // Flex igual para las 3 cajas en móvil
          cursor: canUpgrade(statName) ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          opacity: canUpgrade(statName) ? 1 : 0.6
        }}
      >
        {/* Stat Header */}
        <Stack spacing={isMobile ? 'xs' : 'sm'} align="center">

          <Text style={{
            fontSize: '24px',
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
          


          {/* Progress Bar */}
          <Box style={{ width: '100%', marginBottom: isMobile ? '6px' : '10px' }}>
            <Progress
              value={progress}
              color="#FFD700"
              size={isMobile ? 'sm' : 'lg'}
              radius="md"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                height: '30px'
              }}
              styles={{
                bar: {
                  background: `linear-gradient(90deg, #FFD700, #FFA500)`,
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                }
              }}
            />
          </Box>

          {/* Level Display */}
          <Text style={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 700,
            color: '#FFD700',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px',
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
          }}>
            LEVEL {currentLevel}/{maxLevel}
          </Text>

          {/* Cost Display */}
          {!isMaxLevel(statName) && (
            <Text style={{
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: 600,
              color: canUpgrade(statName) ? '#FFD700' : '#f32210',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '1px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
            }}>
              COST: {upgradeCost} STAT POINT{upgradeCost !== 1 ? 'S' : ''}
            </Text>
          )}

          {/* Max Level Indicator */}
          {isMaxLevel(statName) && (
            <Text style={{
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: 600,
              color: '#FFD700',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '1px',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
            }}>
              MAX LEVEL
            </Text>
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
          animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "electricFadeIn 0.8s ease-out",
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

      </Box>
    );
  }

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "electricFadeIn 0.8s ease-out",
        padding: isMobile ? "10px" : "40px",
        paddingBottom: "40px",
        minHeight: "100dvh",
        height: "auto",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >


      {/* Character selection area */}
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
          {/* Character 3D Model Container */}
          <Box
            key={selectedCharacter}
            style={{
              width: '100%',
              height: '120%', // Aumentado para hacer el elemento más alto
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '8px',
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
        margin: '0',
        flexShrink: 0,
        padding: isMobile ? '0 5px' : '0'
      }}>
        <StatUpgradeTree statName="speed" />
        <StatUpgradeTree statName="stamina" />
        <StatUpgradeTree statName="strength" />
      </Box>



      {/* No Coins Modal */}
      {showNoCoinsModal && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'electricPulse 0.5s ease-out'
          }}
          onClick={() => setShowNoCoinsModal(false)}
        >
          <Box
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              border: '3px solid #f32210',
              borderRadius: '8px',
              padding: isMobile ? '30px 20px' : '40px 30px',
              maxWidth: isMobile ? '90%' : '400px',
              textAlign: 'center',
              animation: 'electricEntry 0.6s ease-out 0.1s both'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Coin Icon */}
            <Box
              style={{
                width: isMobile ? '60px' : '80px',
                height: isMobile ? '60px' : '80px',
                backgroundColor: '#FFD700',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? '30px' : '40px',
                margin: '0 auto 20px',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                animation: 'rotate 3s linear infinite'
              }}
            >
              ⭐
            </Box>

            {/* Title */}
            <Text
              style={{
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 900,
                color: '#f32210',
                fontFamily: 'Anton, sans-serif',
                letterSpacing: '2px',
                marginBottom: '15px',
                textTransform: 'uppercase'
              }}
            >
              NO STAT POINTS!
            </Text>

            {/* Message */}
            <Text
              style={{
                fontSize: isMobile ? '16px' : '18px',
                color: '#F5F5DC',
                fontFamily: 'Anton, sans-serif',
                letterSpacing: '1px',
                marginBottom: '25px',
                lineHeight: 1.4
              }}
            >
              You need 1 stat point to upgrade your fighter's stats. Buy packs from the store to get more stat points!
            </Text>

            {/* Close Button */}
            <Button
              onClick={() => setShowNoCoinsModal(false)}
              style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 700,
                padding: isMobile ? '12px 25px' : '15px 30px',
                backgroundColor: 'transparent',
                border: '3px solid #f32210',
                borderRadius: '8px',
                color: '#f32210',
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

export default CharacterSkillTree;
