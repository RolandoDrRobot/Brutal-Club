import React from 'react';
import { Button, Box, Text, Stack, Card, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useGameState } from '../contexts/GameState';
import { useButtonSound } from '../hooks/useButtonSound';
import mainButtonImg from '../assets/mainbutton.jpeg';
import CharacterPreview from './CharacterPreview';

const OpponentSelect = ({ onChallengeClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  
  // Use GameState to get opponent status and coins
  const { getOpponentsStatus, coins } = useGameState();

  // Get opponents with their current unlock status
  const opponents = getOpponentsStatus().map((opponent, index) => ({
    ...opponent,
    number: `${index + 1}.`,
    avatar: '',
    model: opponent.model,
    isLocked: !opponent.isUnlocked
  }));

  const handleOpponentSelect = (opponent) => {
    if (!opponent.isLocked) {
      onChallengeClick(opponent);
    }
  };

  const getOpponentCardStyle = (opponent) => ({
    backgroundColor: 'transparent',
    border: '3px solid #f32210',
    borderRadius: '0px',
    padding: '0px',
    height: isMobile ? '140px' : '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    cursor: opponent.isLocked ? 'not-allowed' : 'pointer',
    opacity: opponent.isLocked ? 0.6 : 1,
    transition: 'all 0.3s ease',
    boxShadow: `
      0 0 10px rgba(243, 34, 16, 0.3)
    `,
    overflow: 'hidden'
  });

  const getButtonStyle = (opponent) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: '#4a6b8a',
    border: 'none',
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: 700,
    padding: '0px',
    borderRadius: '0px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontFamily: 'Anton, sans-serif',
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    cursor: opponent.isLocked ? 'not-allowed' : 'pointer',
    minWidth: isMobile ? '100px' : '120px',
    minHeight: isMobile ? '45px' : '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'none'
  });

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.6s ease-out",
        padding: isMobile ? "40px 10px 20px 10px" : "60px 20px 40px 20px",
        height: "100dvh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header */}
      <Box style={{ 
        textAlign: 'center',
        animation: "fadeInSpray 0.6s ease-out",
        flexShrink: 0,
        paddingTop: "25px"
      }}>
        <Text 
          className="fight-title"
          onClick={() => {
            playButtonSound();
            onBackClick();
          }}
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '60px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.opacity = "1";
          }}
        >
          FIGHT CLUB
        </Text>
        <Text className="fight-subtitle">
          OPPONENTS
        </Text>
      </Box>

      {/* Scrollable Opponents Container */}
      <Box style={{ 
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: isMobile ? "5px" : "10px",
        animation: "fadeInSpray 0.7s ease-out 0.2s both",
        minHeight: 0,
        width: '100%',
        maxWidth: '100%'
      }}>
        <Stack spacing={isMobile ? "xl" : "xxl"} style={{ 
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          paddingBottom: isMobile ? "20px" : "30px",
          paddingLeft: isMobile ? "0px" : "0px",
          paddingRight: isMobile ? "0px" : "0px"
        }}>
          {opponents.map((opponent, index) => (
            <Card
              key={opponent.id}
              style={{
                ...getOpponentCardStyle(opponent),
                animation: `fadeInSpray 0.5s ease-out ${0.3 + index * 0.1}s both`,
                marginBottom: isMobile ? "20px" : "30px",
                boxShadow: `
                  0 0 15px #f32210,
                  0 0 30px rgba(243, 34, 16, 0.4),
                  0 0 45px rgba(243, 34, 16, 0.2),
                  inset 0 0 15px rgba(243, 34, 16, 0.1)
                `
              }}
              onClick={() => {
                playButtonSound();
                handleOpponentSelect(opponent);
              }}
              onMouseEnter={(e) => {
                if (!isMobile && !opponent.isLocked) {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = `
                    0 0 25px #f32210,
                    0 0 50px rgba(243, 34, 16, 0.6),
                    0 0 75px rgba(243, 34, 16, 0.3),
                    inset 0 0 25px rgba(243, 34, 16, 0.2)
                  `;
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile && !opponent.isLocked) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = `
                    0 0 15px #f32210,
                    0 0 30px rgba(243, 34, 16, 0.4),
                    0 0 45px rgba(243, 34, 16, 0.2),
                    inset 0 0 15px rgba(243, 34, 16, 0.1)
                  `;
                }
              }}
            >
              {/* Left Column - Avatar */}
              <Box style={{
                width: '35%',
                height: '100%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box style={{
                  fontSize: isMobile ? '60px' : '80px',
                  filter: opponent.isLocked ? 'grayscale(100%)' : 'none',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '0px',
                  backgroundColor: opponent.model ? 'rgba(0, 0, 0, 0.3)' : 'transparent'
                }}>
                  {opponent.model ? (
                    <CharacterPreview
                      characterName={opponent.name}
                      style={{
                        position: 'relative',
                        left: '20%',
                        top: '20%',
                        width: '100%',
                        height: '100%',
                        transform: 'scale(1.2) scaleX(-1)',
                        margin: '0px',
                        padding: '0px',
                        border: 'none',
                        outline: 'none',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '80px',
                        minHeight: '80px'
                      }}
                    />
                  ) : (
                    opponent.avatar
                  )}
                </Box>
              </Box>

              {/* Middle Column - Name */}
              <Box style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: isMobile ? '10px' : '15px',
                paddingRight: isMobile ? '10px' : '15px'
              }}>
                <Text style={{
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: 700,
                  color: opponent.isLocked ? '#666' : '#F5F5DC',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '2px',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                  textAlign: 'center',
                  lineHeight: 1,
                  marginBottom: '2px'
                }}>
                  {opponent.number}
                </Text>
                <Text style={{
                  fontSize: isMobile ? '20px' : '26px',
                  fontWeight: 700,
                  color: opponent.isLocked ? '#666' : '#F5F5DC',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
                  textAlign: 'center',
                  lineHeight: 1
                }}>
                  {opponent.name}
                </Text>
              </Box>

              {/* Right Column - Reward */}
              <Box style={{ 
                width: '35%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile ? '8px' : '12px',
                paddingLeft: isMobile ? '10px' : '15px',
                paddingRight: isMobile ? '10px' : '15px'
              }}>
                {/* Reward */}
                <Group spacing="sm" align="center">
                  <Text style={{
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: 700,
                    color: '#4a6b8a',
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '1px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'
                  }}>
                    Arcade Mode
                  </Text>
                </Group>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Bottom Buttons */}
      <Box style={{
        flexShrink: 0,
        paddingTop: "20px",
        textAlign: "center",
        animation: "fadeInSpray 0.5s ease-out 0.4s both"
      }}>

      </Box>
    </Box>
  );
};

export default OpponentSelect; 