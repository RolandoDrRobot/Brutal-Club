import { Affix, Button, Group, Text, Stack, Box } from "@mantine/core";
import { useCharacterAnimations } from "../contexts/CharacterAnimations";
import { useMediaQuery } from "@mantine/hooks";
import React, { useState, useEffect, Suspense } from 'react';
const MusicPlayer = React.lazy(() => import("./MusicPlayer"));
const MainMenu = React.lazy(() => import("./MainMenu"));
const CharacterSkillTree = React.lazy(() => import("./CharacterSkillTree"));
const CombinedShopOpponents = React.lazy(() => import("./CombinedShopOpponents"));
const Shop = React.lazy(() => import("./Shop"));
import '../styles/fightAnimations.css';
import punchImg from "../assets/optimized/punch.webp";
import kickImg from "../assets/optimized/kick.webp";
import comboImg from "../assets/optimized/combo.webp";
import coverImg from "../assets/optimized/cover.webp";
import coverbgImg from '../assets/optimized/coverbg.webp';
import { useButtonSound } from '../hooks/useButtonSound';
import { useCombatControls } from '../hooks/useInput';
import { useModelLoader } from '../hooks/useModelLoader';
import CharacterPreview from "./CharacterPreview";

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
        0 0 15px #A00000,
        0 0 30px rgba(243, 34, 16, 0.5),
        0 4px 12px rgba(243, 34, 16, 0.3),
        inset 0 0 15px rgba(243, 34, 16, 0.1);
    }
    50% {
      box-shadow: 
        0 0 25px #A00000,
        0 0 50px rgba(243, 34, 16, 0.8),
        0 4px 20px rgba(243, 34, 16, 0.6),
        inset 0 0 25px rgba(243, 34, 16, 0.2);
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
      box-shadow: 0 0 10px rgba(243, 34, 16, 0.3);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 0 30px rgba(243, 34, 16, 0.8);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 10px rgba(243, 34, 16, 0.3);
    }
  }
