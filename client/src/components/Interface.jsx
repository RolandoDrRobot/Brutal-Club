import { Affix, Button, Group, Switch, Text, Stack, Box } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import MusicPlayer from "./MusicPlayer";
import MainMenu from "./MainMenu";
import CharacterSelect from "./CharacterSelect";
import punchImg from "../assets/punch.png";
import kickImg from "../assets/kick.png";
import comboImg from "../assets/combo.png";
import coverImg from "../assets/cover.png";
import resetImg from "../assets/reset.png";
import danceImg from "../assets/dance.png";
import fightImg from "../assets/fight.png";

// CSS Animations for the interface
const interfaceStyles = `
  @keyframes pulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 1;
    }
    50% { 
      transform: scale(1.05);
      opacity: 0.8;
    }
  }
  
  @keyframes neonPulse {
    0%, 100% {
      box-shadow: 
        0 0 15px #fc3f31,
        0 0 30px rgba(252, 63, 49, 0.5),
        0 4px 12px rgba(252, 63, 49, 0.3),
        inset 0 0 15px rgba(252, 63, 49, 0.1);
    }
    50% {
      box-shadow: 
        0 0 25px #fc3f31,
        0 0 50px rgba(252, 63, 49, 0.8),
        0 4px 20px rgba(252, 63, 49, 0.6),
        inset 0 0 25px rgba(252, 63, 49, 0.2);
    }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes fightTransition {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    30% {
      transform: scale(1.02);
      filter: brightness(1.2) contrast(1.3);
    }
    60% {
      transform: scale(0.98);
      filter: brightness(0.8) contrast(1.1);
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }
  
  @keyframes impactShake {
    0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
    10% { transform: translateX(-3px) translateY(-2px) rotate(0.5deg); }
    20% { transform: translateX(3px) translateY(2px) rotate(-0.5deg); }
    30% { transform: translateX(-2px) translateY(-1px) rotate(0.3deg); }
    40% { transform: translateX(2px) translateY(1px) rotate(-0.3deg); }
    50% { transform: translateX(-1px) translateY(-0.5px) rotate(0.1deg); }
    60% { transform: translateX(1px) translateY(0.5px) rotate(-0.1deg); }
    70% { transform: translateX(0) translateY(0) rotate(0deg); }
  }
  
  @keyframes buttonPowerUp {
    0% {
      transform: scale(1);
      box-shadow: 
        0 0 20px #fc3f31,
        0 0 40px rgba(252, 63, 49, 0.3),
        inset 0 0 20px rgba(252, 63, 49, 0.1);
    }
    50% {
      transform: scale(1.08);
      box-shadow: 
        0 0 40px #fc3f31,
        0 0 80px rgba(252, 63, 49, 0.8),
        0 0 120px rgba(252, 63, 49, 0.4),
        inset 0 0 40px rgba(252, 63, 49, 0.3);
    }
    100% {
      transform: scale(1.05);
      box-shadow: 
        0 0 30px #fc3f31,
        0 0 60px rgba(252, 63, 49, 0.6),
        0 0 90px rgba(252, 63, 49, 0.3),
        inset 0 0 30px rgba(252, 63, 49, 0.2);
    }
  }
`;

