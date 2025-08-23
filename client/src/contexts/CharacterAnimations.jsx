import { createContext, useContext, useState, useRef, useEffect, useMemo } from "react";
import { useGameState } from './GameState';

const CharacterAnimationsContext = createContext({});

// Mapeo de animaciones de ataque a animaciones de defensa para Pete
// Usando las animaciones reales disponibles
const attackToDefenseMap = {
  // Todos los ataques causan la animación "hurt" en el defensor
  "kick": "hurt",
  "punch": "hurt", 
  "punches": "hurt", // Combo de puñetazos
};

// Definir animaciones específicas de Pete por categoría usando las reales
const peteAnimations = {
  // Animaciones de combate (para modo combate)
  combat: {
    idle: "idleFight",        // Idle específico para combate
    kick: "kick",             // Patada
    punch: "punch",           // Puñetazo simple
    punches: "punches",       // Combo de puñetazos (ataque fuerte)
    hurt: "hurt",             // Reacción al recibir daño
    die: "die",               // Animación de muerte
    block: "cover"            // Usar cover como bloqueo
  },
  // Animaciones de baile y celebración (para modo fuera de combate)
  dance: {
    celebration: "celebration",
    dance1: "dance1",
    dance2: "dance2", 
    dance3: "dance3",
    dance4: "dance4",
    dance5: "dance5",
    dance6: "dance6",
    intro: "intro"
  }
};

// Definir animaciones específicas de Tyler - Tyler tendrá las mismas referencias pero pueden mapear a diferentes nombres
const tylerAnimations = {
  // Animaciones de combate (para modo combate)
  combat: {
    idle: "idleFight",        // Idle específico para combate
    kick: "kick",             // Patada
    punch: "punch",           // Puñetazo simple
    punches: "punches",       // Combo de puñetazos (ataque fuerte)
    hurt: "hurt",             // Reacción al recibir daño
    die: "die",               // Animación de muerte
    block: "cover"            // Usar cover como bloqueo
  },
  // Animaciones de baile y celebración (para modo fuera de combate)
  dance: {
    celebration: "celebration",
    dance1: "dance1",
    dance2: "dance2", 
    dance3: "dance3",
    dance4: "dance4",
    dance5: "dance5",
    dance6: "dance6",
    intro: "intro"
  }
};

// Mapeo de bailes para Player 2 - cuando Player 1 hace un baile, Player 2 hace otro
const danceMapping = {
  "dance1": "dance2",
  "dance2": "dance3", 
  "dance3": "dance4",
  "dance4": "dance5",
  "dance5": "dance6",
  "dance6": "dance1",  // Ciclo completo
  "celebration": "intro",
  "intro": "celebration"
};

// Daño por tipo de ataque
const attackDamage = {
  "punch": 10,    // Puñetazo básico (reducido de 15 a 10)
  "kick": 15,     // Patada (reducido de 20 a 15)
  "punches": 25,  // Combo de puñetazos (reducido de 35 a 25)
};

// Costo de stamina por acción
const staminaCosts = {
  "punch": 5,     // Puñetazo básico - bajo costo
  "kick": 10,     // Patada - costo medio
  "punches": 25,  // Combo de puñetazos - alto costo
};

// NUEVO: Timing realista para cada tipo de ataque
const ATTACK_TIMINGS = {
  "punch": { 
    attack: 800,    // 0.8s ejecutando el ataque
    recovery: 300,  // 0.3s de recuperación
    total: 1100     // 1.1s total
  },
  "kick": { 
    attack: 1200,   // 1.2s ejecutando el ataque
    recovery: 400,  // 0.4s de recuperación
    total: 1600     // 1.6s total
  },
  "punches": { 
    attack: 2000,   // 2.0s ejecutando el combo
    recovery: 600,  // 0.6s de recuperación
    total: 2600     // 2.6s total
  }
};

// NUEVO: Estados de combate realista
const COMBAT_STATES = {
  IDLE: 'IDLE',                 // Puede atacar, bloquear o moverse
  ATTACKING: 'ATTACKING',       // Ejecutando ataque - oponente NO puede atacar
  RECOVERING: 'RECOVERING',     // Recuperándose del ataque - vulnerable a contraataques
  BLOCKING: 'BLOCKING',         // Bloqueando - puede recibir daño reducido
  STUNNED: 'STUNNED',          // Aturdido - no puede hacer nada
  HURT: 'HURT'                 // Recibiendo daño - breve momento de vulnerabilidad
};

// Constantes de stamina
const MAX_STAMINA = 100;
const STAMINA_REGEN_RATE = 15; // Stamina que se regenera por segundo (reducido de 20 a 15)
const STAMINA_REGEN_DELAY = 1500; // Tiempo antes de empezar a regenerar (aumentado de 1000ms a 1500ms)
const BLOCK_DURATION = 5000; // Máximo tiempo de bloqueo (5 segundos)
const BLOCK_STAMINA_DRAIN_RATE = 20; // Stamina que se drena por segundo mientras bloquea
const STAMINA_UPDATE_INTERVAL = 50; // Actualizar cada 50ms para animación suave

