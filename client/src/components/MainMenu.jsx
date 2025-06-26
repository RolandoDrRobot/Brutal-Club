import React from 'react';
import { Button, Box, Text, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';

// Import button assets
import button1 from '../assets/button1.png';
import button2 from '../assets/button2.png';
import button3 from '../assets/button3.png';
import button4 from '../assets/button4.png';

const MainMenu = ({ onStartClick, onFightersClick, onShopClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const getMenuButtonStyle = (backgroundImage) => ({
    fontSize: isMobile ? "28px" : "36px",
    fontWeight: 700,
    padding: isMobile ? "12px 30px" : "15px 45px",
    minHeight: isMobile ? "60px" : "80px",
    minWidth: isMobile ? "220px" : "280px",
    backgroundColor: "transparent",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    borderColor: "#fc3f31",
    border: "4px solid #fc3f31",
    borderRadius: "15px",
    color: "#fc3f31",
    textTransform: "uppercase",
    letterSpacing: "3px",
    fontFamily: "Anton, sans-serif",
    textAlign: "left",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    textShadow: `
      0 0 10px #000000,
      0 0 20px #000000,
      2px 2px 4px #000000
    `,
    boxShadow: `
      0 0 20px #fc3f31,
      0 0 40px rgba(252, 63, 49, 0.3),
      inset 0 0 20px rgba(252, 63, 49, 0.1)
    `,
    transition: "all 0.3s ease",
    cursor: "pointer",
    marginBottom: isMobile ? "15px" : "20px",
    animation: "redFlash 2s ease-in-out infinite"
  });

  const handleButtonHover = (e, isEntering) => {
    if (!isMobile) {
      if (isEntering) {
        e.target.style.transform = "scale(1.05) rotate(1deg)";
        e.target.style.boxShadow = `
          0 0 30px #fc3f31,
          0 0 60px rgba(252, 63, 49, 0.5),
          inset 0 0 30px rgba(252, 63, 49, 0.2)
        `;
        e.target.style.animation = "screenShake 0.5s ease-in-out";
      } else {
        e.target.style.transform = "scale(1) rotate(0deg)";
        e.target.style.boxShadow = `
          0 0 20px #fc3f31,
          0 0 40px rgba(252, 63, 49, 0.3),
          inset 0 0 20px rgba(252, 63, 49, 0.1)
        `;
        e.target.style.animation = "redFlash 2s ease-in-out infinite";
      }
    }
  };

  return (
    <Box
      className="fight-screen-container fight-screen-background"
      style={{
        animation: "screenEnterFromLeft 1.2s ease-out, backgroundImpact 1.5s ease-out"
      }}
    >
      {/* Main title */}
      <Stack spacing={isMobile ? "xl" : "xxl"} align="center">
        <Box 
          style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '40px' : '60px',
            animation: "titleSlam 1.2s ease-out"
          }}
        >
          <Text className="fight-title">
            FIGHT CLUB
          </Text>
          <Text
            style={{
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: 400,
              color: '#ffffff',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '2px',
              marginTop: '10px',
              animation: "fightPunchIn 1.5s ease-out 0.3s both"
            }}
          >
            You do not talk about fight club
          </Text>
        </Box>

        {/* Menu buttons */}
        <Stack 
          spacing={isMobile ? "lg" : "xl"} 
          align="center"
          style={{
            animation: "buttonsPunchSequence 1s ease-out 0.5s both"
          }}
        >
          <Button
            variant="outline"
            size="xl"
            onClick={onStartClick}
            style={{
              ...getMenuButtonStyle(button1),
              animationDelay: "0.7s"
            }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            FIGHT
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onFightersClick}
            style={{
              ...getMenuButtonStyle(button2),
              animationDelay: "0.9s"
            }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            CLUB
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onShopClick}
            style={{
              ...getMenuButtonStyle(button3),
              animationDelay: "1.1s"
            }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            SHOP
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={onBackClick}
            style={{
              ...getMenuButtonStyle(button4),
              animationDelay: "1.3s"
            }}
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