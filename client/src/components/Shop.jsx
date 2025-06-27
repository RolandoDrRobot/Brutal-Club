import React, { useState } from 'react';
import { Button, Box, Text, Stack, Grid, Card, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import mainButtonImg from '../assets/mainbutton.jpeg';

const Shop = ({ onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isExiting } = useCharacterAnimations();
  const [coins, setCoins] = useState(1000); // Monedas del jugador

  // Datos de los personajes en la tienda
  const shopCharacters = [
    {
      id: 'pete_casual',
      name: 'PETE',
      description: 'Casual Worker',
      price: null,
      isLocked: true,
      emoji: '👷‍♂️',
      unlockCondition: 'Win 5 fights'
    },
    {
      id: 'construction_worker',
      name: 'BUILDER',
      description: 'Construction Pro',
      price: null,
      isLocked: true,
      emoji: '👷',
      unlockCondition: 'Win 10 fights'
    },
    {
      id: 'fire_fighter',
      name: 'HERO',
      description: 'Fire Fighter',
      price: 300,
      isLocked: false,
      emoji: '🧑‍🚒',
      canAfford: true
    },
    {
      id: 'business_man',
      name: 'BOSS',
      description: 'Business Man',
      price: 300,
      isLocked: false,
      emoji: '👔',
      canAfford: true
    }
  ];

  const handlePurchase = (character) => {
    if (character.price && coins >= character.price) {
      setCoins(prev => prev - character.price);
      console.log(`Purchased ${character.name} for ${character.price} coins`);
      // Aquí se implementaría la lógica para desbloquear el personaje
    }
  };

  const getCharacterCardStyle = (character) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '3px solid #fc3f31',
    borderRadius: '15px',
    padding: isMobile ? '15px' : '20px',
    height: isMobile ? '200px' : '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    cursor: character.isLocked ? 'not-allowed' : 'pointer',
    opacity: character.isLocked ? 0.6 : 1,
    transition: 'all 0.3s ease',
    boxShadow: `
      0 0 20px rgba(252, 63, 49, 0.3),
      inset 0 0 20px rgba(252, 63, 49, 0.1)
    `
  });

  const getButtonStyle = (character) => {
    if (character.isLocked) {
      return {
        backgroundImage: `url(${mainButtonImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: 'rgba(100, 100, 100, 0.8)',
        color: '#666',
        border: '2px solid #666',
        fontSize: isMobile ? '14px' : '16px',
        fontWeight: 700,
        padding: '8px 16px',
        borderRadius: '8px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontFamily: 'Anton, sans-serif',
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
        cursor: 'not-allowed'
      };
    } else {
      return {
        backgroundImage: `url(${mainButtonImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: character.canAfford ? 'rgba(252, 63, 49, 0.8)' : 'rgba(100, 100, 100, 0.8)',
        color: character.canAfford ? '#000' : '#666',
        border: character.canAfford ? '2px solid #fc3f31' : '2px solid #666',
        fontSize: isMobile ? '14px' : '16px',
        fontWeight: 700,
        padding: '8px 16px',
        borderRadius: '8px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontFamily: 'Anton, sans-serif',
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
        cursor: character.canAfford ? 'pointer' : 'not-allowed',
        boxShadow: character.canAfford ? '0 0 10px rgba(252, 63, 49, 0.5)' : 'none'
      };
    }
  };

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
      {/* Header with title and coins */}
      <Box style={{ 
        textAlign: 'center',
        animation: "fadeInSpray 1.2s ease-out",
        flexShrink: 0,
        marginBottom: isMobile ? "15px" : "20px"
      }}>
        <Text className="fight-title" style={{ 
          marginBottom: '10px'
        }}>
          FIGHT CLUB
        </Text>
        <Text className="fight-subtitle" style={{ 
          fontSize: isMobile ? '18px' : '24px',
          marginBottom: '15px'
        }}>
          STORE
        </Text>
        
        {/* Coins display */}
        <Box style={{
          display: 'inline-flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          border: '2px solid #FFD700',
          borderRadius: '20px',
          padding: '8px 16px',
          marginTop: '10px'
        }}>
          <Text style={{
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: 700,
            color: '#FFD700',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '1px'
          }}>
            💰 {coins} COINS
          </Text>
        </Box>
      </Box>

      {/* Scrollable Character Grid Container */}
      <Box style={{ 
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: isMobile ? "5px" : "10px",
        animation: "fadeInSpray 1.5s ease-out 0.3s both"
      }}>
        <Box style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          minHeight: "100%",
          paddingBottom: isMobile ? "20px" : "30px"
        }}>
          <Grid 
            gutter={isMobile ? "md" : "lg"}
            style={{ 
              width: '100%',
              maxWidth: '800px'
            }}
          >
            {shopCharacters.map((character, index) => (
              <Grid.Col 
                key={character.id} 
                span={6}
                style={{
                  animation: `fadeInSpray 1s ease-out ${0.5 + index * 0.2}s both`
                }}
              >
                <Card
                  style={getCharacterCardStyle(character)}
                  onClick={() => !character.isLocked && handlePurchase(character)}
                  onMouseEnter={(e) => {
                    if (!isMobile && !character.isLocked) {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = `
                        0 0 30px rgba(252, 63, 49, 0.5),
                        inset 0 0 30px rgba(252, 63, 49, 0.2)
                      `;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile && !character.isLocked) {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = `
                        0 0 20px rgba(252, 63, 49, 0.3),
                        inset 0 0 20px rgba(252, 63, 49, 0.1)
                      `;
                    }
                  }}
                >
                  {/* Character Avatar */}
                  <Box style={{
                    fontSize: isMobile ? '40px' : '50px',
                    marginBottom: '10px',
                    filter: character.isLocked ? 'grayscale(100%)' : 'none'
                  }}>
                    {character.emoji}
                  </Box>

                  {/* Character Info */}
                  <Stack spacing="xs" align="center" style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: isMobile ? '16px' : '18px',
                      fontWeight: 700,
                      color: character.isLocked ? '#666' : '#fc3f31',
                      fontFamily: 'Anton, sans-serif',
                      letterSpacing: '1px',
                      textAlign: 'center'
                    }}>
                      {character.name}
                    </Text>
                    <Text style={{
                      fontSize: isMobile ? '12px' : '14px',
                      color: character.isLocked ? '#555' : '#F5F5DC',
                      fontFamily: 'Arial, sans-serif',
                      textAlign: 'center'
                    }}>
                      {character.description}
                    </Text>

                    {/* Lock overlay for locked characters */}
                    {character.isLocked && (
                      <Box style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 10
                      }}>
                        <Text style={{
                          fontSize: isMobile ? '30px' : '40px',
                          marginBottom: '5px'
                        }}>
                          🔒
                        </Text>
                        <Text style={{
                          fontSize: isMobile ? '14px' : '16px',
                          fontWeight: 700,
                          color: '#FFD700',
                          fontFamily: 'Anton, sans-serif',
                          letterSpacing: '1px',
                          textAlign: 'center'
                        }}>
                          LOCKED
                        </Text>
                      </Box>
                    )}
                  </Stack>

                  {/* Action Button */}
                  <Button
                    style={getButtonStyle(character)}
                    disabled={character.isLocked || (character.price && coins < character.price)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!character.isLocked) {
                        handlePurchase(character);
                      }
                    }}
                  >
                    {character.isLocked 
                      ? 'LOCKED' 
                      : `BUY ${character.price}💰`
                    }
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Back Button */}
      <Box style={{
        animation: "fadeInSpray 1s ease-out 0.8s both",
        flexShrink: 0,
        paddingTop: isMobile ? "15px" : "20px",
        textAlign: "center"
      }}>
        <Button
          variant="outline"
          size="xl"
          onClick={onBackClick}
          style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: 700,
            padding: isMobile ? "15px 40px" : "20px 60px",
            minHeight: isMobile ? "60px" : "80px",
            minWidth: isMobile ? "200px" : "250px",
            backgroundImage: `url(${mainButtonImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
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

export default Shop; 