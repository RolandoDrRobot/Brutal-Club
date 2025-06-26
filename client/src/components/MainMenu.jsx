import React from 'react';
import { Button, Box, Text, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const MainMenu = ({ onStartClick, onFightersClick, onShopClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const menuButtonStyle = {
    fontSize: isMobile ? "28px" : "36px",
    fontWeight: 700,
    padding: isMobile ? "12px 30px" : "15px 45px",
    minHeight: isMobile ? "60px" : "80px",
    minWidth: isMobile ? "220px" : "280px",
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
    marginBottom: isMobile ? "15px" : "20px"
  };

  const handleButtonHover = (e, isEntering) => {
    if (!isMobile) {
      if (isEntering) {
        e.target.style.transform = "scale(1.05)";
        e.target.style.backgroundColor = "rgba(252, 63, 49, 0.1)";
        e.target.style.boxShadow = `
          0 0 30px #fc3f31,
          0 0 60px rgba(252, 63, 49, 0.5),
          inset 0 0 30px rgba(252, 63, 49, 0.2)
        `;
      } else {
        e.target.style.transform = "scale(1)";
        e.target.style.backgroundColor = "transparent";
        e.target.style.boxShadow = `
          0 0 20px #fc3f31,
          0 0 40px rgba(252, 63, 49, 0.3),
          inset 0 0 20px rgba(252, 63, 49, 0.1)
        `;
      }
    }
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
          radial-gradient(circle at 20% 20%, rgba(252, 63, 49, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(252, 63, 49, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)
        `
      }}
    >
      {/* Main title */}
      <Stack spacing={isMobile ? "xl" : "xxl"} align="center">
        <Box style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}>
          <Text
            style={{
              fontSize: isMobile ? '60px' : '120px',
              fontWeight: 900,
              color: '#fc3f31',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '8px',
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
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: 400,
              color: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '2px',
              marginTop: '10px'
            }}
          >
            You do not talk about fight club
          </Text>
        </Box>

        {/* Menu buttons */}
        <Stack spacing={isMobile ? "lg" : "xl"} align="center">
          <Button
            variant="outline"
            size="xl"
            onClick={onStartClick}
            style={menuButtonStyle}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            START
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onFightersClick}
            style={menuButtonStyle}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            FIGHTERS
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onShopClick}
            style={menuButtonStyle}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            SHOP
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onBackClick}
            style={menuButtonStyle}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            BACK
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MainMenu; 