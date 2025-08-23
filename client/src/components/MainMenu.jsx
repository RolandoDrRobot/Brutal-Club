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

const MainMenu = ({ onStartClick, onFightersClick, onStoreClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();

  const getMenuButtonStyle = (backgroundImage) => ({
    fontSize: isMobile ? "36px" : "45px",
    fontWeight: 700,
    padding: isMobile ? "18px 40px" : "20px 60px",
    minHeight: isMobile ? "100px" : "130px",
    minWidth: isMobile ? "280px" : "350px",
    backgroundColor: "transparent",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    borderColor: "#f32210",
    border: "4px solid #f32210",
    borderRadius: "15px",
    color: "#f32210",
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
    boxShadow: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    marginBottom: isMobile ? "15px" : "20px",
    animation: "none"
  });

  const handleButtonHover = (e, isEntering) => {
    if (!isMobile) {
      if (isEntering) {
        e.target.style.transform = "scale(1.05) rotate(1deg)";
        e.target.style.boxShadow = "none";
        e.target.style.animation = "screenShake 0.5s ease-in-out";
      } else {
        e.target.style.transform = "scale(1) rotate(0deg)";
        e.target.style.boxShadow = "none";
        e.target.style.animation = "none";
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
              onStoreClick();
            }}
            style={getMenuButtonStyle(button3)}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            STORE
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