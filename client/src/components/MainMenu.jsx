import React from 'react';
import { Button, Box, Text, Stack, Grid } from '@mantine/core';
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
    fontSize: isMobile ? "24px" : "32px",
    fontWeight: 700,
    padding: "0px",
    minHeight: isMobile ? "80px" : "100px",
    minWidth: isMobile ? "140px" : "180px",
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
    letterSpacing: "2px",
    fontFamily: "Anton, sans-serif",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textShadow: `
      0 0 10px #000000,
      0 0 20px #000000,
      2px 2px 4px #000000
    `,
    boxShadow: "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
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
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.6s ease-out, backgroundImpact 0.8s ease-out",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh"
      }}
    >
      {/* Title at the top */}
      <div style={{ 
        textAlign: "center",
        paddingTop: "20px",
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.5s ease-out 0.2s both"
      }}>
        <div className="fight-title">
          FIGHT CLUB
        </div>
      </div>

      {/* Spacer for the middle */}
      <div style={{ flex: 1 }}></div>

      {/* Menu buttons in 2x2 grid at bottom */}
      <Box
        style={{
          width: "100%",
          padding: "0 0 60px",
          animation: "fadeInSpray 0.7s ease-out 0.2s both"
        }}
      >
        <Box
          style={{
            maxWidth: isMobile ? "320px" : "500px",
            width: "100%",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: isMobile ? "16px" : "24px"
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
            RECRUIT
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
        </Box>
      </Box>
    </Box>
  );
};

export default MainMenu; 