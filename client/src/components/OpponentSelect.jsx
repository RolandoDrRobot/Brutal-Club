import React from 'react';
import { Button, Box, Text, Stack, Card, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import mainButtonImg from '../assets/mainbutton.jpeg';
import CharacterPreview from './CharacterPreview';

const OpponentSelect = ({ onChallengeClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const { isExiting } = useCharacterAnimations();

  // Datos de los oponentes
  const opponents = [
    {
      id: 'tyler',
      number: '1.',
      name: 'TYLER',
      isLocked: false,
      avatar: '🧔‍♂️',
      model: 'Tyler',
      description: 'Soap maker with deadly skills'
    },
    {
      id: 'pete',
      number: '2.',
      name: 'PETE',
      isLocked: true,
      avatar: '👷‍♂️',
      model: 'pete',
      description: 'Construction worker with heavy fists'
    },
    {
      id: 'vince',
      number: '3.',
      name: 'VINCE',
      isLocked: true,
      avatar: '🧑‍🚒',
      model: 'Vince',
      description: 'Fire fighter with burning rage'
    },
    {
      id: 'bob',
      number: '4.',
      name: 'BOB',
      isLocked: true,
      avatar: '👔',
      model: 'Bob',
      description: 'Business man with corporate fury'
    }
  ];

  const handleOpponentSelect = (opponent) => {
    if (!opponent.isLocked) {
      console.log(`Selected opponent: ${opponent.name}`);
      onChallengeClick(opponent);
    }
  };

  const getOpponentCardStyle = (opponent) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    border: '3px solid #fc3f31',
    borderRadius: '15px',
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
      0 0 10px #fc3f31,
      0 0 20px rgba(252, 63, 49, 0.2),
      inset 0 0 10px rgba(252, 63, 49, 0.05)
    `,
    overflow: 'hidden'
  });

  const getButtonStyle = (opponent) => ({
    backgroundImage: `url(${mainButtonImg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: '#FFD700',
    border: opponent.isLocked ? 'none' : '3px solid #fc3f31',
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: 700,
    padding: '0px',
    borderRadius: '8px',
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
    boxShadow: opponent.isLocked ? 'none' : `
      0 0 10px #fc3f31,
      0 0 20px rgba(252, 63, 49, 0.5),
      inset 0 0 10px rgba(252, 63, 49, 0.1)
    `
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
        marginBottom: isMobile ? "20px" : "30px"
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
        animation: "fadeInSpray 1.5s ease-out 0.3s both",
        minHeight: 0
      }}>
        <Stack spacing={isMobile ? "lg" : "xl"} style={{ 
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          paddingBottom: isMobile ? "20px" : "30px"
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
                    0 0 15px #fc3f31,
                    0 0 30px rgba(252, 63, 49, 0.3),
                    inset 0 0 15px rgba(252, 63, 49, 0.1)
                  `;
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile && !opponent.isLocked) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = `
                    0 0 10px #fc3f31,
                    0 0 20px rgba(252, 63, 49, 0.2),
                    inset 0 0 10px rgba(252, 63, 49, 0.05)
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
                  width: isMobile ? '80px' : '100px',
                  height: isMobile ? '80px' : '100px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  backgroundColor: opponent.model ? 'rgba(0, 0, 0, 0.3)' : 'transparent'
                }}>
                  {opponent.model ? (
                    <CharacterPreview
                      characterName={opponent.name}
                      style={{
                        position: 'relative',
                        top: '30%',
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
                        minWidth: '80px',
                        minHeight: '80px'
                      }}
                    />
                  ) : (
                    opponent.avatar
                  )}
                </Box>
              </Box>

              {/* Right Column - Reward and Button */}
              <Box style={{ 
                flex: 1, 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile ? '10px' : '15px',
                paddingLeft: isMobile ? '20px' : '30px'
              }}>
                {/* Reward/Lock Status */}
                {opponent.isLocked ? (
                  <Group spacing="sm" align="center">
                    <Text style={{
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: 700,
                      color: '#FFD700',
                      fontFamily: 'Anton, sans-serif',
                      letterSpacing: '1px',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'
                    }}>
                      LOCKED
                    </Text>
                  </Group>
                ) : (
                  <Group spacing="sm" align="center">
                    <Text style={{
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: 700,
                      color: '#FFD700',
                      fontFamily: 'Anton, sans-serif',
                      letterSpacing: '1px',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)'
                    }}>
                      200
                    </Text>
                  </Group>
                )}

                {/* Action Button */}
                <Button
                  style={getButtonStyle(opponent)}
                  disabled={opponent.isLocked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!opponent.isLocked) {
                      handleOpponentSelect(opponent);
                    }
                  }}
                >
                  {opponent.isLocked ? 'LOCKED' : 'CHALLENGE'}
                </Button>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Bottom Buttons */}
      <Box style={{
        flexShrink: 0,
        paddingTop: isMobile ? "15px" : "20px",
        textAlign: "center",
        animation: "fadeInSpray 1s ease-out 0.8s both"
      }}>
        {/* Back Button */}
        <Button
          variant="outline"
          size="xl"
          onClick={onBackClick}
          style={{
            backgroundImage: `url(${mainButtonImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: 700,
            padding: isMobile ? "15px 40px" : "20px 60px",
            minHeight: isMobile ? "60px" : "80px",
            minWidth: isMobile ? "200px" : "250px",
            backgroundColor: "transparent",
            borderColor: "#fc3f31",
            border: "4px solid #fc3f31",
            borderRadius: "15px",
            color: "#fc3f31",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontFamily: "Anton, sans-serif",
            boxShadow: `
              0 0 20px #fc3f31,
              0 0 40px rgba(252, 63, 49, 0.3),
              inset 0 0 20px rgba(252, 63, 49, 0.1)
            `,
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = `
                0 0 30px #fc3f31,
                0 0 60px rgba(252, 63, 49, 0.5),
                inset 0 0 30px rgba(252, 63, 49, 0.2)
              `;
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = `
                0 0 20px #fc3f31,
                0 0 40px rgba(252, 63, 49, 0.3),
                inset 0 0 20px rgba(252, 63, 49, 0.1)
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