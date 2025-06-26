import React, { useState } from 'react';
import { Button, Box, Text, Stack, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const CharacterSelect = ({ onSelectClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
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

  // Inject fight-themed CSS animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes characterEnter {
        0% {
          transform: scale(0.8) translateY(50px);
          opacity: 0;
        }
        100% {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
      }
      
      @keyframes characterSwitch {
        0% {
          transform: scale(1) rotateY(0deg);
          opacity: 1;
        }
        50% {
          transform: scale(0.8) rotateY(90deg);
          opacity: 0.3;
        }
        100% {
          transform: scale(1) rotateY(0deg);
          opacity: 1;
        }
      }
      
      @keyframes arrowPulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.7;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
      }
      
      @keyframes selectButtonGlow {
        0%, 100% {
          box-shadow: 
            0 0 20px #fc3f31,
            0 0 40px rgba(252, 63, 49, 0.3),
            inset 0 0 20px rgba(252, 63, 49, 0.1);
        }
        50% {
          box-shadow: 
            0 0 40px #fc3f31,
            0 0 80px rgba(252, 63, 49, 0.6),
            inset 0 0 40px rgba(252, 63, 49, 0.3);
        }
      }
      
      @keyframes titlePunch {
        0% {
          transform: translateY(-30px) scale(0.9);
          opacity: 0;
        }
        60% {
          transform: translateY(5px) scale(1.05);
          opacity: 1;
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backgroundImage: `
          radial-gradient(circle at 30% 30%, rgba(252, 63, 49, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(252, 63, 49, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)
        `,
        animation: "characterEnter 1s ease-out"
      }}
    >
      {/* Main title */}
      <Box style={{ 
        textAlign: 'center', 
        marginBottom: isMobile ? '30px' : '40px',
        animation: "titlePunch 1.2s ease-out"
      }}>
        <Text
          style={{
            fontSize: isMobile ? '50px' : '80px',
            fontWeight: 900,
            color: '#fc3f31',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '6px',
            textShadow: `
              0 0 20px #fc3f31,
              0 0 40px rgba(252, 63, 49, 0.5),
              0 4px 20px rgba(252, 63, 49, 0.3)
            `,
            lineHeight: 0.9,
            marginBottom: '10px'
          }}
        >
          FIGHT CLUB
        </Text>
        <Text
          style={{
            fontSize: isMobile ? '20px' : '32px',
            fontWeight: 700,
            color: '#F5F5DC',
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '3px',
            textShadow: `
              0 0 10px #F5F5DC,
              0 0 20px rgba(245, 245, 220, 0.3)
            `
          }}
        >
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
        margin: isMobile ? '20px 0' : '40px 0'
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
          height: isMobile ? '400px' : '500px',
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
              height: '70%',
              backgroundColor: 'rgba(252, 63, 49, 0.1)',
              border: '3px solid #fc3f31',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
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
      <Group spacing="xl" style={{ marginTop: isMobile ? '30px' : '50px' }}>
        {/* Select Button */}
        <Button
          variant="outline"
          size="xl"
          onClick={handleSelectCharacter}
          style={{
            fontSize: isMobile ? "28px" : "36px",
            fontWeight: 700,
            padding: isMobile ? "15px 40px" : "20px 60px",
            minHeight: isMobile ? "70px" : "90px",
            minWidth: isMobile ? "200px" : "280px",
            backgroundColor: "transparent",
            borderColor: "#fc3f31",
            border: "4px solid #fc3f31",
            borderRadius: "15px",
            color: "#fc3f31",
            textTransform: "uppercase",
            letterSpacing: "3px",
            fontFamily: "Anton, sans-serif",
            boxShadow: `
              0 0 20px #fc3f31,
              0 0 40px rgba(252, 63, 49, 0.3),
              inset 0 0 20px rgba(252, 63, 49, 0.1)
            `,
            transition: "all 0.3s ease",
            cursor: "pointer",
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

        {/* Back Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={onBackClick}
          style={{
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: 700,
            padding: isMobile ? "10px 25px" : "15px 35px",
            minHeight: isMobile ? "50px" : "70px",
            minWidth: isMobile ? "120px" : "160px",
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
      </Group>
    </Box>
  );
};

export default CharacterSelect; 