`;

const Interface = () => {
  const { 
    currentScreen,
    navigateToMenu,
    navigateBackToDance,
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
    initializeCombat,
    reviveLosingPlayer,
    player1Health,
    player2Health,
    player1Stamina,
    player2Stamina,
    maxStamina,
    player1IsDead,
    player2IsDead,
    togglePlayer1Block,
    canPlayerAttack,
    navigateToShop,
    navigateBackFromShop
  } = useCharacterAnimations();

  const { playButtonSound } = useButtonSound();
  const { createAttackHandler, createBlockHandler } = useCombatControls();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  
  const [fightTransition, setFightTransition] = useState(false);

  const attackButtons = [
    { name: "punch", label: "Puñetazo", image: punchImg },
    { name: "kick", label: "Patada", image: kickImg },
    { name: "punches", label: "Combo", image: comboImg }
  ];




  const isCombatOver = player1IsDead || player2IsDead;

  const isAttackAvailable = (attackType) => {
    if (!isCombatMode || player1IsDead || player2IsDead) {
      return false;
    }
    
    return canPlayerAttack(1);
  };

  const isBlockAvailable = () => {
    return isCombatMode && !player1IsDead && !player2IsDead && player1Stamina > 0;
  };
  
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
            0 0 10px #A00000,
            0 0 20px rgba(243, 34, 16, 0.3),
            0 4px 8px rgba(243, 34, 16, 0.2),
            inset 0 0 10px rgba(243, 34, 16, 0.05);
        }
        50% {
          box-shadow: 
            0 0 25px #A00000,
            0 0 50px rgba(243, 34, 16, 0.8),
            0 4px 20px rgba(243, 34, 16, 0.5),
            inset 0 0 25px rgba(243, 34, 16, 0.2);
        }
        100% {
          box-shadow: 
            0 0 10px #A00000,
            0 0 20px rgba(243, 34, 16, 0.3),
            0 4px 8px rgba(243, 34, 16, 0.2),
            inset 0 0 10px rgba(243, 34, 16, 0.05);
        }
      }
      
      @keyframes redNeonText {
        0% {
          text-shadow: 
            0 0 3px #A00000,
            0 0 6px #A00000,
            0 0 9px rgba(243, 34, 16, 0.4),
            2px 2px 4px rgba(0,0,0,0.8);
        }
        50% {
          text-shadow: 
            0 0 5px #A00000,
            0 0 10px #A00000,
            0 0 15px rgba(243, 34, 16, 0.6),
            0 0 20px rgba(243, 34, 16, 0.3),
            2px 2px 4px rgba(0,0,0,0.8);
        }
        100% {
          text-shadow: 
            0 0 3px #A00000,
            0 0 6px #A00000,
            0 0 9px rgba(243, 34, 16, 0.4),
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
  
  const handleNavigateToMenu = () => {
    triggerPlayer1Attack('punch');
    
    setTimeout(() => {
      triggerPlayer1Attack('kick');
    }, 1200);
    
    setFightTransition(true);
    
    document.body.style.animation = "impactShake 0.6s ease-out";
    
    const flashOverlay = document.createElement('div');
    flashOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100dvh;
      background: radial-gradient(circle, rgba(243, 34, 16, 0.3) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
      animation: fightTransition 0.8s ease-out;
    `;
    document.body.appendChild(flashOverlay);
    
    setTimeout(() => {
      document.body.style.animation = "";
      document.body.removeChild(flashOverlay);
      setFightTransition(false);
      navigateToMenu();
    }, 600);
  };

  const { isLoading, loadingProgress, loadingStatus, lazyLoadModel } = useModelLoader();

  return (
    <>
      {/* Inject CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: interfaceStyles }} />

      {/* Music player - visible on all screens - Lazy loaded */}
      {showMusicPlayer && (
        <Suspense fallback={null}>
          <MusicPlayer />
        </Suspense>
      )}

      {/* Mostrar componente de menú principal cuando currentScreen es 'menu' - Lazy loaded */}
      {currentScreen === 'menu' && (
        <Suspense fallback={null}>
          <MainMenu 
            onStartClick={navigateToOpponentSelect}
            onFightersClick={navigateToCharacterSelect}
            onStoreClick={navigateToShop}
            onBackClick={navigateBackToDance}
          />
        </Suspense>
      )}

      {/* Mostrar pantalla de árbol de habilidades cuando currentScreen es 'characterSelect' - Lazy loaded */}
      {currentScreen === 'characterSelect' && (
        <Suspense fallback={null}>
          <CharacterSkillTree 
            onSelectClick={handleCharacterSelection}
            onBackClick={navigateBackFromCharacterSelect}
          />
        </Suspense>
      )}

      {/* Mostrar pantalla combinada de oponentes y tienda cuando currentScreen es 'opponentSelect' - Lazy loaded */}
      {currentScreen === 'opponentSelect' && (
        <Suspense fallback={null}>
          <CombinedShopOpponents 
            onChallengeClick={handleOpponentChallenge}
            onBackClick={navigateBackFromOpponentSelect}
          />
        </Suspense>
      )}

      {/* Mostrar pantalla de tienda cuando currentScreen es 'shop' - Lazy loaded */}
      {currentScreen === 'shop' && (
        <Suspense fallback={null}>
          <Shop 
            onBackClick={navigateBackFromShop}
          />
        </Suspense>
      )}



      {/* Modo de combate - currentScreen 'combat' */}
      {currentScreen === 'combat' && (
        <>

          {/* Victory Screen - Full Screen Overlay */}
          {isCombatOver && (
            <div 
              style={{
                backgroundImage: `url(${coverbgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                animation: 'fadeInSpray 1s ease-out',
                backdropFilter: 'blur(2px)',
                padding: isMobile ? '10px' : '20px',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}>
              
              {/* 3D Model of winning character - Large background */}
              <CharacterPreview
                characterName={(() => {
                  const winnerCharacter = player1IsDead ? selectedPlayer2Character?.name || selectedPlayer2Character : selectedPlayer1Character?.name || selectedPlayer1Character;
                  return winnerCharacter;
                })()}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: isMobile ? '120vw' : '80vw',
                  height: isMobile ? '120vh' : '100vh',
                  zIndex: 0,
                  opacity: 0.7,
                  pointerEvents: 'none'
                }}
              />
              
              {/* Winner Title */}
              <div
                style={{
                  animation: 'electricTitle 0.8s ease-out 0.2s both',
                  zIndex: 10,
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#F5F5DC',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '15px',
                  textAlign: 'center',
                  zIndex: 10,
                  position: 'relative'
                }}>
                  {player1IsDead ? "PLAYER 2 WINS!" : "PLAYER 1 WINS!"}
                </div>
              </div>

              {/* Coins Reward - Only show for Player 1 victory */}
              {!player1IsDead && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                    animation: 'electricPulse 0.8s ease-out 0.4s both',
                    zIndex: 10,
                    position: 'relative'
                  }}
                >
                  <div style={{
                    fontSize: '48px',
                    fontWeight: 900,
                    color: '#A00000',
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '2px',
                    zIndex: 10,
                    position: 'relative'
                  }}>
                    REWARD: +1 COIN
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                  animation: 'electricPulse 0.8s ease-out 0.6s both',
                  marginTop: '30px',
                  zIndex: 10,
                  position: 'relative'
                }}
              >


                {/* FIGHT Button */}
                <button
                  onClick={() => {
                    playButtonSound();
                    navigateToOpponentSelect();
                  }}
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#F5F5DC',
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    backgroundColor: 'transparent',
                    border: '2px solid #F5F5DC',
                    borderRadius: '8px',
                    padding: '15px 30px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  FIGHT
                </button>
              </div>
            </div>
          )}

          {/* Controles de animación de baile - Solo en modo sincronizado - CENTRO ARRIBA */}
          {!isCombatMode && (
            <>
              {/* Título Fight Club - ARRIBA CENTRO */}
              <Affix position={{ 
                top: 25, 
                left: "50%",
                transform: "translateX(-50%)"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div 
                    className="fight-title"
                    onClick={() => {
                      playButtonSound();
                      navigateBackToDance();
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
                      borderColor: "#A00000",
                      border: "4px solid #A00000",
                      borderRadius: "0px",
                      color: "#A00000",
                      textTransform: "uppercase",
                      letterSpacing: "3px",
                      fontFamily: "Anton, sans-serif",
                      boxShadow: `
                        0 0 20px #A00000,
                        0 0 40px rgba(243, 34, 16, 0.3),
                        inset 0 0 20px rgba(243, 34, 16, 0.1)
                      `,
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.backgroundColor = "rgba(243, 34, 16, 0.1)";
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
                    }}
                    style={{
                      fontSize: isMobile ? "36px" : "48px",
                      fontWeight: 700,
                      padding: isMobile ? "15px 40px" : "20px 60px",
                      minHeight: isMobile ? "80px" : "100px",
                      minWidth: isMobile ? "280px" : "350px",
                      backgroundColor: "transparent",
                      borderColor: "#A00000",
                      border: "4px solid #A00000",
                      borderRadius: "0px",
                      color: "#A00000",
                      textTransform: "uppercase",
                      letterSpacing: "3px",
                      fontFamily: "Anton, sans-serif",
                      boxShadow: `
                        0 0 20px #A00000,
                        0 0 40px rgba(243, 34, 16, 0.3),
                        inset 0 0 20px rgba(243, 34, 16, 0.1)
                      `,
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.target.style.transform = "scale(1.05)";
                        e.target.style.backgroundColor = "rgba(243, 34, 16, 0.1)";
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




            </>
          )}

          {/* Controles de combate - PAD DE PELEA MEJORADO */}
          {isCombatMode && !isCombatOver && (
            <>
              {/* PAD DE PELEA PRINCIPAL - Diseño Arcade Profesional */}
              <Affix position={{ 
                bottom: isMobile ? 45 : 65, 
                left: "50%",
                transform: "translateX(-50%)"
              }}>
                <Box style={{ 
                  textAlign: "center",
                  backgroundColor: "transparent",
                  borderRadius: "0px",
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
                    {attackButtons.map((attack) => {
                      const canUseAttack = isAttackAvailable(attack.name);
                      const attackHandler = createAttackHandler(attack.name);
                      
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
                            {...attackHandler}
                            style={{
                              position: "relative",
                              zIndex: 1,
                              padding: "0",
                              minHeight: isMobile ? "100px" : "120px",
                              minWidth: isMobile ? "90px" : "120px",
                              backgroundColor: "transparent",
                              border: "none",
                              borderRadius: "0px",
                              cursor: canUseAttack ? "pointer" : "not-allowed",
                              opacity: canUseAttack ? 1 : 0.5,
                              transition: "all 0.3s ease",
                              overflow: "hidden",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "none"
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
                                borderRadius: "0px"
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
                bottom: isMobile ? 175 : 270, 
                left: isMobile ? 10 : 40
              }}>
                <Box style={{ position: "relative" }}>
                    <Button
                    variant="outline"
                    size={isMobile ? "sm" : "xl"}
                    disabled={!isBlockAvailable()}
                    onClick={togglePlayer1Block}
                    {...createBlockHandler()}
                    style={{
                      position: "relative",
                      zIndex: 1,
                      padding: "0",
                      width: isMobile ? "70px" : "120px",
                      height: isMobile ? "60px" : "100px",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: "0px",
                      cursor: isBlockAvailable() ? "pointer" : "not-allowed",
                      opacity: isBlockAvailable() ? 1 : 0.5,
                      transition: "all 0.3s ease",
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
                        filter: isBlockAvailable() ? "none" : "grayscale(1)",
                        pointerEvents: "none"
                      }}
                    />
                          </Button>
                </Box>
              </Affix>

              {/* Panel de Control - Derecha */}
              <Affix position={{ 
                bottom: isMobile ? 185 : 270, 
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
                        border: `3px solid #A00000`,
                        borderRadius: "0px",
                        transition: "all 0.2s ease",
                        minWidth: isMobile ? "60px" : "120px",
                        height: isMobile ? "40px" : "80px",
                        cursor: "pointer",
                        overflow: "hidden",
                        boxShadow: `
                          0 0 10px #A00000,
                          0 0 20px rgba(243, 34, 16, 0.4),
                          inset 0 0 10px rgba(243, 34, 16, 0.1)
                        `,
                        fontSize: isMobile ? "8px" : "12px",
                        fontWeight: 700,
                        color: "#A00000",
                        textTransform: "uppercase",
                        textShadow: "0 0 5px #A00000"
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
