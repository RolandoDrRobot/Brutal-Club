import { Box, Progress, Text, Group } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useState, useEffect } from "react";

const HealthBars = () => {
  const { 
    player1Health, 
    player2Health, 
    maxHealth,
    player1Stamina,
    player2Stamina,
    maxStamina,
    player1IsDead,
    player2IsDead,
    isCombatMode,
    currentScreen,
    player1Wins,
    player1IsBlocking,
    player2IsBlocking
  } = useCharacterAnimations();

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const isCombatOver = player1IsDead || player2IsDead;
  if (!isCombatMode || currentScreen !== 'combat' || isCombatOver) return null;

  const winner = player1IsDead ? "Player 2" : player2IsDead ? "Player 1" : null;

  const barStyle = {
    position: "fixed",
    zIndex: 1000,
    padding: isMobile ? "8px" : "12px",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    border: "none",
    borderRadius: "0px",
    backdropFilter: "blur(4px)",
    width: isMobile ? "160px" : isTablet ? "200px" : "250px",
  };

  const ShieldIcon = ({ color = "rgb(245, 245, 220)", size = 16 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: `drop-shadow(0 0 4px ${color})`,
        animation: "shieldPulse 1.5s ease-in-out infinite alternate"
      }}
    >
      <path
        d="M12 2L4 6V11C4 16.55 7.84 21.74 12 22C16.16 21.74 20 16.55 20 11V6L12 2Z"
        fill={color}
        stroke={color}
        strokeWidth="1"
      />
      <style>
        {`
          @keyframes shieldPulse {
            0% { opacity: 0.7; transform: scale(1); }
            100% { opacity: 1; transform: scale(1.1); }
          }
        `}
      </style>
    </svg>
  );

  return (
    <Box
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 20px",
        pointerEvents: "none"
      }}
    >
      {/* Player 1 - Izquierda */}
      <Box
        style={{
          position: "fixed",
          zIndex: 1000,
          padding: "8px",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "none",
          borderRadius: "0px",
          backdropFilter: "blur(4px)",
          width: "160px",
          top: "15px",
          left: "20px",
        }}
      >
        {/* Barra de vida */}
        <Box mb={6}>
          <Progress
            value={(player1Health / maxHealth) * 100}
            size="xl"
            radius="md"
            color="#e79d01"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(231, 157, 1, 0.3)',
                height: '30px',
              },
              bar: {
                background: `linear-gradient(90deg, #e79d01 0%, #ffd700 50%, #e79d01 100%)`,
                boxShadow: '0 0 15px rgba(231, 157, 1, 0.8)',
              }
            }}
          />
        </Box>

        {/* Barra de stamina */}
        <Box>
          <Progress
            value={(player1Stamina / maxStamina) * 100}
            size="lg"
            radius="md"
            color="rgb(245, 245, 220)"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              },
              bar: {
                background: `linear-gradient(90deg, rgb(245, 245, 220) 0%, rgba(245, 245, 220, 0.8) 100%)`,
                boxShadow: '0 0 10px rgba(245, 245, 220, 0.5)',
              }
            }}
          />
        </Box>
      </Box>

      {/* Player 2 - Derecha */}
      <Box
        style={{
          position: "fixed",
          zIndex: 1000,
          padding: "8px",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          border: "none",
          borderRadius: "0px",
          backdropFilter: "blur(4px)",
          width: "160px",
          top: "15px",
          right: "20px",
        }}
      >
        {/* Barra de vida */}
        <Box mb={6}>
          <Progress
            value={(player2Health / maxHealth) * 100}
            size="xl"
            radius="md"
            color="#e79d01"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(231, 157, 1, 0.3)',
                height: '30px',
              },
              bar: {
                background: `linear-gradient(90deg, #e79d01 0%, #ffd700 50%, #e79d01 100%)`,
                boxShadow: '0 0 15px rgba(231, 157, 1, 0.8)',
              }
            }}
          />
        </Box>

        {/* Barra de stamina */}
        <Box>
          <Progress
            value={(player2Stamina / maxStamina) * 100}
            size="lg"
            radius="md"
            color="rgb(245, 245, 220)"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              },
              bar: {
                background: `linear-gradient(90deg, rgb(160, 0, 0) 0%, rgba(243, 34, 16, 0.8) 100%)`,
                boxShadow: '0 0 10px rgba(243, 34, 16, 0.5)',
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HealthBars;