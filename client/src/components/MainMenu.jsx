import React from 'react';
import { Button, Box, Text, Stack, Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import '../styles/fightAnimations.css';
import { useCharacterAnimations } from '../contexts/CharacterAnimations';
import { useButtonSound } from '../hooks/useButtonSound';
import mainButtonImg from '../assets/mainbutton.jpeg';

import button2 from '../assets/optimized/button2.webp';
import button3 from '../assets/optimized/button3.webp';

const MainMenu = ({ onStartClick, onFightersClick, onStoreClick, onBackClick }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isExiting } = useCharacterAnimations();
  const { playButtonSound } = useButtonSound();

  const getMenuButtonStyle = (backgroundImage) => ({
            fontSize: isMobile ? "30px" : "40px",
    fontWeight: 700,
    padding: "0px",
    minHeight: "90px",
    minWidth: isMobile ? "140px" : "180px",
    backgroundColor: "transparent",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    border: "2px solid #000000",
    borderRadius: "10px",
    color: "#bbb092",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontFamily: "Anton, sans-serif",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    animation: "none",
    filter: "none",
    opacity: 1,
    transform: "none"
  });

  const handleButtonHover = (e, isEntering) => {
    if (!isMobile) {
      if (isEntering) {
        e.target.style.transform = "scale(1.05) rotate(1deg)";
        e.target.style.animation = "screenShake 0.5s ease-in-out";
      } else {
        e.target.style.transform = "scale(1) rotate(0deg)";
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
        minHeight: "100dvh",
        paddingBottom: "70px"
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
          maxWidth: "400px",
          margin: "0 auto",
          position: "relative",
          animation: "electricFadeIn 0.9s ease-out 0.3s both"
        }}
      >
        <Box
          style={{
            width: "100%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            padding: "0 15px"
          }}
        >
          {/* FIGHT button - Full width */}
          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              playButtonSound();
              onStartClick();
            }}
            style={{
              ...getMenuButtonStyle(button2),
              flex: "1",
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

          {/* PACKS button */}
          <Button
            variant="outline"
            size="xl"
            onClick={() => {
              playButtonSound();
              onStoreClick();
            }}
            style={{
              ...getMenuButtonStyle(button3),
              flex: "1",
              animation: "electricPulse 0.7s ease-out 0.6s both",
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
            PACKS
          </Button>

        </Box>
      </Box>
    </Box>
  );
};

export default MainMenu; 