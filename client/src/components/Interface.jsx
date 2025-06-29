import { Affix, Button, Group, Switch, Text, Stack, Box } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";
import React, { useState, useEffect } from 'react';
import MusicPlayer from "./MusicPlayer";
import MainMenu from "./MainMenu";
import CharacterSelect from "./CharacterSelect";
import CombinedShopOpponents from "./CombinedShopOpponents";
import '../styles/fightAnimations.css';
import punchImg from "../assets/punch.png";
import kickImg from "../assets/kick.png";
import comboImg from "../assets/combo.png";
import coverImg from "../assets/cover.png";
import resetImg from "../assets/reset.png";
import danceImg from "../assets/dance.png";
import fightImg from "../assets/fight.png";
import mainButtonImg from "../assets/mainbutton.jpeg";
import { useButtonSound } from '../hooks/useButtonSound';
import LoadingScreen from './LoadingScreen';
import { useModelLoader } from '../hooks/useModelLoader';
import { useGameState } from '../contexts/GameState';
import CharacterPreview from "./CharacterPreview";

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
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px) rotate(1deg); }
    75% { transform: translateX(3px) rotate(-1deg); }
  }
  
  @keyframes buttonPowerUp {
    0% {
      transform: scale(1);
      box-shadow: 0 0 10px rgba(252, 63, 49, 0.3);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 0 30px rgba(252, 63, 49, 0.8);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 10px rgba(252, 63, 49, 0.3);
    }
  }
