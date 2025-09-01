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
            fontSize: isMobile ? "30px" : "40px",
    fontWeight: 700,
    padding: "0px",
    minHeight: isMobile ? "65px" : "80px",
    minWidth: isMobile ? "140px" : "180px",
    backgroundColor: "transparent",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    border: "2px solid #000000",
    borderRadius: "10px",
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
    boxShadow: `
      0 0 20px #f32210,
      0 0 40px rgba(243, 34, 16, 0.3),
      inset 0 0 20px rgba(243, 34, 16, 0.1)
    `,
    transition: "all 0.3s ease",
    cursor: "pointer",
    animation: "none",
    // Reset any residual animation styles
    filter: "none",
    opacity: 1,
    transform: "none"
  });

  const handleButtonHover = (e, isEntering) => {
    if (!isMobile) {
      const neonBoxShadow = `
        0 0 20px #f32210,
        0 0 40px rgba(243, 34, 16, 0.3),
        inset 0 0 20px rgba(243, 34, 16, 0.1)
      `;
      
      if (isEntering) {
        e.target.style.transform = "scale(1.05) rotate(1deg)";
        e.target.style.boxShadow = `
          0 0 30px #f32210,
          0 0 60px rgba(243, 34, 16, 0.5),
          inset 0 0 30px rgba(243, 34, 16, 0.2)
        `;
        e.target.style.animation = "screenShake 0.5s ease-in-out";
      } else {
        e.target.style.transform = "scale(1) rotate(0deg)";
        e.target.style.boxShadow = neonBoxShadow;
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
        paddingTop: "25px",
        animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "electricTitle 0.8s ease-out 0.1s both"
      }}>
        <div 
          className="fight-title"
          onClick={() => {
            playButtonSound();
            onBackClick();
          }}
          style={{
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '60px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.opacity = "1";
          }}
        >
          FIGHT CLUB
        </div>
      </div>

      {/* Spacer for the middle */}
      <div style={{ flex: 1 }}></div>

      {/* Menu buttons in 2x2 grid at bottom */}
      <Box
        style={{
          width: "100%",
          padding: "60px 0 90px",
          animation: "electricFadeIn 0.9s ease-out 0.3s both"
        }}
      >
        <Box
          style={{
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "16px" : "24px",
            padding: "0 15px"
          }}
        >
          {/* CLUB and SHOP buttons - Row */}
          <Box
            style={{
              display: "flex",
              gap: isMobile ? "16px" : "24px",
              width: "100%"
            }}
          >
            <Button
              variant="outline"
              size="xl"
              onClick={() => {
                playButtonSound();
                onFightersClick();
              }}
                          style={{
              ...getMenuButtonStyle(button2),
              flex: 1,
              animation: "electricGlitch 0.7s ease-out 0.5s both",
              boxShadow: "none"
            }}
              onMouseEnter={(e) => {
                if (!isMobile) {
                  e.target.style.transform = "scale(1.05) rotate(1deg)";
                  e.target.style.boxShadow = "none";
                  e.target.style.animation = "screenShake 0.5s ease-in-out";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile) {
                  e.target.style.transform = "scale(1) rotate(0deg)";
                  e.target.style.boxShadow = "none";
                  e.target.style.animation = "none";
                }
              }}
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
                          style={{
              ...getMenuButtonStyle(button3),
              flex: 1,
              animation: "electricPulse 0.7s ease-out 0.6s both"
            }}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              SHOP
            </Button>
          </Box>

          {/* FIGHT button - Full width */}
          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              playButtonSound();
              onStartClick();
            }}
            style={{
              ...getMenuButtonStyle(mainButtonImg),
              width: "100%",
              minWidth: "100%",
              animation: "electricEntry 0.8s ease-out 0.8s both",
              boxShadow: "none"
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.target.style.transform = "scale(1.05) rotate(1deg)";
                e.target.style.boxShadow = "none";
                e.target.style.animation = "screenShake 0.5s ease-in-out";
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.target.style.transform = "scale(1) rotate(0deg)";
                e.target.style.boxShadow = "none";
                e.target.style.animation = "none";
              }
            }}
          >
            FIGHT
          </Button>

        </Box>
      </Box>
    </Box>
  );
};

export default MainMenu; 