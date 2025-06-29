import React from 'react';
import { Button, Box, Text, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useButtonSound } from '../hooks/useButtonSound';
import mainButtonImg from '../assets/mainbutton.jpeg';

// Import button assets
import button1 from '../assets/button1.png';
import button2 from '../assets/button2.png';
import button3 from '../assets/button3.png';
import button4 from '../assets/button4.png';

const MainMenu = ({ onStartClick, onFightersClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();

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
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.6s ease-out, backgroundImpact 0.8s ease-out"
      }}
    >
      {/* Main title */}
      <Stack spacing={isMobile ? "xl" : "xxl"} align="center">
        <Box 
          style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            animation: "fadeInSpray 0.6s ease-out"
          }}
        >
          <Text className="fight-title">
            FIGHT CLUB
          </Text>
          <div className="fight-subtitle">
            You do not talk about fight club
          </div>
        </Box>

        {/* Menu buttons */}
        <Stack 
          spacing={isMobile ? "lg" : "xl"} 
          align="center"
          style={{
            animation: "fadeInSpray 0.7s ease-out 0.2s both"
          }}
        >
          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              playButtonSound();
              onStartClick();
            }}
            style={getMenuButtonStyle(button1)}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            FIGHT
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              playButtonSound();
              onFightersClick();
            }}
            style={getMenuButtonStyle(button2)}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            CLUB
          </Button>

          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              playButtonSound();
              onBackClick();
            }}
            style={getMenuButtonStyle(button4)}
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