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
    <>


      {/* CONTADOR DE VICTORIAS - CENTRO SUPERIOR */}
      <Box
        style={{
          position: "absolute",
          top: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1001,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <Text
          style={{
            borderRadius: "0px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            padding: "0",
            fontSize: "55px",
            color: "#F5F5DC",
            textShadow: "rgba(245, 245, 220, 0.3) 0px 0px 2px, rgba(0, 0, 0, 0.8) 1px 1px 2px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontFamily: "Anton, Impact, sans-serif",
          }}
        >
          {player1Wins}
        </Text>
      </Box>

      {/* Player 1 - Esquina superior izquierda */}
      <Box
        style={{
          ...barStyle,
          top: 15,
          left: isMobile ? 20 : 30,
        }}
      >
        {/* Barra de vida */}
        <Box mb={6}>
          <Group position="apart" mb={2} spacing={4}>
            <Group spacing={4} align="center">
              <Text size="xs" color="rgb(245, 245, 220)" weight={700}>HP</Text>
              <Text size="xs" color="rgb(245, 245, 220)" weight={700}>PLAYER 1</Text>
              {player1IsBlocking && (
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
                  <ShieldIcon color="rgb(245, 245, 220)" size={14} />
                </div>
              )}
            </Group>
            <Text size="xs" color="rgb(245, 245, 220)" weight={700}>{player1Health}</Text>
          </Group>
          <Progress
            value={(player1Health / maxHealth) * 100}
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

        {/* Barra de stamina */}
        <Box>
          <Group position="apart" mb={2} spacing={4}>
            <Group spacing={4} align="center">
              <Text size="xs" weight={700} style={{ color: "rgb(245, 245, 220)" }}>SP</Text>
            </Group>
            <Text size="xs" weight={700} style={{ color: "rgb(245, 245, 220)" }}>{Math.round(player1Stamina)}</Text>
          </Group>
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

      {/* Player 2 - Esquina superior derecha */}
      <Box
        style={{
          ...barStyle,
          top: 15,
          right: isMobile ? 20 : 30,
        }}
      >
        {/* Barra de vida */}
        <Box mb={6}>
          <Group position="apart" mb={2} spacing={4}>
            <Text size="xs" weight={700} style={{ color: "#A00000" }}>{player2Health}</Text>
            <Group spacing={4} align="center">
              {player2IsBlocking && (
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '4px' }}>
                  <ShieldIcon color="#A00000" size={14} />
                </div>
              )}
              <Text size="xs" weight={700} style={{ color: "#A00000" }}>PLAYER 2</Text>
              <Text size="xs" weight={700} style={{ color: "#A00000" }}>HP</Text>
            </Group>
          </Group>
          <Progress
            value={(player2Health / maxHealth) * 100}
            size="lg"
            radius="md"
            color="rgb(245, 245, 220)"
            styles={{
              root: {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              },
              bar: {
                background: `linear-gradient(90deg, #A00000 0%, rgba(243, 34, 16, 0.8) 100%)`,
                boxShadow: '0 0 10px rgba(243, 34, 16, 0.5)',
              }
            }}
          />
        </Box>

        {/* Barra de stamina */}
        <Box>
          <Group position="apart" mb={2} spacing={4}>
            <Text size="xs" weight={700} style={{ color: "#A00000" }}>{Math.round(player2Stamina)}</Text>
            <Group spacing={4} align="center">
              <Text size="xs" weight={700} style={{ color: "#A00000" }}>SP</Text>
            </Group>
          </Group>
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
                background: `linear-gradient(90deg, #A00000 0%, rgba(243, 34, 16, 0.8) 100%)`,
                boxShadow: '0 0 10px rgba(243, 34, 16, 0.5)',
              }
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default HealthBars;