export const CharacterAnimationsProvider = (props) => {
  const [animationIndex, setAnimationIndex] = useState(0);
  const [animations, setAnimations] = useState([]);
  
  // NUEVO: Sistema de navegación de pantallas
  // Posibles valores: 'dance', 'menu', 'combat', 'characterSelect'
  const [currentScreen, setCurrentScreen] = useState('dance');
  
  // NUEVO: Estado para animaciones de salida
  const [isExiting, setIsExiting] = useState(false);
  const [nextScreen, setNextScreen] = useState(null);
  
  // NUEVO: Sistema de selección de personajes
  const [selectedPlayer1Character, setSelectedPlayer1Character] = useState('pete');
  const [selectedPlayer2Character, setSelectedPlayer2Character] = useState('tyler');
  const [isSelectingCharacter, setIsSelectingCharacter] = useState(false);
  
  // NUEVO: Sistema de oponentes seleccionados
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  
  // Sistema de combate
  const [player1AnimationIndex, setPlayer1AnimationIndex] = useState(0);
  const [player2AnimationIndex, setPlayer2AnimationIndex] = useState(0);
  const [isCombatMode, setIsCombatMode] = useState(false);
  
  // Sistema de vida
  const [player1Health, setPlayer1Health] = useState(150);
  const [player2Health, setPlayer2Health] = useState(150);
  const [maxHealth] = useState(150);
  
  // Sistema de stamina
  const [player1Stamina, setPlayer1Stamina] = useState(MAX_STAMINA);
  const [player2Stamina, setPlayer2Stamina] = useState(MAX_STAMINA);
  
  // Estados de muerte
  const [player1IsDead, setPlayer1IsDead] = useState(false);
  const [player2IsDead, setPlayer2IsDead] = useState(false);
  
  // Contador de victorias del Player 1
  const [player1Wins, setPlayer1Wins] = useState(0);
  
  // Flag para evitar contar victorias duplicadas en la misma ronda
  const [victoryCountedThisRound, setVictoryCountedThisRound] = useState(false);
  
  // Estados de defensa/bloqueo
  const [player1IsBlocking, setPlayer1IsBlocking] = useState(false);
  const [player2IsBlocking, setPlayer2IsBlocking] = useState(false);
  
  // NUEVO: Estados de combate realista
  const [player1CombatState, setPlayer1CombatState] = useState(COMBAT_STATES.IDLE);
  const [player2CombatState, setPlayer2CombatState] = useState(COMBAT_STATES.IDLE);
  
  // NUEVO: Referencias para el sistema de timing
  const player1AttackTimerRef = useRef(null);
  const player2AttackTimerRef = useRef(null);
  const player1RecoveryTimerRef = useRef(null);
  const player2RecoveryTimerRef = useRef(null);
  
  // Sistema de IA para Player 2
  const [isAIEnabled, setIsAIEnabled] = useState(true); // IA siempre activada
  const [aiDifficulty, setAIDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  
  // Referencias para timeouts y intervals
  const attackTimeoutRef = useRef(null);
  const introTimeoutRef = useRef(null);
  const player1BlockTimeoutRef = useRef(null);
  const player2BlockTimeoutRef = useRef(null);
  const player1StaminaRegenRef = useRef(null);
  const player2StaminaRegenRef = useRef(null);
  const player1BlockStaminaRef = useRef(null);
  const player2BlockStaminaRef = useRef(null);
  const aiActionTimeoutRef = useRef(null);

  // Add GameState hook at the top after other hooks
  const { registerVictory, registerDefeat, getOpponentsStatus } = useGameState();

  // Función para encontrar índice de animación por nombre exacto - funciona para ambos personajes
  const findAnimationIndex = (animationName, player = 1) => {
    const index = animations.findIndex(anim => anim === animationName);
    if (index >= 0) {
      return index;
    }
    
    // Si no encuentra la animación exacta, buscar por nombre similar
    const fallbackIndex = animations.findIndex(anim => 
      anim.toLowerCase().includes(animationName.toLowerCase())
    );
    
    return fallbackIndex >= 0 ? fallbackIndex : 0; // Fallback a la primera animación
  };

  // Función para obtener animación específica según el modo y jugador
  const getAnimationForMode = (animationType, player = 1) => {
    // Usar las animaciones correspondientes según el jugador
    const characterAnimations = player === 1 ? peteAnimations : tylerAnimations;
    
    if (isCombatMode) {
      // En modo combate, usar animaciones de pelea
      const combatAnim = characterAnimations.combat[animationType];
      if (combatAnim) {
        return findAnimationIndex(combatAnim, player);
      }
      // Si no encuentra la animación, usar idleFight como fallback
      return findAnimationIndex("idleFight", player);
    } else {
      // Fuera de combate, usar animaciones de baile para movimientos básicos
      if (animationType === "idle") {
        // Buscar idle normal primero, si no existe usar la primera animación
        const idleIndex = findAnimationIndex("idle", player);
        return idleIndex > 0 ? idleIndex : 0;
      }
      
      // Para otros movimientos, usar animaciones de baile
      const danceAnimations = Object.values(characterAnimations.dance);
      const randomDance = danceAnimations[Math.floor(Math.random() * danceAnimations.length)];
      return findAnimationIndex(randomDance, player);
    }
  };

  // Función para consumir stamina del Player 1
  const consumePlayer1Stamina = (amount) => {
    setPlayer1Stamina(prev => {
      const newStamina = Math.max(0, prev - amount);
      return newStamina;
    });
    // Solo iniciar regeneración si NO está bloqueando
    if (!player1IsBlocking) {
      startPlayer1StaminaRegen();
    }
  };

  // Función para consumir stamina del Player 2
  const consumePlayer2Stamina = (amount) => {
    setPlayer2Stamina(prev => {
      const newStamina = Math.max(0, prev - amount);
      return newStamina;
    });
    // Solo iniciar regeneración si NO está bloqueando
    if (!player2IsBlocking) {
      startPlayer2StaminaRegen();
    }
  };

  // Función para iniciar regeneración de stamina del Player 1
  const startPlayer1StaminaRegen = () => {
    // Si está bloqueando, no regenerar stamina
    if (player1IsBlocking) {
      return;
    }
    
    // Limpiar regeneración anterior si existe
    if (player1StaminaRegenRef.current) {
      clearInterval(player1StaminaRegenRef.current);
      player1StaminaRegenRef.current = null;
    }
    
    
    // Esperar antes de empezar a regenerar
    setTimeout(() => {
      // Verificar nuevamente que no esté bloqueando antes de iniciar regeneración
      if (player1IsBlocking) {
        return;
      }
      
      player1StaminaRegenRef.current = setInterval(() => {
        setPlayer1Stamina(prev => {
          // Si está bloqueando, detener regeneración inmediatamente
          if (player1IsBlocking) {
            clearInterval(player1StaminaRegenRef.current);
            player1StaminaRegenRef.current = null;
            return prev;
          }
          
          const increment = (STAMINA_REGEN_RATE * STAMINA_UPDATE_INTERVAL) / 1000;
          const newStamina = Math.min(MAX_STAMINA, prev + increment);
          
          if (newStamina >= MAX_STAMINA) {
            clearInterval(player1StaminaRegenRef.current);
            player1StaminaRegenRef.current = null;
            return MAX_STAMINA;
          }
          return newStamina;
        });
      }, STAMINA_UPDATE_INTERVAL);
    }, STAMINA_REGEN_DELAY);
  };

  // Función para iniciar regeneración de stamina del Player 2
  const startPlayer2StaminaRegen = () => {
    
    // Si está bloqueando, no regenerar stamina
    if (player2IsBlocking) {
      return;
    }
    
    // Limpiar regeneración anterior si existe
    if (player2StaminaRegenRef.current) {
      clearInterval(player2StaminaRegenRef.current);
      player2StaminaRegenRef.current = null;
    }
    
    
    // Esperar antes de empezar a regenerar
    setTimeout(() => {
      // Verificar nuevamente que no esté bloqueando antes de iniciar regeneración
      if (player2IsBlocking) {
        return;
      }
      
      player2StaminaRegenRef.current = setInterval(() => {
        setPlayer2Stamina(prev => {
          // VERIFICACIÓN CRÍTICA: Si está bloqueando, detener regeneración inmediatamente
          if (player2IsBlocking) {
            clearInterval(player2StaminaRegenRef.current);
            player2StaminaRegenRef.current = null;
            return prev;
          }
          
          const increment = (STAMINA_REGEN_RATE * STAMINA_UPDATE_INTERVAL) / 1000;
          const newStamina = Math.min(MAX_STAMINA, prev + increment);
          
          if (newStamina >= MAX_STAMINA) {
            clearInterval(player2StaminaRegenRef.current);
            player2StaminaRegenRef.current = null;
            return MAX_STAMINA;
          }
          return newStamina;
        });
      }, STAMINA_UPDATE_INTERVAL);
    }, STAMINA_REGEN_DELAY);
  };

  // Función para obtener índice de animación de muerte según el jugador
  const getDeathAnimationIndex = (player = 1) => {
    return findAnimationIndex("die", player);
  };

  // Función para obtener índice de animación de bloqueo según el jugador
  const getBlockAnimationIndex = (player = 1) => {
    return findAnimationIndex("cover", player);
  };

  // Función para aplicar animación con verificación de muerte
  const setPlayer1Animation = (index) => {
    if (player1IsDead) {
      return;
    }
    setPlayer1AnimationIndex(index);
  };

  const setPlayer2Animation = (index) => {
    if (player2IsDead) {
      return;
    }
    setPlayer2AnimationIndex(index);
  };

  // Función para volver ambos personajes a idle
  const returnToIdle = () => {
    
    // Determinar qué animación idle usar según el modo para cada jugador
    const player1IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    const player2IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    
    // Solo volver a idle si no están muertos y no están bloqueando
    if (!player1IsDead && !player1IsBlocking) {
      setPlayer1AnimationIndex(player1IdleIndex);
    } else if (player1IsBlocking) {
    } else {
    }
    
    if (!player2IsDead && !player2IsBlocking) {
      setPlayer2AnimationIndex(player2IdleIndex);
    } else if (player2IsBlocking) {
    } else {
    }
  };

  // Función para detener bloqueo del Player 1
  const stopPlayer1Block = () => {
    setPlayer1IsBlocking(false);
    
    // Usar la animación idle correcta según el modo
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    setPlayer1Animation(idleIndex);
    
    // Limpiar completamente todos los timeouts e intervals del bloqueo
    if (player1BlockTimeoutRef.current) {
      clearTimeout(player1BlockTimeoutRef.current);
      player1BlockTimeoutRef.current = null;
    }
    if (player1BlockStaminaRef.current) {
      clearInterval(player1BlockStaminaRef.current);
      player1BlockStaminaRef.current = null;
    }
    
    // IMPORTANTE: Iniciar regeneración solo después de limpiar todo
    setTimeout(() => {
      if (!player1IsBlocking) { // Verificar que realmente no esté bloqueando
        startPlayer1StaminaRegen();
      }
    }, 100); // Pequeño delay para asegurar que el estado se actualice
  };

  // Función para detener bloqueo del Player 2
  const stopPlayer2Block = () => {
    setPlayer2IsBlocking(false);
    
    // Usar la animación idle correcta según el modo
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    setPlayer2Animation(idleIndex);
    
    // Limpiar completamente todos los timeouts e intervals del bloqueo
    if (player2BlockTimeoutRef.current) {
      clearTimeout(player2BlockTimeoutRef.current);
      player2BlockTimeoutRef.current = null;
    }
    if (player2BlockStaminaRef.current) {
      clearInterval(player2BlockStaminaRef.current);
      player2BlockStaminaRef.current = null;
    }
    
    // IMPORTANTE: Iniciar regeneración solo después de limpiar todo
    setTimeout(() => {
      if (!player2IsBlocking) { // Verificar que realmente no esté bloqueando
        startPlayer2StaminaRegen();
      }
    }, 100); // Pequeño delay para asegurar que el estado se actualice
  };

  // Función para activar/desactivar bloqueo del Player 1
  const togglePlayer1Block = () => {
    if (player1IsDead) {
      return;
    }

    if (player1IsBlocking) {
      // Detener bloqueo
      stopPlayer1Block();
    } else {
      // Verificar si tiene stamina suficiente para bloquear
      if (player1Stamina <= 0) {
        return;
      }

      
      // PRIMERO: Detener completamente cualquier regeneración de stamina
      if (player1StaminaRegenRef.current) {
        clearInterval(player1StaminaRegenRef.current);
        player1StaminaRegenRef.current = null;
      }
      
      // SEGUNDO: Activar el estado de bloqueo y animación
      setPlayer1IsBlocking(true);
      setPlayer1Animation(getBlockAnimationIndex(1));
      
      // TERCERO: Iniciar el gasto gradual de stamina
      player1BlockStaminaRef.current = setInterval(() => {
        setPlayer1Stamina(prev => {
          const decrement = (BLOCK_STAMINA_DRAIN_RATE * STAMINA_UPDATE_INTERVAL) / 1000;
          const newStamina = Math.max(0, prev - decrement);
          
          if (newStamina <= 0) {
            stopPlayer1Block();
            return 0;
          }
          return newStamina;
        });
      }, STAMINA_UPDATE_INTERVAL);
      
      // CUARTO: Auto-detener después de 5 segundos máximo
      player1BlockTimeoutRef.current = setTimeout(() => {
        if (player1IsBlocking) {
          stopPlayer1Block();
        }
      }, BLOCK_DURATION);
    }
  };

  // Función para activar/desactivar bloqueo del Player 2
  const togglePlayer2Block = () => {
    if (player2IsDead) {
      return;
    }

    if (player2IsBlocking) {
      // Detener bloqueo
      stopPlayer2Block();
    } else {
      // Verificar si tiene stamina suficiente para bloquear
      if (player2Stamina <= 0) {
        return;
      }

      
      // PASO 1: DETENER COMPLETAMENTE CUALQUIER REGENERACIÓN (MÁS AGRESIVO)
      if (player2StaminaRegenRef.current) {
        clearInterval(player2StaminaRegenRef.current);
        player2StaminaRegenRef.current = null;
      }
      
      // PASO 2: VERIFICACIÓN ADICIONAL - Limpiar cualquier timeout pendiente de regeneración
      setTimeout(() => {
        if (player2StaminaRegenRef.current) {
          clearInterval(player2StaminaRegenRef.current);
          player2StaminaRegenRef.current = null;
        }
      }, 10);
      
      // PASO 3: Activar el estado de bloqueo y animación
      setPlayer2IsBlocking(true);
      setPlayer2Animation(getBlockAnimationIndex(2));
      
      // PASO 4: DELAY ANTES DE INICIAR GASTO (para asegurar que regeneración esté completamente detenida)
      setTimeout(() => {
        // Verificación final antes de iniciar gasto
        if (player2StaminaRegenRef.current) {
          clearInterval(player2StaminaRegenRef.current);
          player2StaminaRegenRef.current = null;
        }
        
        // QUINTO: Iniciar el gasto gradual de stamina
        player2BlockStaminaRef.current = setInterval(() => {
          setPlayer2Stamina(prev => {
            const decrement = (BLOCK_STAMINA_DRAIN_RATE * STAMINA_UPDATE_INTERVAL) / 1000;
            const newStamina = Math.max(0, prev - decrement);
            
            if (newStamina <= 0) {
              stopPlayer2Block();
              return 0;
            }
            return newStamina;
          });
        }, STAMINA_UPDATE_INTERVAL);
        
        // SEXTO: Auto-detener después de 5 segundos máximo
        player2BlockTimeoutRef.current = setTimeout(() => {
          if (player2IsBlocking) {
            stopPlayer2Block();
          }
        }, BLOCK_DURATION);
        
      }, 50); // Delay de 50ms para asegurar limpieza completa
    }
  };

  // Función para aplicar daño al jugador 1
  const applyDamageToPlayer1 = (attackType) => {
    
    // Si Player 1 está bloqueando, no recibe daño
    if (player1IsBlocking) {
      return;
    }

    const damage = attackDamage[attackType] || 10;
    
    setPlayer1Health(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      
      // Verificar si Player 1 muere
      if (newHealth <= 0 && !player1IsDead) {
        setPlayer1IsDead(true);
        setPlayer1IsBlocking(false); // No puede bloquear si está muerto
        stopPlayer1Block(); // Detener bloqueo si estaba activo
        // Activar animación de muerte inmediatamente y de forma permanente
        setPlayer1AnimationIndex(getDeathAnimationIndex(1));
        
        // Decrementar contador de victorias del Player 1 SOLO si no se ha contado ya y si tiene victorias
        if (!victoryCountedThisRound) {
          setVictoryCountedThisRound(true);
          setPlayer1Wins(prevWins => {
            if (prevWins > 0) {
              const newWins = prevWins - 1;
              return newWins;
            } else {
              return prevWins;
            }
          });
        } else {
        }
      } else if (newHealth <= 0) {
      }
      
      return newHealth;
    });
  };

  // Función para aplicar daño al jugador 2
  const applyDamageToPlayer2 = (attackType) => {
    
    // Si Player 2 está bloqueando, no recibe daño
    if (player2IsBlocking) {
      return;
    }

    const damage = attackDamage[attackType] || 10;
    
    setPlayer2Health(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      
      // Verificar si Player 2 muere
      if (newHealth <= 0 && !player2IsDead) {
        setPlayer2IsDead(true);
        setPlayer2IsBlocking(false); // No puede bloquear si está muerto
        stopPlayer2Block(); // Detener bloqueo si estaba activo
        // Activar animación de muerte inmediatamente y de forma permanente
        setPlayer2AnimationIndex(getDeathAnimationIndex(2));
        
        // Incrementar contador de victorias del Player 1 SOLO si no se ha contado ya
        if (!victoryCountedThisRound) {
          setVictoryCountedThisRound(true);
          setPlayer1Wins(prevWins => {
            const newWins = prevWins + 1;
            return newWins;
          });
        } else {
        }
      } else if (newHealth <= 0) {
      }
      
      return newHealth;
    });
  };

  // Función para resetear vida y stamina de ambos jugadores
  const resetHealth = () => {
    setPlayer1Health(maxHealth);
    setPlayer2Health(maxHealth);
    setPlayer1Stamina(MAX_STAMINA);
    setPlayer2Stamina(MAX_STAMINA);
    setPlayer1IsDead(false);
    setPlayer2IsDead(false);
    setPlayer1IsBlocking(false);
    setPlayer2IsBlocking(false);
    
    // Resetear flag de victoria contada para nueva ronda
    setVictoryCountedThisRound(false);
    
    // Limpiar todos los timeouts e intervals
    if (player1BlockTimeoutRef.current) clearTimeout(player1BlockTimeoutRef.current);
    if (player2BlockTimeoutRef.current) clearTimeout(player2BlockTimeoutRef.current);
    if (player1StaminaRegenRef.current) clearInterval(player1StaminaRegenRef.current);
    if (player2StaminaRegenRef.current) clearInterval(player2StaminaRegenRef.current);
    if (player1BlockStaminaRef.current) clearInterval(player1BlockStaminaRef.current);
    if (player2BlockStaminaRef.current) clearInterval(player2BlockStaminaRef.current);
    
    // Volver ambos a idle usando la animación correcta según el modo para cada personaje
    const player1IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    const player2IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    setPlayer1AnimationIndex(player1IdleIndex);
    setPlayer2AnimationIndex(player2IdleIndex);
    
  };

  // Función para revivir solo al jugador que perdió
  const reviveLosingPlayer = () => {
    
    // Resetear flag de victoria para nueva ronda
    setVictoryCountedThisRound(false);
    
    if (player1IsDead && !player2IsDead) {
      setPlayer1IsDead(false);
      setPlayer1Health(maxHealth);
      setPlayer1Stamina(MAX_STAMINA);
      setPlayer1IsBlocking(false);
      
      // Volver a idle de combate
      const combatIdleIndex = findAnimationIndex("idleFight", 1);
      setPlayer1AnimationIndex(combatIdleIndex);
      
      // Reiniciar IA si estaba habilitada
      if (isAIEnabled && isCombatMode) {
        setTimeout(() => {
          startAI();
        }, 1000);
      }
      
    } else if (player2IsDead && !player1IsDead) {
      setPlayer2IsDead(false);
      setPlayer2Health(maxHealth);
      setPlayer2Stamina(MAX_STAMINA);
      setPlayer2IsBlocking(false);
      
      // Volver a idle de combate
      const combatIdleIndex = findAnimationIndex("idleFight", 2);
      setPlayer2AnimationIndex(combatIdleIndex);
      
      // Reiniciar IA si estaba habilitada
      if (isAIEnabled && isCombatMode) {
        setTimeout(() => {
          startAI();
        }, 1000);
      }
    }
    
  };

  // ========== SISTEMA DE IA PARA PLAYER 2 ==========
  
  // Función para que la IA tome decisiones
  const makeAIDecision = () => {
    
    // NUEVO: Log del estado de combate
    
    // VERIFICACIÓN PRIORITARIA: Si el combate terminó, detener IA inmediatamente
    const combatEnded = player1IsDead || player2IsDead;
    if (combatEnded) {
      stopAI();
      return;
    }
    
    // Solo actuar si la IA está habilitada, en modo combate, y ningún jugador está muerto
    if (!isAIEnabled || !isCombatMode || player1IsDead || player2IsDead) {
      return;
    }

    // Si Player 2 está bloqueando, decidir si continuar o no
    if (player2IsBlocking) {
      // 60% de probabilidad de dejar de bloquear en modo fácil (aumentado de 30%)
      if (Math.random() < 0.6) {
        togglePlayer2Block();
      } else {
      }
      return;
    }

    // NUEVA LÓGICA: Verificar si puede atacar con el sistema de turnos
    const canAttack = canPlayerAttack(2);
    
    if (!canAttack) {
      return;
    }

    // Configuración de dificultad
    const difficultyConfig = {
      easy: {
        reactionTime: { min: 1500, max: 3000 }, // 1.5-3 segundos
        attackChance: 0.5, // AUMENTADO: 50% de probabilidad de atacar (más agresivo)
        blockChance: 0.1,  // 10% de probabilidad de bloquear
        smartBlockChance: 0.1, // 10% de bloqueo inteligente
        staminaAwareness: 0.2 // 20% de consciencia de stamina
      }
    };

    const config = difficultyConfig[aiDifficulty];
    const action = Math.random();
    

    // NUEVA LÓGICA: Ser más agresivo si el oponente está en RECOVERING
    let attackChanceModified = config.attackChance;
    if (player1CombatState === COMBAT_STATES.RECOVERING) {
      attackChanceModified += 0.3; // +30% de probabilidad si el oponente se está recuperando
    }

    // Decidir acción basada en probabilidades
    if (action < attackChanceModified) {
      // Decidir qué ataque usar
      const attackTypes = ['punch', 'kick', 'punches'];
      const availableAttacks = attackTypes.filter(attack => {
        const cost = staminaCosts[attack] || 0;
        return player2Stamina >= cost;
      });
      

      if (availableAttacks.length > 0) {
        // En modo fácil, preferir ataques más simples
        let selectedAttack;
        if (aiDifficulty === 'easy') {
          // 50% punch, 35% kick, 15% punches (más balanceado)
          const rand = Math.random();
          if (rand < 0.5 && availableAttacks.includes('punch')) {
            selectedAttack = 'punch';
          } else if (rand < 0.85 && availableAttacks.includes('kick')) {
            selectedAttack = 'kick';
          } else {
            selectedAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
          }
        } else {
          selectedAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
        }

        triggerPlayer2Attack(selectedAttack);
      } else {
      }
    } else if (action < attackChanceModified + config.blockChance) {
      // Decidir si bloquear
      if (player2Stamina > 20) { // Solo bloquear si tiene suficiente stamina
        togglePlayer2Block();
      } else {
      }
    } else {
    }
    // Si no hace nada, simplemente espera
  };

  // Función para iniciar el comportamiento de IA
  const startAI = () => {
    if (!isAIEnabled || !isCombatMode) return;

    scheduleNextAIAction();
  };

  // Función para programar la próxima acción de IA
  const scheduleNextAIAction = () => {
    
    // VERIFICACIÓN PRIORITARIA: Si el combate terminó, no programar más acciones
    const combatEnded = player1IsDead || player2IsDead;
    if (combatEnded) {
      return;
    }
    
    if (!isAIEnabled || !isCombatMode || player1IsDead || player2IsDead) {
      return;
    }

    // Limpiar timeout anterior
    if (aiActionTimeoutRef.current) {
      clearTimeout(aiActionTimeoutRef.current);
    }

    const difficultyConfig = {
      easy: { min: 1500, max: 3000 }
    };

    const config = difficultyConfig[aiDifficulty];
    const delay = Math.random() * (config.max - config.min) + config.min;
    

    aiActionTimeoutRef.current = setTimeout(() => {
      makeAIDecision();
      scheduleNextAIAction(); // Programar la siguiente acción
    }, delay);
    
  };

  // Función para detener la IA
  const stopAI = () => {
    
    if (aiActionTimeoutRef.current) {
      clearTimeout(aiActionTimeoutRef.current);
      aiActionTimeoutRef.current = null;
    }
    
    // Si Player 2 está bloqueando cuando se detiene la IA, detener el bloqueo
    if (player2IsBlocking) {
      stopPlayer2Block();
    }
    
  };

  // Función para obtener animaciones según el tipo de ataque usando Pete
  const getAttackAnimations = (attackAnimationName) => {
    // Obtener animación de ataque
    const attackIndex = findAnimationIndex(attackAnimationName);
    
    // Obtener animación de defensa usando el mapeo (siempre "hurt")
    const defenseAnimationName = attackToDefenseMap[attackAnimationName] || "hurt";
    const defenseIndex = findAnimationIndex(defenseAnimationName);
    
    return { attackIndex, defenseIndex };
  };

  // NUEVO: Función para activar ataque del jugador 1 con sistema de turnos realista
  const triggerPlayer1Attack = (attackAnimationName) => {
    
    // NUEVA LÓGICA: Verificar si puede atacar usando el sistema de turnos
    if (!canPlayerAttack(1)) {
      return;
    }

    // Verificar stamina para golpes fuertes
    const staminaCost = staminaCosts[attackAnimationName] || 0;
    if (staminaCost > 0 && player1Stamina < staminaCost) {
      return;
    }

    
    // Consumir stamina si es necesario
    if (staminaCost > 0) {
      consumePlayer1Stamina(staminaCost);
    }
    
    // NUEVA LÓGICA: Usar el sistema de secuencia de ataque realista
    executeAttackSequence(1, attackAnimationName, 2);
  };

  // NUEVO: Función para activar ataque del jugador 2 con sistema de turnos realista
  const triggerPlayer2Attack = (attackAnimationName) => {
    
    // NUEVA LÓGICA: Verificar si puede atacar usando el sistema de turnos
    if (!canPlayerAttack(2)) {
      return;
    }

    // Verificar stamina para golpes fuertes
    const staminaCost = staminaCosts[attackAnimationName] || 0;
    if (staminaCost > 0 && player2Stamina < staminaCost) {
      return;
    }

    
    // Consumir stamina si es necesario
    if (staminaCost > 0) {
      consumePlayer2Stamina(staminaCost);
    }
    
    // NUEVA LÓGICA: Usar el sistema de secuencia de ataque realista
    executeAttackSequence(2, attackAnimationName, 1);
  };

  // Función para activar animación sincronizada (modo normal)
  const triggerSyncAnimation = (index) => {
    
    // Limpiar timeout si existe
    if (attackTimeoutRef.current) {
      clearTimeout(attackTimeoutRef.current);
    }
    
    if (!isCombatMode && animations.length > 0) {
      // En modo baile, asignar diferentes animaciones a cada jugador
      const player1AnimationName = animations[index];
      
      // Obtener la animación mapeada para Player 2
      const player2AnimationName = danceMapping[player1AnimationName] || player1AnimationName;
      
      // Encontrar los índices de las animaciones
      const player1AnimationIndex = findAnimationIndex(player1AnimationName);
      const player2AnimationIndex = findAnimationIndex(player2AnimationName);
      
      
      // Asegurar que ambos jugadores están vivos antes de asignar animaciones
      if (player1IsDead || player2IsDead) {
        setPlayer1IsDead(false);
        setPlayer2IsDead(false);
      }
      
      // Asignar diferentes animaciones a cada jugador
      setPlayer1Animation(player1AnimationIndex);
      setPlayer2Animation(player2AnimationIndex);
      
      // Actualizar el índice principal para la UI DESPUÉS de aplicar las animaciones
      setAnimationIndex(index); // El índice principal sigue siendo el de Player 1 para la UI
      
      // Verificación adicional después de un pequeño delay
      setTimeout(() => {
      }, 50);
      
    } else {
      // En modo combate, usar la lógica original (ambos iguales)
      let animationToUse = index;
      
      if (animations.length > 0) {
        const animationName = animations[index];
        // Si la animación seleccionada no es idle, usar una animación de baile
        if (animationName && !animationName.toLowerCase().includes('idle')) {
          const danceAnimations = Object.values(peteAnimations.dance);
          const randomDance = danceAnimations[index % danceAnimations.length];
          animationToUse = findAnimationIndex(randomDance);
        }
      }
      
      // Usar las funciones protegidas para evitar cambiar animaciones de jugadores muertos
      setPlayer1Animation(animationToUse);
      setPlayer2Animation(animationToUse);
      setAnimationIndex(animationToUse);
    }
  };

  // Función para inicializar combate con animación intro
  const initializeCombat = () => {
    resetHealth(); // Resetear vida y stamina al iniciar combate (esto revive a todos)
    
    // NUEVO: Resetear estados de combate realista
    setPlayer1CombatState(COMBAT_STATES.IDLE);
    setPlayer2CombatState(COMBAT_STATES.IDLE);
    
    // NUEVO: Limpiar todos los timers del sistema de turnos
    clearPlayerTimers(1);
    clearPlayerTimers(2);
    
    // Resetear flag de victoria para nueva sesión de combate
    setVictoryCountedThisRound(false);
    
    // Limpiar timeout anterior del intro si existe
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    
    // Primero mostrar la animación intro para ambos jugadores
    const player1IntroIndex = findAnimationIndex("intro", 1);
    const player2IntroIndex = findAnimationIndex("intro", 2);
    setPlayer1AnimationIndex(player1IntroIndex);
    setPlayer2AnimationIndex(player2IntroIndex);
    
    
    // Después de 3 segundos, cambiar a idle de combate
    introTimeoutRef.current = setTimeout(() => {
      const player1CombatIdleIndex = findAnimationIndex("idleFight", 1);
      const player2CombatIdleIndex = findAnimationIndex("idleFight", 2);
      setPlayer1AnimationIndex(player1CombatIdleIndex);
      setPlayer2AnimationIndex(player2CombatIdleIndex);
      
      // NUEVO: Asegurar que ambos jugadores estén en estado IDLE después del intro
      setPlayer1CombatState(COMBAT_STATES.IDLE);
      setPlayer2CombatState(COMBAT_STATES.IDLE);
      
      
      // Iniciar IA después de que termine la intro
      if (isAIEnabled) {
        setTimeout(() => {
          startAI();
        }, 1000); // Esperar 1 segundo adicional antes de que la IA empiece a actuar
      }
      
      introTimeoutRef.current = null; // Limpiar la referencia
    }, 3000); // 3 segundos para la animación intro
  };

  // Función para limpiar completamente el estado de combate
  const cleanupCombatState = () => {
    
    // Detener IA inmediatamente
    stopAI();
    
    // NUEVO: Limpiar todos los timers del sistema de turnos
    clearPlayerTimers(1);
    clearPlayerTimers(2);
    
    // NUEVO: Resetear estados de combate realista
    setPlayer1CombatState(COMBAT_STATES.IDLE);
    setPlayer2CombatState(COMBAT_STATES.IDLE);
    
    // Limpiar todos los timeouts e intervals
    if (attackTimeoutRef.current) {
      clearTimeout(attackTimeoutRef.current);
      attackTimeoutRef.current = null;
    }
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    if (player1BlockTimeoutRef.current) {
      clearTimeout(player1BlockTimeoutRef.current);
      player1BlockTimeoutRef.current = null;
    }
    if (player2BlockTimeoutRef.current) {
      clearTimeout(player2BlockTimeoutRef.current);
      player2BlockTimeoutRef.current = null;
    }
    if (player1StaminaRegenRef.current) {
      clearInterval(player1StaminaRegenRef.current);
      player1StaminaRegenRef.current = null;
    }
    if (player2StaminaRegenRef.current) {
      clearInterval(player2StaminaRegenRef.current);
      player2StaminaRegenRef.current = null;
    }
    if (player1BlockStaminaRef.current) {
      clearInterval(player1BlockStaminaRef.current);
      player1BlockStaminaRef.current = null;
    }
    if (player2BlockStaminaRef.current) {
      clearInterval(player2BlockStaminaRef.current);
      player2BlockStaminaRef.current = null;
    }
    
    // Resetear estados de bloqueo
    setPlayer1IsBlocking(false);
    setPlayer2IsBlocking(false);
    
    // Volver a idle normal según el modo para cada personaje
    const player1IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    const player2IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    
    // Solo cambiar animación si no están muertos
    if (!player1IsDead) {
      setPlayer1AnimationIndex(player1IdleIndex);
    }
    if (!player2IsDead) {
      setPlayer2AnimationIndex(player2IdleIndex);
    }
    
  };

  // Limpiar timeouts al desmontar el componente
  useEffect(() => {
    return () => {
      // Limpiar timers originales
      if (attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
      if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
      if (player1BlockTimeoutRef.current) clearTimeout(player1BlockTimeoutRef.current);
      if (player2BlockTimeoutRef.current) clearTimeout(player2BlockTimeoutRef.current);
      if (player1StaminaRegenRef.current) clearInterval(player1StaminaRegenRef.current);
      if (player2StaminaRegenRef.current) clearInterval(player2StaminaRegenRef.current);
      if (player1BlockStaminaRef.current) clearInterval(player1BlockStaminaRef.current);
      if (player2BlockStaminaRef.current) clearInterval(player2BlockStaminaRef.current);
      if (aiActionTimeoutRef.current) clearTimeout(aiActionTimeoutRef.current);
      
      // NUEVO: Limpiar timers del sistema de turnos
      if (player1AttackTimerRef.current) clearTimeout(player1AttackTimerRef.current);
      if (player2AttackTimerRef.current) clearTimeout(player2AttackTimerRef.current);
      if (player1RecoveryTimerRef.current) clearTimeout(player1RecoveryTimerRef.current);
      if (player2RecoveryTimerRef.current) clearTimeout(player2RecoveryTimerRef.current);
    };
  }, []);

  // Manejar cambios de modo entre combate y baile
  useEffect(() => {
    if (animations.length === 0) return; // Esperar a que las animaciones estén cargadas
    
    if (isCombatMode) {
      // En modo combate, no hacer nada aquí ya que initializeCombat() maneja la secuencia intro
      // La función initializeCombat() se llama explícitamente desde la UI cuando se inicia combate
    } else {
      // Limpiar completamente el estado de combate al cambiar a modo baile
      cleanupCombatState();
      
      // Resetear animationIndex para que ningún botón aparezca activo inicialmente
      setAnimationIndex(-1);
      
      // En modo baile, mantener ambos jugadores en idle normal
      // No activar automáticamente ningún baile específico
      setTimeout(() => {
        const idleIndex = findAnimationIndex("idle");
        setPlayer1AnimationIndex(idleIndex);
        setPlayer2AnimationIndex(idleIndex);
      }, 100); // Pequeño delay para asegurar que el estado se limpie primero
    }
  }, [isCombatMode, animations]);

  // useEffect para manejar cambios en el estado de IA
  useEffect(() => {
    
    if (isAIEnabled && isCombatMode && !player1IsDead && !player2IsDead) {
      // Pequeño delay para asegurar que el combate esté completamente inicializado
      setTimeout(() => {
        startAI();
      }, 500);
    } else if (!isAIEnabled) {
      stopAI();
    }
  }, [isAIEnabled, isCombatMode, player1IsDead, player2IsDead]);

  // useEffect para detener IA cuando el combate termina (algún jugador muere)
  useEffect(() => {
    if (player1IsDead || player2IsDead) {
      stopAI();
    }
  }, [player1IsDead, player2IsDead]);

  // useEffect para detectar fin de combate y registrar resultados
  useEffect(() => {
    if (player1IsDead || player2IsDead) {
      
      // Registrar resultado del combate
      if (player1IsDead && !player2IsDead) {
        // Player 2 (opponent) won
        registerDefeat();
      } else if (player2IsDead && !player1IsDead) {
        // Player 1 (player) won
        // Use the selected opponent's ID instead of the character name
        if (selectedOpponent) {
          const opponentId = selectedOpponent.id;
          registerVictory(opponentId);
        } else if (selectedPlayer2Character) {
          // Fallback to the previous system if no opponent is selected
          const opponentId = selectedPlayer2Character.toLowerCase();
          registerVictory(opponentId);
        }
      }
    }
  }, [player1IsDead, player2IsDead, selectedOpponent, selectedPlayer2Character, registerVictory, registerDefeat]);

  // useEffect para manejar el sistema de contadores de victorias existente
  useEffect(() => {
  }, [player1Wins]);

  // NUEVO: Funciones del sistema de turnos realista
  
  // Función para verificar si un jugador puede atacar
  const canPlayerAttack = (player) => {
    const playerState = player === 1 ? player1CombatState : player2CombatState;
    const opponentState = player === 1 ? player2CombatState : player1CombatState;
    const playerIsDead = player === 1 ? player1IsDead : player2IsDead;
    const opponentIsDead = player === 1 ? player2IsDead : player1IsDead;
    const playerIsBlocking = player === 1 ? player1IsBlocking : player2IsBlocking;
    
    // No puede atacar si está muerto, bloqueando, o si el oponente está atacando
    if (playerIsDead || opponentIsDead || playerIsBlocking) {
      return false;
    }
    
    // REGLA CLAVE: No puede atacar si el oponente está en estado ATTACKING
    if (opponentState === COMBAT_STATES.ATTACKING) {
      return false;
    }
    
    // Solo puede atacar si está en IDLE o RECOVERING
    return playerState === COMBAT_STATES.IDLE || playerState === COMBAT_STATES.RECOVERING;
  };
  
  // Función para cambiar el estado de combate de un jugador
  const setPlayerCombatState = (player, newState) => {
    
    if (player === 1) {
      setPlayer1CombatState(newState);
    } else {
      setPlayer2CombatState(newState);
    }
  };
  
  // Función para limpiar todos los timers de un jugador
  const clearPlayerTimers = (player) => {
    if (player === 1) {
      if (player1AttackTimerRef.current) {
        clearTimeout(player1AttackTimerRef.current);
        player1AttackTimerRef.current = null;
      }
      if (player1RecoveryTimerRef.current) {
        clearTimeout(player1RecoveryTimerRef.current);
        player1RecoveryTimerRef.current = null;
      }
    } else {
      if (player2AttackTimerRef.current) {
        clearTimeout(player2AttackTimerRef.current);
        player2AttackTimerRef.current = null;
      }
      if (player2RecoveryTimerRef.current) {
        clearTimeout(player2RecoveryTimerRef.current);
        player2RecoveryTimerRef.current = null;
      }
    }
  };
  
  // Función para ejecutar la secuencia completa de ataque con timing realista
  const executeAttackSequence = (attackerPlayer, attackType, defenderPlayer) => {
    const timing = ATTACK_TIMINGS[attackType];
    if (!timing) {
      console.error(`No timing found for attack type: ${attackType}`);
      return;
    }
    
    
    // Limpiar timers previos del atacante
    clearPlayerTimers(attackerPlayer);
    
    // FASE 1: ATTACKING - El atacante está ejecutando el ataque
    setPlayerCombatState(attackerPlayer, COMBAT_STATES.ATTACKING);
    
    // Ejecutar animaciones de ataque y defensa
    const { attackIndex, defenseIndex } = getAttackAnimations(attackType);
    
    if (attackerPlayer === 1) {
      setPlayer1Animation(attackIndex);
      // Solo cambiar animación del defensor si no está bloqueando
      if (!player2IsBlocking) {
        setPlayer2Animation(defenseIndex);
        setPlayerCombatState(2, COMBAT_STATES.HURT);
      }
    } else {
      setPlayer2Animation(attackIndex);
      // Solo cambiar animación del defensor si no está bloqueando
      if (!player1IsBlocking) {
        setPlayer1Animation(defenseIndex);
        setPlayerCombatState(1, COMBAT_STATES.HURT);
      }
    }
    
    // FASE 2: Aplicar daño cuando termina la animación de ataque
    const attackTimerRef = attackerPlayer === 1 ? player1AttackTimerRef : player2AttackTimerRef;
    attackTimerRef.current = setTimeout(() => {
      
      // Aplicar daño
      if (attackerPlayer === 1) {
        applyDamageToPlayer2(attackType);
      } else {
        applyDamageToPlayer1(attackType);
      }
      
      // FASE 3: RECOVERING - El atacante entra en recuperación
      setPlayerCombatState(attackerPlayer, COMBAT_STATES.RECOVERING);
      
      // FASE 4: Volver a IDLE después de la recuperación
      const recoveryTimerRef = attackerPlayer === 1 ? player1RecoveryTimerRef : player2RecoveryTimerRef;
      recoveryTimerRef.current = setTimeout(() => {
        setPlayerCombatState(attackerPlayer, COMBAT_STATES.IDLE);
        
        // Volver el defensor a IDLE también (si no está muerto)
        const defenderIsDead = defenderPlayer === 1 ? player1IsDead : player2IsDead;
        if (!defenderIsDead) {
          setPlayerCombatState(defenderPlayer, COMBAT_STATES.IDLE);
        }
        
        // Volver ambos a animación idle si no están muertos
        returnToIdle();
        
      }, timing.recovery);
      
    }, timing.attack);
  };

  // NUEVO: Funciones de navegación entre pantallas con animación de salida
  const navigateWithExitAnimation = (targetScreen, additionalActions = null) => {
    if (isExiting) return; // Prevenir múltiples transiciones
    
    setIsExiting(true);
    setNextScreen(targetScreen);
    
    // Después de la animación de salida, cambiar la pantalla
    setTimeout(() => {
      setCurrentScreen(targetScreen);
      setIsExiting(false);
      setNextScreen(null);
      
      // Ejecutar acciones adicionales si se proporcionan
      if (additionalActions) {
        additionalActions();
      }
    }, 400); // Duración reducida de fadeOutSpray para transiciones más rápidas
  };

  const navigateToMenu = () => {
    navigateWithExitAnimation('menu', () => {
      setIsCombatMode(false);
      // Reset combat state when going to menu
      cleanupCombatState();
    });
  };

  const navigateToCombat = () => {
    navigateWithExitAnimation('combat', () => {
      setIsCombatMode(true);
      initializeCombat();
    });
  };

  const navigateBackToDance = () => {
    navigateWithExitAnimation('dance', () => {
      setIsCombatMode(false);
    });
  };

  const navigateBackToMenu = () => {
    navigateWithExitAnimation('menu', () => {
      setIsCombatMode(false);
    });
  };

  // NUEVAS: Funciones de navegación para selección de personajes
  const navigateToCharacterSelect = () => {
    navigateWithExitAnimation('characterSelect', () => {
      setIsSelectingCharacter(true);
    });
  };

  const navigateBackFromCharacterSelect = () => {
    navigateWithExitAnimation('menu', () => {
      setIsSelectingCharacter(false);
    });
  };

  // NUEVAS: Funciones de navegación para la tienda
  const navigateToShop = () => {
    navigateWithExitAnimation('shop');
  };

  const navigateBackFromShop = () => {
    navigateWithExitAnimation('menu');
  };

  // NUEVAS: Funciones de navegación para selección de oponentes
  const navigateToOpponentSelect = () => {
    navigateWithExitAnimation('opponentSelect');
  };

  const navigateBackFromOpponentSelect = () => {
    navigateWithExitAnimation('menu');
  };

  const handleOpponentChallenge = (opponent) => {
    
    // Guardar el oponente seleccionado
    setSelectedOpponent(opponent);
    
    // Configurar el oponente como Player 2
    setSelectedPlayer2Character(opponent.model || opponent.id);
    
    
    // Navegar directamente al combate
    navigateWithExitAnimation('combat', () => {
      setIsCombatMode(true);
      initializeCombat();
    });
  };

  const handleCharacterSelection = (character) => {
    // Por ahora solo cambiamos el personaje del Player 1
    setSelectedPlayer1Character(character.model);
    
    // Volver al menú principal después de seleccionar
    navigateBackFromCharacterSelect();
  };

  return (
    <CharacterAnimationsContext.Provider
      value={{
        // Sistema original
        animationIndex,
        setAnimationIndex,
        animations,
        setAnimations,
        
        // NUEVO: Sistema de navegación de pantallas
        currentScreen,
        setCurrentScreen,
        isExiting,
        nextScreen,
        navigateToMenu,
        navigateToCombat,
        navigateBackToDance,
        navigateBackToMenu,
        
        // Sistema de combate
        player1AnimationIndex,
        player2AnimationIndex,
        setPlayer1AnimationIndex: setPlayer1Animation, // Usar función protegida
        setPlayer2AnimationIndex: setPlayer2Animation, // Usar función protegida
        isCombatMode,
        setIsCombatMode,
        triggerPlayer1Attack,
        triggerPlayer2Attack,
        triggerSyncAnimation,
        returnToIdle,
        initializeCombat,
        
        // Sistema de vida
        player1Health,
        player2Health,
        maxHealth,
        setPlayer1Health,
        setPlayer2Health,
        resetHealth,
        reviveLosingPlayer,
        
        // Sistema de stamina
        player1Stamina,
        player2Stamina,
        maxStamina: MAX_STAMINA,
        
        // Estados de muerte
        player1IsDead,
        player2IsDead,
        
        // Contador de victorias
        player1Wins,
        
        // Flag para debug (temporal)
        victoryCountedThisRound,
        
        // Sistema de bloqueo/defensa
        player1IsBlocking,
        player2IsBlocking,
        togglePlayer1Block,
        togglePlayer2Block,
        
        // Sistema de IA para Player 2
        isAIEnabled,
        setIsAIEnabled,
        aiDifficulty,
        setAIDifficulty,
        startAI,
        stopAI,
        makeAIDecision, // Para debug
        
        // Constantes para la UI
        staminaCosts,
        
        // NUEVO: Sistema de turnos realista
        player1CombatState,
        player2CombatState,
        canPlayerAttack,
        COMBAT_STATES, // Exportar las constantes para uso en UI
        ATTACK_TIMINGS, // Exportar timings para debugging/UI
        
        // NUEVO: Sistema de selección de personajes
        selectedPlayer1Character,
        selectedPlayer2Character,
        isSelectingCharacter,
        setSelectedPlayer1Character,
        setSelectedPlayer2Character,
        navigateToCharacterSelect,
        navigateBackFromCharacterSelect,
        handleCharacterSelection,
        
        // NUEVAS: Funciones de navegación para la tienda
        navigateToShop,
        navigateBackFromShop,
        
        // NUEVAS: Funciones de navegación para selección de oponentes
        navigateToOpponentSelect,
        navigateBackFromOpponentSelect,
        handleOpponentChallenge,
        
        // NUEVO: Sistema de oponentes
        selectedOpponent,
        setSelectedOpponent,
      }}
    >
      {props.children}
    </CharacterAnimationsContext.Provider>
  );
};

export const useCharacterAnimations = () => {
  return useContext(CharacterAnimationsContext);
};