const Interface = () => {
  const { 
    animations, 
    animationIndex, 
    setAnimationIndex,
    currentScreen,
    navigateToMenu,
    navigateToCombat,
    navigateBackToDance,
    navigateBackToMenu,
    navigateToCharacterSelect,
    navigateBackFromCharacterSelect,
    handleCharacterSelection,
    selectedPlayer1Character,
    selectedPlayer2Character,
    isCombatMode,
    setIsCombatMode,
    triggerPlayer1Attack,
    triggerPlayer2Attack,
    triggerSyncAnimation,
    initializeCombat,
    resetHealth,
    reviveLosingPlayer,
    player1Health,
    player2Health,
    player1Stamina,
    player2Stamina,
    maxStamina,
    player1IsDead,
    player2IsDead,
    player1IsBlocking,
    player2IsBlocking,
    togglePlayer1Block,
    togglePlayer2Block,
    staminaCosts,
    player1CombatState,
    player2CombatState,
    canPlayerAttack,
    COMBAT_STATES,
    ATTACK_TIMINGS
  } = useCharacterAnimations();

  // Media queries para responsive design
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Estado para mostrar/ocultar el reproductor de música
  const [showMusicPlayer, setShowMusicPlayer] = React.useState(false);
  
  // Estado para manejar la transición de pelea
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Botones de ataque para modo combate - usando las animaciones reales de Pete
  const attackButtons = [
    { name: "punch", label: "Puñetazo", image: punchImg, shortcut: "Q" },
    { name: "kick", label: "Patada", image: kickImg, shortcut: "W" },
    { name: "punches", label: "Combo", image: comboImg, shortcut: "E" }
  ];

  // Animaciones de baile - solo estas en modo sincronizado
  const danceAnimations = [
    "dance1", 
    "dance2",
    "dance3",
    "dance4",
    "dance5",
    "dance6"
  ];

  // Combinaciones de bailes predefinidas
  const danceCombinations = [
    { name: "COMBO 1", dances: ["dance1", "dance3", "dance5"] },
    { name: "COMBO 2", dances: ["dance2", "dance4", "dance6"] },
    { name: "COMBO 3", dances: ["dance1", "dance2", "dance3"] },
    { name: "COMBO 4", dances: ["dance4", "dance5", "dance6"] },
    { name: "COMBO 5", dances: ["dance6", "dance1", "dance4"] },
    { name: "COMBO 6", dances: ["dance3", "dance5", "dance2"] }
  ];

  // Estado para el combo actual y el baile dentro del combo
  const [currentComboIndex, setCurrentComboIndex] = React.useState(0);
  const [currentDanceInCombo, setCurrentDanceInCombo] = React.useState(0);
  const [isPlayingCombo, setIsPlayingCombo] = React.useState(false);

  // Función para alternar entre combinaciones de bailes
  const toggleDanceCombination = () => {
    if (!isPlayingCombo) {
      // Iniciar combo
      setIsPlayingCombo(true);
      setCurrentDanceInCombo(0);
      const currentCombo = danceCombinations[currentComboIndex];
      const firstDance = currentCombo.dances[0];
      const danceIndex = animations.findIndex(anim => anim === firstDance);
      if (danceIndex !== -1) {
        triggerSyncAnimation(danceIndex);
      }
    } else {
      // Continuar con el siguiente baile en el combo o siguiente combo
      const currentCombo = danceCombinations[currentComboIndex];
      const nextDanceIndex = (currentDanceInCombo + 1) % currentCombo.dances.length;
      
      if (nextDanceIndex === 0) {
        // Terminó el combo actual, pasar al siguiente
        const nextComboIndex = (currentComboIndex + 1) % danceCombinations.length;
        setCurrentComboIndex(nextComboIndex);
        setCurrentDanceInCombo(0);
        
        const nextCombo = danceCombinations[nextComboIndex];
        const nextDance = nextCombo.dances[0];
        const danceIndex = animations.findIndex(anim => anim === nextDance);
        if (danceIndex !== -1) {
          triggerSyncAnimation(danceIndex);
        }
      } else {
        // Siguiente baile en el mismo combo
        setCurrentDanceInCombo(nextDanceIndex);
        const nextDance = currentCombo.dances[nextDanceIndex];
        const danceIndex = animations.findIndex(anim => anim === nextDance);
        if (danceIndex !== -1) {
          triggerSyncAnimation(danceIndex);
        }
      }
    }
  };

  // Función para detener el combo (click derecho o botón secundario)
  const stopDanceCombo = () => {
    setIsPlayingCombo(false);
    setAnimationIndex(-1);
    setCurrentComboIndex(0);
    setCurrentDanceInCombo(0);
  };

  // Manejar cambio de modo
  const handleModeChange = (event) => {
    const combatMode = event.currentTarget.checked;
    setIsCombatMode(combatMode);
    
    // Si se activa modo combate, inicializar ambos en idle
    if (combatMode) {
      initializeCombat();
    }
  };

  // Determinar si el combate ha terminado
  const isCombatOver = player1IsDead || player2IsDead;

  // NUEVA: Función para verificar si un ataque está disponible con sistema de turnos
  const canAttack = (player, attackName, playerStamina, isPlayerDead, isPlayerBlocking) => {
    // Verificaciones básicas
    if (isPlayerDead || isPlayerBlocking || isCombatOver) return false;
    
    // Verificar stamina
    const cost = staminaCosts[attackName] || 0;
    if (playerStamina < cost) return false;
    
    // NUEVA LÓGICA: Usar el sistema de turnos realista
    return canPlayerAttack(player);
  };

  // Función para verificar si se puede bloquear
  const canBlock = (playerStamina, isPlayerDead) => {
    return !isPlayerDead && playerStamina > 0;
  };
  
  // CSS para la animación de countdown y efectos del pad de pelea
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes countdown {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }
      
      @keyframes pulse {
        0% {
          opacity: 0.4;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.05);
        }
        100% {
          opacity: 0.4;
          transform: scale(1);
        }
      }
      
      @keyframes glow {
        0% {
          box-shadow: 0 0 5px rgba(4, 203, 238, 0.5);
        }
        50% {
          box-shadow: 0 0 20px rgba(4, 203, 238, 0.8), 0 0 30px rgba(4, 203, 238, 0.6);
        }
        100% {
          box-shadow: 0 0 5px rgba(4, 203, 238, 0.5);
        }
      }
      
      @keyframes neonPulse {
        0% {
          box-shadow: 
            0 0 10px #fc3f31,
            0 0 20px rgba(252, 63, 49, 0.3),
            0 4px 8px rgba(252, 63, 49, 0.2),
            inset 0 0 10px rgba(252, 63, 49, 0.05);
        }
        50% {
          box-shadow: 
            0 0 25px #fc3f31,
            0 0 50px rgba(252, 63, 49, 0.8),
            0 4px 20px rgba(252, 63, 49, 0.5),
            inset 0 0 25px rgba(252, 63, 49, 0.2);
        }
        100% {
          box-shadow: 
            0 0 10px #fc3f31,
            0 0 20px rgba(252, 63, 49, 0.3),
            0 4px 8px rgba(252, 63, 49, 0.2),
            inset 0 0 10px rgba(252, 63, 49, 0.05);
        }
      }
      
      @keyframes redNeonText {
        0% {
          text-shadow: 
            0 0 3px #fc3f31,
            0 0 6px #fc3f31,
            0 0 9px rgba(252, 63, 49, 0.4),
            2px 2px 4px rgba(0,0,0,0.8);
        }
        50% {
          text-shadow: 
            0 0 5px #fc3f31,
            0 0 10px #fc3f31,
            0 0 15px rgba(252, 63, 49, 0.6),
            0 0 20px rgba(252, 63, 49, 0.3),
            2px 2px 4px rgba(0,0,0,0.8);
        }
        100% {
          text-shadow: 
            0 0 3px #fc3f31,
            0 0 6px #fc3f31,
            0 0 9px rgba(252, 63, 49, 0.4),
            2px 2px 4px rgba(0,0,0,0.8);
        }
      }
      
      @keyframes goldNeonText {
        0% {
          text-shadow: 
            0 0 3px #F5F5DC,
            0 0 6px #F5F5DC,
            0 0 9px rgba(245, 245, 220, 0.4),
            1px 1px 2px rgba(0,0,0,0.8);
        }
        50% {
          text-shadow: 
            0 0 5px #F5F5DC,
            0 0 10px #F5F5DC,
            0 0 15px rgba(245, 245, 220, 0.6),
            0 0 20px rgba(245, 245, 220, 0.3),
            1px 1px 2px rgba(0,0,0,0.8);
        }
        100% {
          text-shadow: 
            0 0 3px #F5F5DC,
            0 0 6px #F5F5DC,
            0 0 9px rgba(245, 245, 220, 0.4),
            1px 1px 2px rgba(0,0,0,0.8);
        }
      }
      
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Función mejorada para navegar al menú con efecto de impacto
  const handleNavigateToMenu = () => {
    setIsTransitioning(true);
    
    // Crear efecto de sacudida en toda la pantalla
    document.body.style.animation = "impactShake 0.6s ease-out";
    
    // Agregar flash rojo temporal
    const flashOverlay = document.createElement('div');
    flashOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle, rgba(252, 63, 49, 0.3) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      animation: fightTransition 0.8s ease-out;
    `;
    document.body.appendChild(flashOverlay);
    
    // Limpiar efectos y navegar
    setTimeout(() => {
      document.body.style.animation = "";
      document.body.removeChild(flashOverlay);
      setIsTransitioning(false);
      navigateToMenu();
    }, 600);
  };

  return (
    <>
      {/* Inject CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: interfaceStyles }} />

      {/* Reproductor de música - visible en cualquier modo */}
      <MusicPlayer showPlayer={showMusicPlayer} />

      {/* Mostrar componente de menú principal cuando currentScreen es 'menu' */}
      {currentScreen === 'menu' && (
        <MainMenu 
          onStartClick={navigateToCombat}
          onFightersClick={navigateToCharacterSelect}
          onShopClick={() => console.log("SHOP menu clicked")}
          onBackClick={navigateBackToDance}
        />
      )}

      {/* Mostrar pantalla de selección de personajes cuando currentScreen es 'characterSelect' */}
      {currentScreen === 'characterSelect' && (
        <CharacterSelect 
          onSelectClick={handleCharacterSelection}
          onBackClick={navigateBackFromCharacterSelect}
        />
      )}

      {/* Pantalla de baile - currentScreen 'dance' */}
      {currentScreen === 'dance' && (
        <>
          {/* Título Fight Club - ARRIBA CENTRO */}
          <Affix position={{ 
            top: isMobile ? 40 : 50, 
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ 
                color: "#fc3f31",
                textTransform: "uppercase",
                letterSpacing: "2px",
                fontFamily: "Anton, sans-serif",
                fontSize: "50px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
              }}>
                {"FIGHT CLUB".split("").map((letter, index) => (
                  <span 
                    key={index}
                    style={{
                      display: "inline-block",
                      margin: letter === " " ? "0 8px" : "0"
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </div>
              
              {/* Subtítulo con la primera regla */}
              <div style={{
                color: "#F5F5DC",
                fontFamily: "Anton, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                marginTop: "8px",
                letterSpacing: "1px",
                textShadow: `
                  0 0 2px #F5F5DC,
                  0 0 4px rgba(245, 245, 220, 0.6),
                  1px 1px 2px rgba(0,0,0,0.8)
                `
              }}>
                You do not talk about fight club
              </div>
            </div>
          </Affix>

          {/* Botón para ir al menú principal - ABAJO CENTRO */}
          <Affix position={{ 
            bottom: isMobile ? 30 : 40,
            left: "50%",
            transform: "translateX(-50%)"
          }}>
            <Button
              variant="outline"
              size="xl"
              onClick={handleNavigateToMenu}
              disabled={isTransitioning}
              style={{
                fontSize: isMobile ? "36px" : "48px",
                fontWeight: 700,
                padding: isMobile ? "15px 40px" : "20px 60px",
                minHeight: isMobile ? "80px" : "100px",
                minWidth: isMobile ? "280px" : "350px",
                maxWidth: isMobile ? "calc(100vw - 40px)" : "350px",
                margin: isMobile ? "0 20px" : "0",
                backgroundColor: isTransitioning ? "rgba(252, 63, 49, 0.2)" : "transparent",
                borderColor: "#fc3f31",
                border: "4px solid #fc3f31",
                borderRadius: "15px",
                color: "#fc3f31",
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontFamily: "Anton, sans-serif",
                boxShadow: isTransitioning ? `
                  0 0 40px #fc3f31,
                  0 0 80px rgba(252, 63, 49, 0.8),
                  0 0 120px rgba(252, 63, 49, 0.4),
                  inset 0 0 40px rgba(252, 63, 49, 0.3)
                ` : `
                  0 0 20px #fc3f31,
                  0 0 40px rgba(252, 63, 49, 0.3),
                  inset 0 0 20px rgba(252, 63, 49, 0.1)
                `,
                transition: "all 0.3s ease",
                cursor: isTransitioning ? "not-allowed" : "pointer",
                animation: isTransitioning ? "buttonPowerUp 0.6s ease-out" : "none",
                opacity: isTransitioning ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!isMobile && !isTransitioning) {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.backgroundColor = "rgba(252, 63, 49, 0.1)";
                  e.target.style.animation = "impactShake 0.3s ease-out";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile && !isTransitioning) {
                  e.target.style.transform = "scale(1)";
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.animation = "none";
                }
              }}
            >
              {isTransitioning ? "ENTERING..." : "ENTER FIGHT CLUB"}
            </Button>
          </Affix>
        </>
      )}

      {/* Modo de combate - currentScreen 'combat' */}
      {currentScreen === 'combat' && isCombatMode && (
        <>
          {/* Mensaje de Victoria - Overlay cuando termina el combate */}
          {isCombatOver && (
            <Affix position={{ 
              top: "75%", 
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}>
              <Box style={{
                backgroundColor: "transparent",
                padding: isMobile ? "30px 60px" : "50px 80px",
                borderRadius: "20px",
                border: "none",
                boxShadow: "none",
                textAlign: "center",
                width: isMobile ? "90vw" : "400px",
                maxWidth: isMobile ? "90vw" : "400px"
              }}>
                <Stack spacing="lg" align="center">
                  <Text size={isMobile ? "xl" : "2xl"} weight={700} style={{ 
                    color: player1IsDead ? "#fc3f31" : "#F5F5DC"
                  }}>
                    🏆 {player1IsDead ? "PLAYER 2 WINS!" : "PLAYER 1 WINS!"} 🏆
                  </Text>
                  
                  {/* Botones de acción */}
                  <Group spacing="xs" position="center" style={{ width: "100%" }}>
                    {/* Botón Modo Baile */}
                    <img 
                      src={danceImg}
                      alt="Dance"
                      onClick={navigateBackToMenu}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        cursor: "pointer",
                        flex: 1
                      }}
                    />

                    {/* Botón Volver a Pelear */}
                    <img 
                      src={fightImg}
                      alt="Fight"
                      onClick={() => {
                        resetHealth();
                        initializeCombat();
                      }}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        cursor: "pointer",
                        flex: 1
                      }}
                    />
                  </Group>

                </Stack>
              </Box>
            </Affix>
          )}

          {/* Controles de animación de baile - Solo en modo sincronizado - CENTRO ARRIBA */}
          {!isCombatMode && (
            <>
              {/* Título Fight Club - ARRIBA CENTRO */}
              <Affix position={{ 
                top: isMobile ? 40 : 50, 
                left: "50%",
                transform: "translateX(-50%)"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ 
                    color: "#fc3f31",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontFamily: "Anton, sans-serif",
                    fontSize: "50px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)"
                  }}>
                    {"FIGHT CLUB".split("").map((letter, index) => (
                      <span 
                        key={index}
                        style={{
                          display: "inline-block",
                          margin: letter === " " ? "0 8px" : "0"
                        }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    ))}
                  </div>
                  
                  {/* Subtítulo con la primera regla */}
                  <div style={{
                    color: "#F5F5DC",
                    fontFamily: "Anton, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    marginTop: "8px",
                    letterSpacing: "1px",
                    textShadow: `
                      0 0 2px #F5F5DC,
                      0 0 4px rgba(245, 245, 220, 0.6),
                      1px 1px 2px rgba(0,0,0,0.8)
                    `
                  }}>
                    You do not talk about fight club
                  </div>
                </div>
              </Affix>

              {/* MENÚ CENTRAL ESTILO FIGHT CLUB */}
              <Affix position={{ 
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: isMobile ? '20px' : '30px'
                }}>
                  {/* Botón START */}
                  <Button
                    variant="outline"
                    size="xl"
                    onClick={() => {
                      setIsCombatMode(true);
                      initializeCombat();
                    }}
                    style={{
                      fontSize: isMobile ? "36px" : "48px",
                      fontWeight: 700,
                      padding: isMobile ? "15px 40px" : "20px 60px",
                      minHeight: isMobile ? "80px" : "100px",
                      minWidth: isMobile ? "280px" : "350px",
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
                      cursor: "pointer"
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
                    START
                  </Button>

                  {/* Botón FIGHTERS */}
                  <Button
                    variant="outline"
                    size="xl"
                    onClick={() => {
                      // Aquí se podría abrir un menú de selección de personajes
                      console.log("FIGHTERS menu clicked");
                    }}
                    style={{
                      fontSize: isMobile ? "36px" : "48px",
                      fontWeight: 700,
                      padding: isMobile ? "15px 40px" : "20px 60px",
                      minHeight: isMobile ? "80px" : "100px",
                      minWidth: isMobile ? "280px" : "350px",
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
                      cursor: "pointer"
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
                    FIGHTERS
                  </Button>

                  {/* Botón SHOP */}
                  <Button
                    variant="outline"
                    size="xl"
                    onClick={() => {
                      // Aquí se podría abrir una tienda
                      console.log("SHOP menu clicked");
                    }}
                    style={{
                      fontSize: isMobile ? "36px" : "48px",
                      fontWeight: 700,
                      padding: isMobile ? "15px 40px" : "20px 60px",
                      minHeight: isMobile ? "80px" : "100px",
                      minWidth: isMobile ? "280px" : "350px",
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
                      cursor: "pointer"
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
                    SHOP
                  </Button>
                </div>
              </Affix>

              {/* Botón de Música - ESQUINA INFERIOR IZQUIERDA */}
              <Affix position={{ 
                bottom: isMobile ? 30 : 40, 
                left: isMobile ? 30 : 40 
              }}>
                {/* Icono de música */}
                <Button
                  variant="unstyled"
                  onClick={() => {
                    setShowMusicPlayer(!showMusicPlayer);
                    console.log("Music player toggle");
                  }}
                  style={{
                    width: isMobile ? "80px" : "100px",
                    height: isMobile ? "80px" : "100px",
                    borderRadius: "50%",
                    backgroundColor: showMusicPlayer ? "rgba(252, 63, 49, 0.4)" : "rgba(252, 63, 49, 0.2)",
                    border: "3px solid #fc3f31",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: "all 0.3s ease",
                    boxShadow: `
                      0 0 15px #fc3f31,
                      0 0 25px rgba(252, 63, 49, 0.3)
                    `
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = "scale(1.1)";
                      e.target.style.backgroundColor = "rgba(252, 63, 49, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = "scale(1)";
                      e.target.style.backgroundColor = showMusicPlayer ? "rgba(252, 63, 49, 0.4)" : "rgba(252, 63, 49, 0.2)";
                    }
                  }}
                >
                  <div style={{
                    fontSize: isMobile ? "32px" : "40px",
                    color: "#fc3f31"
                  }}>
                    🎵
                  </div>
                </Button>
              </Affix>

              {/* Botón de Baile - ESQUINA INFERIOR DERECHA */}
              <Affix position={{ 
                bottom: isMobile ? 30 : 40, 
                right: isMobile ? 30 : 40 
              }}>
                {/* Icono de baile */}
                <Button
                  variant="unstyled"
                  onClick={toggleDanceCombination}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    stopDanceCombo();
                  }}
                  style={{
                    width: isMobile ? "80px" : "100px",
                    height: isMobile ? "80px" : "100px",
                    borderRadius: "50%",
                    backgroundColor: isPlayingCombo ? "rgba(252, 63, 49, 0.4)" : "rgba(252, 63, 49, 0.2)",
                    border: "3px solid #fc3f31",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: "all 0.3s ease",
                    boxShadow: `
                      0 0 15px #fc3f31,
                      0 0 25px rgba(252, 63, 49, 0.3)
                    `,
                    animation: isPlayingCombo ? "pulse 1s ease-in-out infinite" : "none"
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = "scale(1.1)";
                      e.target.style.backgroundColor = "rgba(252, 63, 49, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = "scale(1)";
                      e.target.style.backgroundColor = isPlayingCombo ? "rgba(252, 63, 49, 0.4)" : "rgba(252, 63, 49, 0.2)";
                    }
                  }}
                >
                  <img 
                    src={danceImg}
                    alt="Dance"
                    style={{
                      width: isMobile ? "40px" : "50px",
                      height: isMobile ? "40px" : "50px",
                      objectFit: "contain",
                      pointerEvents: "none",
                      filter: "brightness(0) saturate(100%) invert(23%) sepia(89%) saturate(2700%) hue-rotate(355deg) brightness(102%) contrast(93%)"
                    }}
                  />
                </Button>
              </Affix>

              {/* Información del combo actual (solo si está reproduciéndose) */}
              {isPlayingCombo && (
                <Affix position={{ 
                  bottom: isMobile ? 120 : 140, 
                  right: isMobile ? 30 : 40 
                }}>
                  <div style={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "2px solid #fc3f31",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    color: "#fc3f31",
                    fontSize: "12px",
                    fontFamily: "Anton, sans-serif",
                    textAlign: "center",
                    boxShadow: "0 0 10px rgba(252, 63, 49, 0.5)"
                  }}>
                    <div>{danceCombinations[currentComboIndex].name}</div>
                    <div style={{ fontSize: "10px", opacity: 0.8 }}>
                      {currentDanceInCombo + 1}/{danceCombinations[currentComboIndex].dances.length}
                    </div>
                  </div>
                </Affix>
              )}
            </>
          )}

          {/* Controles de combate - PAD DE PELEA MEJORADO */}
          {isCombatMode && !isCombatOver && (
            <>
              {/* PAD DE PELEA PRINCIPAL - Diseño Arcade Profesional */}
              <Affix position={{ 
                bottom: isMobile ? 10 : 30, 
                left: "50%",
                transform: "translateX(-50%)"
              }}>
                <Box style={{ 
                  textAlign: "center",
                  backgroundColor: "transparent",
                  borderRadius: isMobile ? "15px" : "20px",
                  padding: isMobile ? "15px" : "30px",
                  border: "none",
                  boxShadow: "none",
                  backdropFilter: "blur(10px)",
                  maxWidth: isMobile ? "95vw" : "auto",
                  width: isMobile ? "95vw" : "auto"
                }}>
                  <Stack spacing={isMobile ? "md" : "lg"} align="center">
                    {/* Fila de Botones de Ataque - Optimizado para móvil */}
                    <Group spacing={isMobile ? "xs" : "xl"} position="center" style={{
                      width: "100%",
                      justifyContent: "space-around"
                    }}>
                      {attackButtons.map((attack, index) => {
                        const canUseAttack = canAttack(player1CombatState, attack.name, player1Stamina, player1IsDead, player1IsBlocking);
                        const staminaCost = staminaCosts[attack.name] || 0;
                        
                        return (
                          <Box
                            key={`p1-${attack.name}`}
                            style={{
                              position: "relative",
                              transform: canUseAttack ? "scale(1)" : "scale(0.95)",
                              transition: "all 0.2s ease",
                              flex: isMobile ? "1" : "none"
                            }}
                          >
                            <Button
                              variant="outline"
                              size={isMobile ? "md" : "xl"}
                              disabled={!canUseAttack}
                              onClick={() => triggerPlayer1Attack(attack.name)}
                              style={{
                                position: "relative",
                                zIndex: 1,
                                padding: "0",
                                minHeight: "120px",
                                minWidth: "100px",
                                backgroundColor: "transparent",
                                border: "none",
                                borderRadius: "4px",
                                cursor: canUseAttack ? "pointer" : "not-allowed",
                                opacity: canUseAttack ? 1 : 0.5,
                                transition: "all 0.2s ease",
                                overflow: "hidden",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "none"
                              }}
                              onTouchStart={(e) => {
                                if (canUseAttack && isMobile) {
                                  e.target.style.transform = "scale(0.95)";
                                }
                              }}
                              onTouchEnd={(e) => {
                                if (canUseAttack && isMobile) {
                                  e.target.style.transform = "scale(1)";
                                }
                              }}
                              onMouseEnter={(e) => {
                                if (canUseAttack && !isMobile) {
                                  e.target.style.transform = "scale(1.05)";
                                  e.target.style.boxShadow = "none";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (canUseAttack && !isMobile) {
                                  e.target.style.transform = "scale(1)";
                                  e.target.style.boxShadow = "none";
                                }
                              }}
                            >
                              <img 
                                src={attack.image}
                                alt={attack.label}
                                style={{
                                  width: "90%",
                                  height: "90%",
                                  objectFit: "contain",
                                  filter: canUseAttack ? "none" : "grayscale(1)",
                                  pointerEvents: "none",
                                  borderRadius: "4px"
                                }}
                              />
                            </Button>
                          </Box>
                        );
                      })}
                    </Group>
                  </Stack>
                </Box>
              </Affix>

              {/* Botón de Bloqueo - Estilo Arcade Mejorado */}
              <Affix position={{ 
                bottom: isMobile ? 135 : 220, 
                left: isMobile ? 10 : 40
              }}>
                <Box style={{ position: "relative" }}>
                    <Button
                    variant="outline"
                    size={isMobile ? "sm" : "xl"}
                    disabled={!canBlock(player1Stamina, player1IsDead)}
                    onClick={togglePlayer1Block}
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "0",
                      width: isMobile ? "70px" : "120px",
                      height: isMobile ? "60px" : "100px",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: isMobile ? "12px" : "15px",
                      cursor: canBlock(player1Stamina, player1IsDead) ? "pointer" : "not-allowed",
                      opacity: canBlock(player1Stamina, player1IsDead) ? 1 : 0.5,
                      transition: "all 0.2s ease",
                      overflow: "hidden",
                      boxShadow: "none",
                      flexShrink: 0
                    }}
                  >
                    <img 
                      src={coverImg}
                      alt="Block"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: canBlock(player1Stamina, player1IsDead) ? "none" : "grayscale(1)",
                        pointerEvents: "none"
                      }}
                    />
                          </Button>
                </Box>
              </Affix>

              {/* Panel de Control - Derecha */}
              <Affix position={{ 
                bottom: isMobile ? 145 : 220, 
                right: isMobile ? 10 : 40
              }}>
                <Stack spacing={isMobile ? "xs" : "md"} align="center">
                    {/* Estado del combate */}
                    {isCombatOver && (
                    <Text size={isMobile ? "xs" : "md"} color="yellow" weight={700} align="center" style={{
                      textShadow: "0 0 10px yellow",
                      fontSize: isMobile ? "10px" : "16px"
                    }}>
                      {player1IsDead ? "💀" : "🏆"}
                      </Text>
                    )}
                    
                  {/* Botón para revivir solo al jugador perdedor - Solo visible cuando hay un ganador */}
                  {isCombatOver && (
                    <Button
                      variant="outline"
                      size={isMobile ? "xs" : "lg"}
                      onClick={reviveLosingPlayer}
                      style={{ 
                        padding: isMobile ? "4px 8px" : "8px 12px",
                        backgroundColor: "transparent",
                        border: `3px solid #fc3f31`,
                        borderRadius: isMobile ? "10px" : "15px",
                        transition: "all 0.2s ease",
                        minWidth: isMobile ? "60px" : "120px",
                        height: isMobile ? "40px" : "80px",
                        cursor: "pointer",
                        overflow: "hidden",
                        boxShadow: `
                          0 0 10px #fc3f31,
                          0 0 20px rgba(252, 63, 49, 0.4),
                          inset 0 0 10px rgba(252, 63, 49, 0.1)
                        `,
                        fontSize: isMobile ? "8px" : "12px",
                        fontWeight: 700,
                        color: "#fc3f31",
                        textTransform: "uppercase",
                        textShadow: "0 0 5px #fc3f31"
                      }}
                    >
                      {isMobile ? "REVIVE" : "REVIVE LOSER"}
                    </Button>
                  )}
                  </Stack>
              </Affix>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Interface;
