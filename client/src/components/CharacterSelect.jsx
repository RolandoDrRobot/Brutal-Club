import React, { useState } from 'react';
import { Button, Box, Text, Stack, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useGameState } from '../contexts/GameState';
import { useButtonSound } from '../hooks/useButtonSound';
import mainButtonImg from '../assets/mainbutton.jpeg';
import comboImg from '../assets/combo.png';
import CharacterPreview from './CharacterPreview';

const CharacterSelect = ({ onSelectClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isVerySmall = useMediaQuery("(max-width: 480px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();
  const [selectedCharacter, setSelectedCharacter] = useState(0);

  // Use GameState to get purchased characters
  const { getShopCharactersStatus } = useGameState();
  
  // Filter only purchased characters
  const purchasedCharacters = getShopCharactersStatus().filter(char => char.isPurchased);
  
  // Map to the expected format for character selection
  const characters = purchasedCharacters.map(char => ({
    id: char.id,
    name: char.name,
    description: char.description,
    model: char.model
  }));

  const handlePreviousCharacter = () => {
    playButtonSound();
    setSelectedCharacter((prev) => (prev > 0 ? prev - 1 : characters.length - 1));
  };

  const handleNextCharacter = () => {
    playButtonSound();
    setSelectedCharacter((prev) => (prev < characters.length - 1 ? prev + 1 : 0));
  };

  const handleSelectCharacter = () => {
    playButtonSound();
    onSelectClick(characters[selectedCharacter]);
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
        padding: isMobile ? "40px 20px 20px 20px" : "60px 40px 40px 40px",
        height: "100dvh"
      }}
    >
      {/* Main title */}
      <Box style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        animation: "fadeInSpray 0.6s ease-out"
      }}>

        <Text className="fight-subtitle">
          SELECT CHARACTER
        </Text>
      </Box>

      {/* Character selection area */}
      <Box style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '800px',
        height: isVerySmall ? '55dvh' : isMobile ? '65dvh' : '70dvh',
        margin: isVerySmall ? '10px 0' : isMobile ? '15px 0' : '25px 0'
      }}>
        {/* Left Arrow */}
        <Button
          variant="unstyled"
          onClick={handlePreviousCharacter}
          style={{
            width: isMobile ? '60px' : '80px',
            height: isMobile ? '60px' : '80px',
            position: 'relative',
            cursor: 'pointer',
            padding: 0,
            animation: "arrowPulse 2s ease-in-out infinite",
            transition: 'all 0.3s ease',
            border: 'none',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              const bgElement = e.target.querySelector('.left-arrow-bg');
              if (bgElement) {
                bgElement.style.transform = "scaleX(-1) scale(1.1)";
                bgElement.style.filter = "drop-shadow(0 0 10px #f32210)";
              }
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              const bgElement = e.target.querySelector('.left-arrow-bg');
              if (bgElement) {
                bgElement.style.transform = "scaleX(-1) scale(1)";
                bgElement.style.filter = "none";
              }
            }
          }}
        >
          <div 
            className="left-arrow-bg"
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

        {/* Character Display Area */}
        <Box style={{
          width: isMobile ? '350px' : '450px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 20px',
          position: 'relative'
        }}>
          {/* Character 3D Model Container */}
          <Box
            key={selectedCharacter}
            style={{
              width: '100%',
              height: '80%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '3px solid #f32210',
              borderRadius: '20px',
              marginBottom: '15px',
              boxShadow: `
                0 0 30px #f32210,
                0 0 60px rgba(243, 34, 16, 0.4),
                0 0 90px rgba(243, 34, 16, 0.2),
                inset 0 0 30px rgba(243, 34, 16, 0.1),
                inset 0 0 60px rgba(243, 34, 16, 0.05)
              `,
              animation: "characterSwitch 0.8s ease-out, neonPulse 3s ease-in-out infinite",
              position: 'relative',
              overflow: 'hidden',
              padding: 0,
              margin: '0 0 15px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Character spotlight effect */}
            <Box style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: '20px',
              background: 'radial-gradient(ellipse, rgba(243, 34, 16, 0.4) 0%, transparent 70%)',
              borderRadius: '50%',
              zIndex: 1,
              pointerEvents: 'none'
            }} />
            
            {/* 3D Character Model */}
            <CharacterPreview
              characterName={characters[selectedCharacter].name}
              style={{
                width: '120%',
                height: '120%',
                position: 'absolute',
                top: '55%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(1.2)',
                zIndex: 2,
                margin: 0,
                padding: 0,
                border: 'none',
                outline: 'none'
              }}
            />
          </Box>

          {/* Character Info */}
          <Stack spacing="xs" align="center">
            <Text style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 700,
              color: '#F5F5DC',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '2px'
            }}>
              {characters[selectedCharacter].name}
            </Text>
          </Stack>
        </Box>

        {/* Right Arrow */}
        <Button
          variant="unstyled"
          onClick={handleNextCharacter}
          style={{
            width: isMobile ? '60px' : '80px',
            height: isMobile ? '60px' : '80px',
            backgroundImage: `url(${comboImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            cursor: 'pointer',
            padding: 0,
            animation: "arrowPulse 2s ease-in-out infinite 1s",
            transition: 'all 0.3s ease',
            border: 'none',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.1)";
              e.target.style.filter = "drop-shadow(0 0 10px #f32210)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.filter = "none";
            }
          }}
        >
        </Button>
      </Box>

      {/* Action buttons */}
      <Group spacing="lg" position="center" style={{ 
        marginTop: isVerySmall ? '15px' : isMobile ? '20px' : '30px',
        width: '100%',
        justifyContent: 'center'
      }}>


        {/* Select Button */}
        <Button
          variant="outline"
          size="xl"
          onClick={handleSelectCharacter}
          className="fight-button"
          style={{
            fontSize: isMobile ? "20px" : "24px",
            padding: isMobile ? "12px 20px" : "15px 30px",
            minHeight: isMobile ? "60px" : "70px",
            minWidth: isMobile ? "120px" : "160px",
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
            animation: "none"
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.05)";
              e.target.style.backgroundColor = "rgba(243, 34, 16, 0.1)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.backgroundColor = "transparent";
            }
          }}
        >
          SELECT
        </Button>
      </Group>
    </Box>
  );
};

export default CharacterSelect; 