`;

const Interface = () => {
  const { 
    animations, 
    animationIndex, 
    setAnimationIndex,
    currentScreen,
    isExiting,
    navigateToMenu,
    navigateToCombat,
    navigateBackToDance,
    navigateBackToMenu,
    navigateToCharacterSelect,
    navigateBackFromCharacterSelect,
    handleCharacterSelection,
    navigateToOpponentSelect,
    navigateBackFromOpponentSelect,
    handleOpponentChallenge,
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

  const { playButtonSound } = useButtonSound();

  // Media queries para responsive design
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // State to show/hide the music player
  const [showMusicPlayer, setShowMusicPlayer] = useState(true);
  
  // State to handle fight transition
  const [fightTransition, setFightTransition] = useState(false);

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

  // Function to toggle between dance combinations
  const toggleDanceCombo = () => {
    if (isCombatMode) return; // No dance combos in combat mode
    
    if (currentComboIndex < danceCombinations.length - 1) {
      setCurrentComboIndex(currentComboIndex + 1);
    } else {
      // Finished current combo, move to next
      setCurrentComboIndex(0);
      if (currentDanceInCombo < danceCombinations[currentComboIndex].dances.length - 1) {
        setCurrentDanceInCombo(currentDanceInCombo + 1);
      } else {
        setCurrentDanceInCombo(0);
      }
    }
  };

  // Function to stop combo (right click or secondary button)
  const stopCombo = () => {
    if (isCombatMode) return;
    
    setCurrentComboIndex(0);
    setCurrentDanceInCombo(0);
    setAnimationIndex(-1);
    
    const idleIndex = animations.findIndex(anim => 
      anim.toLowerCase().includes('idle') && 
      !anim.toLowerCase().includes('fight')
    );
    
    if (idleIndex >= 0) {
      triggerSyncAnimation(idleIndex);
    }
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

  // NEW: Function to check if an attack is available with turn system
  const isAttackAvailable = (attackType) => {
    // Basic checks
    if (!isCombatMode || player1IsDead || player2IsDead) {
      return false;
    }
    
    // NEW LOGIC: Use the realistic turn system
    return canPlayerAttack(1);
  };

  // Function to check if blocking is possible
  const isBlockAvailable = () => {
    return isCombatMode && !player1IsDead && !player2IsDead && player1Stamina > 0;
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
    setFightTransition(true);
    
    // Crear efecto de sacudida en toda la pantalla
    document.body.style.animation = "impactShake 0.6s ease-out";
    
    // Agregar flash rojo temporal
    const flashOverlay = document.createElement('div');
    flashOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100dvh;
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
      setFightTransition(false);
      navigateToMenu();
    }, 600);
  };

  // Import the optimized model loader
  const { isLoading, loadingProgress, loadingStatus, isPlayable, lazyLoadModel } = useModelLoader();

  // Function to handle skip to play
  const handleSkipToPlay = () => {
    console.log('🎮 User chose to skip to play - starting game early');
    // Force end loading screen
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <LoadingScreen 
        progress={loadingProgress} 
        status={loadingStatus}
        isPlayable={isPlayable}
        onSkipToPlay={handleSkipToPlay}
      />
    );
  }

  return (
    <>
      {/* Inject CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: interfaceStyles }} />

      {/* Music player - visible in any mode */}
      {showMusicPlayer && <MusicPlayer />}

      {/* Mostrar componente de menú principal cuando currentScreen es 'menu' */}
      {currentScreen === 'menu' && (
        <MainMenu 
          onStartClick={navigateToOpponentSelect}
          onFightersClick={navigateToCharacterSelect}
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

      {/* Mostrar pantalla combinada de oponentes y tienda cuando currentScreen es 'opponentSelect' */}
      {currentScreen === 'opponentSelect' && (
        <CombinedShopOpponents 
          onChallengeClick={handleOpponentChallenge}
          onBackClick={navigateBackFromOpponentSelect}
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
            <div style={{ 
              textAlign: "center",
              animation: isExiting ? "fadeOutSpray 0.4s ease-out" : "fadeInSpray 0.5s ease-out 0.2s both"
            }}>
              <div className="fight-title">
                FIGHT CLUB
              </div>
              
              {/* Subtítulo con la primera regla */}
              <div className="fight-subtitle">
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
              onClick={() => {
                playButtonSound();
                handleNavigateToMenu();
              }}
              disabled={fightTransition}
              style={{
                fontSize: isMobile ? "24px" : "32px",
                fontWeight: 700,
                padding: isMobile ? "15px 40px" : "20px 60px",
                minHeight: isMobile ? "80px" : "100px",
                minWidth: isMobile ? "280px" : "350px",
                maxWidth: isMobile ? "calc(100vw - 40px)" : "350px",
                margin: isMobile ? "0 20px" : "0",
                backgroundColor: fightTransition ? "rgba(252, 63, 49, 0.2)" : "transparent",
                backgroundImage: `url(${mainButtonImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
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
                boxShadow: fightTransition ? `
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
                cursor: fightTransition ? "not-allowed" : "pointer",
                animation: isExiting ? "fadeOutSpray 0.4s ease-out" : (fightTransition ? "buttonPowerUp 0.6s ease-out" : "fadeInSpray 0.5s ease-out 0.4s both"),
                opacity: fightTransition ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!isMobile && !fightTransition) {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.backgroundColor = "rgba(252, 63, 49, 0.1)";
                  e.target.style.animation = "impactShake 0.3s ease-out";
                }
              }}
              onMouseLeave={(e) => {
                if (!isMobile && !fightTransition) {
                  e.target.style.transform = "scale(1)";
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.animation = "none";
                }
              }}
            >
              <span className="fight-button-text">
                {fightTransition ? "ENTERING..." : "ENTER FIGHT CLUB"}
              </span>
            </Button>
          </Affix>
        </>
      )}

      {/* Modo de combate - currentScreen 'combat' */}
      {currentScreen === 'combat' && (
        <>
          {/* Victory Screen - Full Screen Overlay */}
          {isCombatOver && (
            <div 
              className="fight-screen-background"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                animation: 'fadeInSpray 1s ease-out',
                backdropFilter: 'blur(2px)',
                padding: isMobile ? '10px' : '20px',
                boxSizing: 'border-box'
              }}>
              
              {/* 3D Model of winning character - Large background */}
              <CharacterPreview
                characterName={(() => {
                  const winnerCharacter = player1IsDead ? selectedPlayer2Character?.name || selectedPlayer2Character : selectedPlayer1Character?.name || selectedPlayer1Character;
                  console.log('🏆 Victory Screen Debug:');
                  console.log('- player1IsDead:', player1IsDead);
                  console.log('- selectedPlayer1Character:', selectedPlayer1Character);
                  console.log('- selectedPlayer2Character:', selectedPlayer2Character);
                  console.log('- Winner character to display:', winnerCharacter);
                  return winnerCharacter;
                })()}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: isMobile ? '120vw' : '80vw',
                  height: isMobile ? '120vh' : '100vh',
                  zIndex: 1,
                  opacity: 1,
                  pointerEvents: 'none'
                }}
              />
              
              {/* Winner Title */}
              <div style={{
                fontSize: isMobile ? '32px' : '72px',
                fontWeight: 900,
                color: '#fc3f31',
                fontFamily: 'Anton, sans-serif',
                letterSpacing: isMobile ? '4px' : '8px',
                textAlign: 'center',
                marginBottom: isMobile ? '10px' : '40px',
                textShadow: '4px 4px 8px rgba(0, 0, 0, 0.9)',
                textTransform: 'uppercase',
                lineHeight: isMobile ? '1.1' : '1.2',
                zIndex: 10,
                position: 'relative'
              }}>
                {player1IsDead ? "PLAYER 2 WINS!" : "PLAYER 1 WINS!"}
              </div>

              {/* Coins Reward - Only show for Player 1 victory */}
              {!player1IsDead && (
                <div style={{
                  backgroundColor: 'rgba(252, 63, 49, 0.2)',
                  border: '2px solid #fc3f31',
                  borderRadius: '15px',
                  padding: isMobile ? '10px 20px' : '20px 40px',
                  marginBottom: isMobile ? '15px' : '40px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '8px' : '15px',
                  boxShadow: `
                    0 0 20px rgba(252, 63, 49, 0.4),
                    inset 0 0 20px rgba(252, 63, 49, 0.1)
                  `,
                  animation: 'neonPulse 2s ease-in-out infinite',
                  zIndex: 10,
                  position: 'relative'
                }}>
                  {/* Coin Icon */}
                  <div style={{
                    width: isMobile ? '30px' : '60px',
                    height: isMobile ? '30px' : '60px',
                    backgroundColor: '#FFD700',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? '16px' : '30px',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
                    animation: 'rotate 3s linear infinite'
                  }}>
                    ⭐
                  </div>
                  
                  {/* Coins Text */}
                  <div style={{
                    fontSize: isMobile ? '20px' : '36px',
                    fontWeight: 900,
                    color: '#FFD700',
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '2px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                  }}>
                    +200
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: isMobile ? '15px' : '40px',
                marginTop: isMobile ? '10px' : '30px',
                width: '100%',
                justifyContent: 'center',
                flexWrap: 'wrap',
                zIndex: 10,
                position: 'relative'
              }}>
                {/* REMATCH Button */}
                <button
                  onClick={() => {
                    playButtonSound();
                    resetHealth();
                    initializeCombat();
                  }}
                  style={{
                    fontSize: isMobile ? '16px' : '24px',
                    fontWeight: 700,
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#fc3f31',
                    backgroundColor: 'transparent',
                    backgroundImage: `url(${mainButtonImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    border: '3px solid #fc3f31',
                    borderRadius: '15px',
                    padding: isMobile ? '12px 24px' : '20px 40px',
                    minWidth: isMobile ? '110px' : '160px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.backgroundColor = 'rgba(252, 63, 49, 0.2)';
                      e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                >
                  REMATCH
                </button>

                {/* MENU Button */}
                <button
                  onClick={() => {
                    console.log('🎮 MENU button clicked - navigating to main menu');
                    playButtonSound();
                    navigateToMenu();
                  }}
                  style={{
                    fontSize: isMobile ? '16px' : '24px',
                    fontWeight: 700,
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#fc3f31',
                    backgroundColor: 'transparent',
                    backgroundImage: `url(${mainButtonImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    border: '3px solid #fc3f31',
                    borderRadius: '15px',
                    padding: isMobile ? '12px 24px' : '20px 40px',
                    minWidth: isMobile ? '110px' : '160px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.backgroundColor = 'rgba(252, 63, 49, 0.2)';
                      e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                    }
                  }}
                >
                  MENU
                </button>
              </div>
            </div>
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
                  <div className="fight-title">
                    FIGHT CLUB
                  </div>
                  
                  {/* Subtítulo con la primera regla */}
                  <div className="fight-subtitle">
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
                      playButtonSound();
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
                      playButtonSound();
                      // Aquí se podría abrir un menú de selección de personajes
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
                </div>
              </Affix>

              {/* Music Button - BOTTOM LEFT CORNER */}
              <Button
                variant="unstyled"
                size="xs"
                onClick={() => setShowMusicPlayer(!showMusicPlayer)}
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  zIndex: 200,
                  backgroundColor: 'transparent',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  padding: '0',
                  minWidth: 'unset',
                  cursor: 'pointer'
                }}
              >
                {/* Music icon */}
              </Button>

              {/* Botón de Baile - ESQUINA INFERIOR DERECHA */}
              <Affix position={{ 
                bottom: isMobile ? 30 : 40, 
                right: isMobile ? 30 : 40 
              }}>
                {/* Icono de baile */}
                <Button
                  variant="unstyled"
                  onClick={() => {
                    playButtonSound();
                    toggleDanceCombo();
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    stopCombo();
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
                bottom: isMobile ? 5 : 15, 
                left: "50%",
                transform: "translateX(-50%)"
              }}>
                <Box style={{ 
                  textAlign: "center",
                  backgroundColor: "transparent",
                  borderRadius: isMobile ? "15px" : "20px",
                  padding: isMobile ? "10px" : "20px",
                  border: "none",
                  boxShadow: "none",
                  backdropFilter: "blur(10px)",
                  maxWidth: isMobile ? "100vw" : "auto",
                  width: isMobile ? "100vw" : "auto"
                }}>
                  {/* Fila de Botones de Ataque - Optimizado para fila inferior */}
                  <Group spacing={isMobile ? "lg" : "xl"} position="center" style={{
                    width: "100%",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "row"
                  }}>
                    {attackButtons.map((attack, index) => {
                      const canUseAttack = isAttackAvailable(attack.name);
                      const staminaCost = staminaCosts[attack.name] || 0;
                      
                      return (
                        <Box
                          key={`p1-${attack.name}`}
                          style={{
                            position: "relative",
                            transform: canUseAttack ? "scale(1)" : "scale(0.95)",
                            transition: "all 0.2s ease",
                            flex: isMobile ? "1" : "0 0 auto",
                            maxWidth: isMobile ? "30%" : "140px",
                            display: "flex",
                            justifyContent: "center"
                          }}
                        >
                          <Button
                            variant="outline"
                            size={isMobile ? "lg" : "xl"}
                            disabled={!canUseAttack}
                            onClick={() => triggerPlayer1Attack(attack.name)}
                            style={{
                              position: "relative",
                              zIndex: 1,
                              padding: "0",
                              minHeight: isMobile ? "100px" : "120px",
                              minWidth: isMobile ? "90px" : "120px",
                              backgroundColor: "transparent",
                              border: "none",
                              borderRadius: "15px",
                              cursor: canUseAttack ? "pointer" : "not-allowed",
                              opacity: canUseAttack ? 1 : 0.5,
                              transition: "all 0.3s ease",
                              overflow: "hidden",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "none"
                            }}
                            onTouchStart={(e) => {
                              if (canUseAttack && isMobile) {
                                e.target.style.transform = "scale(0.95)";
                                e.target.style.backgroundColor = "rgba(252, 63, 49, 0.1)";
                                e.target.style.animation = "impactShake 0.3s ease-out";
                              }
                            }}
                            onTouchEnd={(e) => {
                              if (canUseAttack && isMobile) {
                                e.target.style.transform = "scale(1)";
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.animation = "none";
                              }
                            }}
                            onMouseEnter={(e) => {
                              if (canUseAttack && !isMobile) {
                                e.target.style.transform = "scale(1.05)";
                                e.target.style.backgroundColor = "rgba(252, 63, 49, 0.1)";
                                e.target.style.animation = "impactShake 0.3s ease-out";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (canUseAttack && !isMobile) {
                                e.target.style.transform = "scale(1)";
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.animation = "none";
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
                    disabled={!isBlockAvailable()}
                    onClick={togglePlayer1Block}
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "0",
                      width: isMobile ? "70px" : "120px",
                      height: isMobile ? "60px" : "100px",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: isMobile ? "15px" : "15px",
                      cursor: isBlockAvailable() ? "pointer" : "not-allowed",
                      opacity: isBlockAvailable() ? 1 : 0.5,
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      boxShadow: "none",
                      flexShrink: 0
                    }}
                    onTouchStart={(e) => {
                      if (isBlockAvailable() && isMobile) {
                        e.target.style.transform = "scale(0.95)";
                        e.target.style.backgroundColor = "rgba(252, 63, 49, 0.1)";
                        e.target.style.animation = "impactShake 0.3s ease-out";
                      }
                    }}
                    onTouchEnd={(e) => {
                      if (isBlockAvailable() && isMobile) {
                        e.target.style.transform = "scale(1)";
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.animation = "none";
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (isBlockAvailable() && !isMobile) {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.backgroundColor = "rgba(252, 63, 49, 0.1)";
                        e.target.style.animation = "impactShake 0.3s ease-out";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isBlockAvailable() && !isMobile) {
                        e.target.style.transform = "scale(1)";
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.animation = "none";
                      }
                    }}
                  >
                    <img 
                      src={coverImg}
                      alt="Block"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: isBlockAvailable() ? "none" : "grayscale(1)",
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
                      {player1IsDead ? "DEFEAT" : "VICTORY"}
                      </Text>
                    )}
                    
                  {/* Botón para revivir solo al jugador perdedor - Solo visible cuando hay un ganador */}
                  {isCombatOver && (
                    <Button
                      variant="outline"
                      size={isMobile ? "xs" : "lg"}
                      onClick={() => {
                        playButtonSound();
                        reviveLosingPlayer();
                      }}
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
