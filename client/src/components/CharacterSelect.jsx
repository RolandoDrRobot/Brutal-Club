import React, { useState } from 'react';
import { Button, Box, Text, Stack, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import mainButtonImg from '../assets/mainbutton.jpeg';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';

const CharacterSelect = ({ onSelectClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isVerySmall = useMediaQuery("(max-width: 480px)");
  const { isExiting } = useCharacterAnimations();
  const [selectedCharacter, setSelectedCharacter] = useState(0);

  // Información de los personajes disponibles
  const characters = [
    {
      id: 0,
      name: "PETE",
      description: "Construction Worker",
      model: "pete" // Este será el identificador para el modelo 3D
    },
    {
      id: 1,
      name: "TYLER",
      description: "Soap Maker",
      model: "tyler" // Este será el identificador para el modelo 3D
    }
  ];

  const handlePreviousCharacter = () => {
    setSelectedCharacter((prev) => (prev === 0 ? characters.length - 1 : prev - 1));
  };

  const handleNextCharacter = () => {
    setSelectedCharacter((prev) => (prev === characters.length - 1 ? 0 : prev + 1));
  };

  const handleSelectCharacter = () => {
    onSelectClick(characters[selectedCharacter]);
  };

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: isExiting ? "fadeOutSpray 0.8s ease-out" : "fadeInSpray 1.2s ease-out",
        padding: isMobile ? "20px" : "40px"
      }}
    >
      {/* Main title */}
      <Box style={{ 
        textAlign: 'center', 
        marginBottom: isVerySmall ? '15px' : isMobile ? '20px' : '30px',
        animation: "fadeInSpray 1.2s ease-out"
      }}>
        <Text className="fight-title" style={{ 
          fontSize: isMobile ? '32px' : '48px',
          marginBottom: isVerySmall ? '5px' : isMobile ? '10px' : '15px'
        }}>
          FIGHT CLUB
        </Text>
        <Text className="fight-subtitle" style={{ fontSize: isMobile ? '14px' : '18px' }}>
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
        height: isVerySmall ? '55vh' : isMobile ? '65vh' : '70vh',
        margin: isVerySmall ? '10px 0' : isMobile ? '15px 0' : '25px 0'
      }}>
        {/* Left Arrow */}
        <Button
          variant="unstyled"
          onClick={handlePreviousCharacter}
          style={{
            fontSize: isMobile ? '40px' : '60px',
            color: '#fc3f31',
            cursor: 'pointer',
            padding: '20px',
            animation: "arrowPulse 2s ease-in-out infinite",
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.3)";
              e.target.style.textShadow = "0 0 20px #fc3f31";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.textShadow = "none";
            }
          }}
        >
          &#8249;
        </Button>

        {/* Character Display Area */}
        <Box style={{
          width: isMobile ? '300px' : '400px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 40px',
          position: 'relative'
        }}>
          {/* Character Model Placeholder */}
          <Box
            key={selectedCharacter}
            style={{
              width: '100%',
              height: '60%',
              backgroundColor: 'rgba(252, 63, 49, 0.1)',
              border: '3px solid #fc3f31',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '15px',
              boxShadow: `
                0 0 30px rgba(252, 63, 49, 0.3),
                inset 0 0 30px rgba(252, 63, 49, 0.1)
              `,
              animation: "characterSwitch 0.8s ease-out",
              position: 'relative',
              overflow: 'hidden'
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
              background: 'radial-gradient(ellipse, rgba(252, 63, 49, 0.4) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            
            {/* Character 3D Model will be rendered here */}
            <Text style={{
              fontSize: isMobile ? '60px' : '80px',
              color: '#fc3f31',
              textShadow: '0 0 20px #fc3f31'
            }}>
              {characters[selectedCharacter].name === 'PETE' ? '👷‍♂️' : '🧴'}
            </Text>
          </Box>

          {/* Character Info */}
          <Stack spacing="xs" align="center">
            <Text style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 700,
              color: '#fc3f31',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '2px',
              textShadow: '0 0 10px #fc3f31'
            }}>
              {characters[selectedCharacter].name}
            </Text>
            <Text style={{
              fontSize: isMobile ? '14px' : '18px',
              color: '#F5F5DC',
              fontFamily: 'Arial, sans-serif',
              textAlign: 'center'
            }}>
              {characters[selectedCharacter].description}
            </Text>
          </Stack>
        </Box>

        {/* Right Arrow */}
        <Button
          variant="unstyled"
          onClick={handleNextCharacter}
          style={{
            fontSize: isMobile ? '40px' : '60px',
            color: '#fc3f31',
            cursor: 'pointer',
            padding: '20px',
            animation: "arrowPulse 2s ease-in-out infinite 1s",
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.3)";
              e.target.style.textShadow = "0 0 20px #fc3f31";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1)";
              e.target.style.textShadow = "none";
            }
          }}
        >
          &#8250;
        </Button>
      </Box>

      {/* Action buttons */}
      <Group spacing="lg" position="center" style={{ 
        marginTop: isVerySmall ? '15px' : isMobile ? '20px' : '30px',
        width: '100%',
        justifyContent: 'center'
      }}>
        {/* Back Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={onBackClick}
          style={{
            fontSize: isMobile ? "16px" : "20px",
            fontWeight: 700,
            padding: isMobile ? "12px 20px" : "15px 30px",
            minHeight: isMobile ? "60px" : "70px",
            minWidth: isMobile ? "100px" : "140px",
            backgroundColor: "transparent",
            borderColor: "#666",
            border: "3px solid #666",
            borderRadius: "10px",
            color: "#666",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontFamily: "Anton, sans-serif",
            transition: "all 0.3s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.borderColor = "#fc3f31";
              e.target.style.color = "#fc3f31";
              e.target.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.target.style.borderColor = "#666";
              e.target.style.color = "#666";
              e.target.style.transform = "scale(1)";
            }
          }}
        >
          BACK
        </Button>

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
            animation: "selectButtonGlow 2s ease-in-out infinite"
          }}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.target.style.transform = "scale(1.05)";
              e.target.style.backgroundColor = "rgba(252, 63, 49, 0.1)";
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