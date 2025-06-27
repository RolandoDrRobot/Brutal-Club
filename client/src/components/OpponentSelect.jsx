import React from 'react';
import { Button, Box, Text, Stack, Card, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import mainButtonImg from '../assets/mainbutton.jpeg';

const OpponentSelect = ({ onChallengeClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isExiting } = useCharacterAnimations();

  // Datos de los oponentes
  const opponents = [
    {
      id: 'office_worker',
      number: '1.',
      name: 'THE OFFICE WORKER',
      isLocked: false,
      avatar: '👔',
      description: 'Corporate fighter with hidden rage'
    },
    {
      id: 'construction_worker',
      number: '2.',
      name: 'CONSTRUCTION WORKER',
      isLocked: true,
      avatar: '👷‍♂️',
      description: 'Tough builder with heavy hands'
    },
    {
      id: 'mysterious_fighter',
      number: '3.',
      name: 'MYSTERIOUS FIGHTER',
      isLocked: true,
      avatar: '🥷',
      description: 'Unknown fighter with deadly skills'
    },
    {
      id: 'champion',
      number: '4.',
      name: 'THE CHAMPION',
      isLocked: true,
      avatar: '🏆',
      description: 'Undefeated underground champion'
    }
  ];

  const handleOpponentSelect = (opponent) => {
    if (!opponent.isLocked) {
      console.log(`Selected opponent: ${opponent.name}`);
      onChallengeClick(opponent);
    }
  };

  const getOpponentCardStyle = (opponent) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '3px solid #fc3f31',
    borderRadius: '15px',
    padding: isMobile ? '20px' : '25px',
    height: isMobile ? '120px' : '140px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    cursor: opponent.isLocked ? 'not-allowed' : 'pointer',
    opacity: opponent.isLocked ? 0.7 : 1,
    transition: 'all 0.3s ease',
    boxShadow: `
      0 0 20px rgba(252, 63, 49, 0.3),
      inset 0 0 20px rgba(252, 63, 49, 0.1)
    `,
    marginBottom: isMobile ? '15px' : '20px'
  });

  const getButtonStyle = (opponent) => ({
    backgroundImage: `url(${mainButtonImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: opponent.isLocked ? 'rgba(100, 100, 100, 0.8)' : '#fc3f31',
    color: opponent.isLocked ? '#666' : '#FFF',
    border: opponent.isLocked ? '2px solid #666' : '2px solid #fc3f31',
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 700,
    padding: isMobile ? '12px 20px' : '15px 25px',
    borderRadius: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: 'Anton, sans-serif',
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    cursor: opponent.isLocked ? 'not-allowed' : 'pointer',
    minWidth: isMobile ? '100px' : '120px',
    boxShadow: opponent.isLocked ? 'none' : '0 0 15px rgba(252, 63, 49, 0.5)'
  });

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: isExiting ? "fadeOutSpray 0.8s ease-out" : "fadeInSpray 1.2s ease-out",
        padding: isMobile ? "40px 20px 20px 20px" : "60px 40px 40px 40px",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header */}
      <Box style={{ 
        textAlign: 'center',
        animation: "fadeInSpray 1.2s ease-out",
        flexShrink: 0,
        marginBottom: isMobile ? "30px" : "40px"
      }}>
        <Text className="fight-title" style={{ 
          marginBottom: '10px'
        }}>
          FIGHT CLUB
        </Text>
        <Text className="fight-subtitle" style={{ 
          fontSize: isMobile ? '18px' : '24px',
          marginBottom: '0px'
        }}>
          OPPONENTS
        </Text>
      </Box>

      {/* Scrollable Opponents Container */}
      <Box style={{ 
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: isMobile ? "5px" : "10px",
        animation: "fadeInSpray 1.5s ease-out 0.3s both"
      }}>
        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          minHeight: "100%",
          paddingBottom: isMobile ? "20px" : "30px"
        }}>
          <Stack spacing="md" style={{ 
            width: '100%',
            maxWidth: '800px'
          }}>
            {opponents.map((opponent, index) => (
              <Card
                key={opponent.id}
                style={{
                  ...getOpponentCardStyle(opponent),
                  animation: `fadeInSpray 1s ease-out ${0.5 + index * 0.2}s both`
                }}
                onClick={() => handleOpponentSelect(opponent)}
                onMouseEnter={(e) => {
                  if (!isMobile && !opponent.isLocked) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = `
                      0 0 30px rgba(252, 63, 49, 0.5),
                      inset 0 0 30px rgba(252, 63, 49, 0.2)
                    `;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile && !opponent.isLocked) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = `
                      0 0 20px rgba(252, 63, 49, 0.3),
                      inset 0 0 20px rgba(252, 63, 49, 0.1)
                    `;
                  }
                }}
              >
                {/* Left side - Avatar and Info */}
                <Group spacing="lg" style={{ flex: 1 }}>
                  {/* Avatar */}
                  <Box style={{
                    fontSize: isMobile ? '40px' : '50px',
                    filter: opponent.isLocked ? 'grayscale(100%)' : 'none',
                    flexShrink: 0
                  }}>
                    {opponent.avatar}
                  </Box>

                  {/* Opponent Info */}
                  <Box style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: isMobile ? '18px' : '22px',
                      fontWeight: 700,
                      color: opponent.isLocked ? '#666' : '#FFF',
                      fontFamily: 'Anton, sans-serif',
                      letterSpacing: '1px',
                      marginBottom: '5px'
                    }}>
                      {opponent.number} {opponent.name}
                    </Text>
                    {!isMobile && (
                      <Text style={{
                        fontSize: '14px',
                        color: opponent.isLocked ? '#555' : '#CCC',
                        fontFamily: 'Arial, sans-serif'
                      }}>
                        {opponent.description}
                      </Text>
                    )}
                  </Box>
                </Group>

                {/* Right side - Action Button or Lock */}
                <Box style={{ flexShrink: 0 }}>
                  {opponent.isLocked ? (
                    <Group spacing="xs" align="center">
                      <Text style={{
                        fontSize: isMobile ? '24px' : '30px'
                      }}>
                        🔒
                      </Text>
                      <Button
                        style={getButtonStyle(opponent)}
                        disabled
                      >
                        LOCKED
                      </Button>
                    </Group>
                  ) : (
                    <Button
                      style={getButtonStyle(opponent)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpponentSelect(opponent);
                      }}
                    >
                      CHALLENGE
                    </Button>
                  )}
                </Box>
              </Card>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Bottom Buttons */}
      <Box style={{
        flexShrink: 0,
        paddingTop: isMobile ? "20px" : "30px",
        textAlign: "center",
        animation: "fadeInSpray 1s ease-out 0.8s both"
      }}>
        {/* Back Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={onBackClick}
          style={{
            backgroundImage: `url(${mainButtonImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: 700,
            padding: isMobile ? "12px 25px" : "15px 30px",
            minHeight: isMobile ? "50px" : "60px",
            minWidth: isMobile ? "120px" : "150px",
            backgroundColor: "transparent",
            borderColor: "#fc3f31",
            border: "3px solid #fc3f31",
            borderRadius: "10px",
            color: "#fc3f31",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontFamily: "Anton, sans-serif",
            boxShadow: `
              0 0 15px #fc3f31,
              0 0 30px rgba(252, 63, 49, 0.3),
              inset 0 0 15px rgba(252, 63, 49, 0.1)
            `,
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = `
                0 0 25px #fc3f31,
                0 0 50px rgba(252, 63, 49, 0.5),
                inset 0 0 25px rgba(252, 63, 49, 0.2)
              `;
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = `
                0 0 15px #fc3f31,
                0 0 30px rgba(252, 63, 49, 0.3),
                inset 0 0 15px rgba(252, 63, 49, 0.1)
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

export default OpponentSelect; 