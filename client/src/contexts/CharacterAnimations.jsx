import { createContext, useContext, useState, useRef, useEffect, useMemo } from "react";
import { useGameState } from './GameState';
import { useRewards } from '../hooks/useEconomy';

const CharacterAnimationsContext = createContext({});

const attackToDefenseMap = {
  "kick": "hurt",
  "punch": "hurt", 
  "punches": "hurt",
};

const peteAnimations = {
  combat: {
    idle: "idleFight",
    kick: "kick",
    punch: "punch",
    punches: "punches",
    hurt: "hurt",
    die: "die",
    block: "cover"
  },
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

const tylerAnimations = {
  combat: {
    idle: "idleFight",
    kick: "kick",
    punch: "punch",
    punches: "punches",
    hurt: "hurt",
    die: "die",
    block: "cover"
  },
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

const danceMapping = {
  "dance1": "dance2",
  "dance2": "dance3", 
  "dance3": "dance4",
  "dance4": "dance5",
  "dance5": "dance6",
  "dance6": "dance1",
  "celebration": "intro",
  "intro": "celebration"
};

const attackDamage = {
  "punch": 10,
  "kick": 15,
  "punches": 25,
};

const staminaCosts = {
  "punch": 5,
  "kick": 10,
  "punches": 25,
};

const ATTACK_TIMINGS = {
  "punch": { 
    attack: 800,
    recovery: 300,
    total: 1100
  },
  "kick": { 
    attack: 1200,
    recovery: 400,
    total: 1600
  },
  "punches": { 
    attack: 2000,
    recovery: 600,
    total: 2600
  }
};

const COMBAT_STATES = {
  IDLE: 'IDLE',
  ATTACKING: 'ATTACKING',
  RECOVERING: 'RECOVERING',
  BLOCKING: 'BLOCKING',
  STUNNED: 'STUNNED',
  HURT: 'HURT'
};

const MAX_STAMINA = 100;
const STAMINA_REGEN_RATE = 15;
const STAMINA_REGEN_DELAY = 1500;
const BLOCK_DURATION = 5000;
const BLOCK_STAMINA_DRAIN_RATE = 20;
const STAMINA_UPDATE_INTERVAL = 50;

export const CharacterAnimationsProvider = (props) => {
  const [animationIndex, setAnimationIndex] = useState(0);
  const [animations, setAnimations] = useState([]);
  
  const [currentScreen, setCurrentScreen] = useState('menu');
  
  const [isExiting, setIsExiting] = useState(false);
  const [nextScreen, setNextScreen] = useState(null);
  
  const [selectedPlayer1Character, setSelectedPlayer1Character] = useState('pete');
  const [selectedPlayer2Character, setSelectedPlayer2Character] = useState('tyler');
  const [isSelectingCharacter, setIsSelectingCharacter] = useState(false);
  
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  
  const [player1AnimationIndex, setPlayer1AnimationIndex] = useState(0);
  const [player2AnimationIndex, setPlayer2AnimationIndex] = useState(0);
  const [isCombatMode, setIsCombatMode] = useState(false);
  
  const [player1Health, setPlayer1Health] = useState(150);
  const [player2Health, setPlayer2Health] = useState(150);
  const [maxHealth] = useState(150);
  
  const [player1Stamina, setPlayer1Stamina] = useState(MAX_STAMINA);
  const [player2Stamina, setPlayer2Stamina] = useState(MAX_STAMINA);
  
  const [player1IsDead, setPlayer1IsDead] = useState(false);
  const [player2IsDead, setPlayer2IsDead] = useState(false);
  
  const [player1Wins, setPlayer1Wins] = useState(0);
  
  const [victoryCountedThisRound, setVictoryCountedThisRound] = useState(false);
  
  const [player1IsBlocking, setPlayer1IsBlocking] = useState(false);
  const [player2IsBlocking, setPlayer2IsBlocking] = useState(false);
  
  const [player1CombatState, setPlayer1CombatState] = useState(COMBAT_STATES.IDLE);
  const [player2CombatState, setPlayer2CombatState] = useState(COMBAT_STATES.IDLE);
  
  const player1AttackTimerRef = useRef(null);
  const player2AttackTimerRef = useRef(null);
  const player1RecoveryTimerRef = useRef(null);
  const player2RecoveryTimerRef = useRef(null);
  
  const [isAIEnabled, setIsAIEnabled] = useState(true);
  const [aiDifficulty, setAIDifficulty] = useState('easy');
  
  const attackTimeoutRef = useRef(null);
  const introTimeoutRef = useRef(null);
  const player1BlockTimeoutRef = useRef(null);
  const player2BlockTimeoutRef = useRef(null);
  const player1StaminaRegenRef = useRef(null);
  const player2StaminaRegenRef = useRef(null);
  const player1BlockStaminaRef = useRef(null);
  const player2BlockStaminaRef = useRef(null);
  const aiActionTimeoutRef = useRef(null);

  const { registerVictory, registerDefeat, getOpponentsStatus } = useGameState();
  const { giveVictoryReward } = useRewards();

  const findAnimationIndex = (animationName, player = 1) => {
    const index = animations.findIndex(anim => anim === animationName);
    if (index >= 0) {
      return index;
    }
    
    const fallbackIndex = animations.findIndex(anim => 
      anim.toLowerCase().includes(animationName.toLowerCase())
    );
    
    return fallbackIndex >= 0 ? fallbackIndex : 0;
  };

  const getAnimationForMode = (animationType, player = 1) => {
    const characterAnimations = player === 1 ? peteAnimations : tylerAnimations;
    
    if (isCombatMode) {
      const combatAnim = characterAnimations.combat[animationType];
      if (combatAnim) {
        return findAnimationIndex(combatAnim, player);
      }
      return findAnimationIndex("idleFight", player);
    } else {
      if (animationType === "idle") {
        const idleIndex = findAnimationIndex("idle", player);
        return idleIndex > 0 ? idleIndex : 0;
      }
      
      const danceAnimations = Object.values(characterAnimations.dance);
      const randomDance = danceAnimations[Math.floor(Math.random() * danceAnimations.length)];
      return findAnimationIndex(randomDance, player);
    }
  };

  const consumePlayer1Stamina = (amount) => {
    setPlayer1Stamina(prev => {
      const newStamina = Math.max(0, prev - amount);
      return newStamina;
    });
    if (!player1IsBlocking) {
      startPlayer1StaminaRegen();
    }
  };

  const consumePlayer2Stamina = (amount) => {
    setPlayer2Stamina(prev => {
      const newStamina = Math.max(0, prev - amount);
      return newStamina;
    });
    if (!player2IsBlocking) {
      startPlayer2StaminaRegen();
    }
  };

  const startPlayer1StaminaRegen = () => {
    if (player1IsBlocking) {
      return;
    }
    
    if (player1StaminaRegenRef.current) {
      clearInterval(player1StaminaRegenRef.current);
      player1StaminaRegenRef.current = null;
    }
    
    
    setTimeout(() => {
      if (player1IsBlocking) {
        return;
      }
      
      player1StaminaRegenRef.current = setInterval(() => {
        setPlayer1Stamina(prev => {
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

  const startPlayer2StaminaRegen = () => {
    
    if (player2IsBlocking) {
      return;
    }
    
    if (player2StaminaRegenRef.current) {
      clearInterval(player2StaminaRegenRef.current);
      player2StaminaRegenRef.current = null;
    }
    
    
    setTimeout(() => {
      if (player2IsBlocking) {
        return;
      }
      
      player2StaminaRegenRef.current = setInterval(() => {
        setPlayer2Stamina(prev => {
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

  const getDeathAnimationIndex = (player = 1) => {
    return findAnimationIndex("die", player);
  };

  const getBlockAnimationIndex = (player = 1) => {
    return findAnimationIndex("cover", player);
  };

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

  const returnToIdle = () => {
    
    const player1IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    const player2IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    
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

  const stopPlayer1Block = () => {
    setPlayer1IsBlocking(false);
    
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    setPlayer1Animation(idleIndex);
    
    if (player1BlockTimeoutRef.current) {
      clearTimeout(player1BlockTimeoutRef.current);
      player1BlockTimeoutRef.current = null;
    }
    if (player1BlockStaminaRef.current) {
      clearInterval(player1BlockStaminaRef.current);
      player1BlockStaminaRef.current = null;
    }
    
    setTimeout(() => {
      if (!player1IsBlocking) {
        startPlayer1StaminaRegen();
      }
    }, 100);
  };

  const stopPlayer2Block = () => {
    setPlayer2IsBlocking(false);
    
    const idleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    setPlayer2Animation(idleIndex);
    
    if (player2BlockTimeoutRef.current) {
      clearTimeout(player2BlockTimeoutRef.current);
      player2BlockTimeoutRef.current = null;
    }
    if (player2BlockStaminaRef.current) {
      clearInterval(player2BlockStaminaRef.current);
      player2BlockStaminaRef.current = null;
    }
    
    setTimeout(() => {
      if (!player2IsBlocking) {
        startPlayer2StaminaRegen();
      }
    }, 100);
  };

  const togglePlayer1Block = () => {
    if (player1IsDead) {
      return;
    }

    if (player1IsBlocking) {
      stopPlayer1Block();
    } else {
      if (player1Stamina <= 0) {
        return;
      }

      
      if (player1StaminaRegenRef.current) {
        clearInterval(player1StaminaRegenRef.current);
        player1StaminaRegenRef.current = null;
      }
      
      setPlayer1IsBlocking(true);
      setPlayer1Animation(getBlockAnimationIndex(1));
      
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
      
      player1BlockTimeoutRef.current = setTimeout(() => {
        if (player1IsBlocking) {
          stopPlayer1Block();
        }
      }, BLOCK_DURATION);
    }
  };

  const togglePlayer2Block = () => {
    if (player2IsDead) {
      return;
    }

    if (player2IsBlocking) {
      stopPlayer2Block();
    } else {
      if (player2Stamina <= 0) {
        return;
      }

      
      if (player2StaminaRegenRef.current) {
        clearInterval(player2StaminaRegenRef.current);
        player2StaminaRegenRef.current = null;
      }
      
      setTimeout(() => {
        if (player2StaminaRegenRef.current) {
          clearInterval(player2StaminaRegenRef.current);
          player2StaminaRegenRef.current = null;
        }
      }, 10);
      
      setPlayer2IsBlocking(true);
      setPlayer2Animation(getBlockAnimationIndex(2));
      
      setTimeout(() => {
        if (player2StaminaRegenRef.current) {
          clearInterval(player2StaminaRegenRef.current);
          player2StaminaRegenRef.current = null;
        }
        
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
        
        player2BlockTimeoutRef.current = setTimeout(() => {
          if (player2IsBlocking) {
            stopPlayer2Block();
          }
        }, BLOCK_DURATION);
        
      }, 50);
    }
  };

  const applyDamageToPlayer1 = (attackType) => {
    
    if (player1IsBlocking) {
      return;
    }

    const damage = attackDamage[attackType] || 10;
    
    setPlayer1Health(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      
      if (newHealth <= 0 && !player1IsDead) {
        setPlayer1IsDead(true);
        setPlayer1IsBlocking(false);
        stopPlayer1Block();
        setPlayer1AnimationIndex(getDeathAnimationIndex(1));
        
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

  const applyDamageToPlayer2 = (attackType) => {
    
    if (player2IsBlocking) {
      return;
    }

    const damage = attackDamage[attackType] || 10;
    
    setPlayer2Health(prevHealth => {
      const newHealth = Math.max(0, prevHealth - damage);
      
      if (newHealth <= 0 && !player2IsDead) {
        setPlayer2IsDead(true);
        setPlayer2IsBlocking(false);
        stopPlayer2Block();
        setPlayer2AnimationIndex(getDeathAnimationIndex(2));
        
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

  const resetHealth = () => {
    setPlayer1Health(maxHealth);
    setPlayer2Health(maxHealth);
    setPlayer1Stamina(MAX_STAMINA);
    setPlayer2Stamina(MAX_STAMINA);
    setPlayer1IsDead(false);
    setPlayer2IsDead(false);
    setPlayer1IsBlocking(false);
    setPlayer2IsBlocking(false);
    
    setVictoryCountedThisRound(false);
    
    if (player1BlockTimeoutRef.current) clearTimeout(player1BlockTimeoutRef.current);
    if (player2BlockTimeoutRef.current) clearTimeout(player2BlockTimeoutRef.current);
    if (player1StaminaRegenRef.current) clearInterval(player1StaminaRegenRef.current);
    if (player2StaminaRegenRef.current) clearInterval(player2StaminaRegenRef.current);
    if (player1BlockStaminaRef.current) clearInterval(player1BlockStaminaRef.current);
    if (player2BlockStaminaRef.current) clearInterval(player2BlockStaminaRef.current);
    
    const player1IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    const player2IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    setPlayer1AnimationIndex(player1IdleIndex);
    setPlayer2AnimationIndex(player2IdleIndex);
    
  };

  const reviveLosingPlayer = () => {
    
    setVictoryCountedThisRound(false);
    
    if (player1IsDead && !player2IsDead) {
      setPlayer1IsDead(false);
      setPlayer1Health(maxHealth);
      setPlayer1Stamina(MAX_STAMINA);
      setPlayer1IsBlocking(false);
      
      const combatIdleIndex = findAnimationIndex("idleFight", 1);
      setPlayer1AnimationIndex(combatIdleIndex);
      
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
      
      const combatIdleIndex = findAnimationIndex("idleFight", 2);
      setPlayer2AnimationIndex(combatIdleIndex);
      
      if (isAIEnabled && isCombatMode) {
        setTimeout(() => {
          startAI();
        }, 1000);
      }
    }
    
  };

  
  const makeAIDecision = () => {
    const combatEnded = player1IsDead || player2IsDead;
    if (combatEnded) {
      stopAI();
      return;
    }
    
    if (!isAIEnabled || !isCombatMode || player1IsDead || player2IsDead) {
      return;
    }

    if (player2IsBlocking) {
      if (Math.random() < 0.6) {
        togglePlayer2Block();
      } else {
      }
      return;
    }

    const canAttack = canPlayerAttack(2);
    
    if (!canAttack) {
      return;
    }

    const difficultyConfig = {
      easy: {
        reactionTime: { min: 1500, max: 3000 },
        attackChance: 0.5,
        blockChance: 0.1,
        smartBlockChance: 0.1,
        staminaAwareness: 0.2
      }
    };

    const config = difficultyConfig[aiDifficulty];
    const action = Math.random();
    

    let attackChanceModified = config.attackChance;
    if (player1CombatState === COMBAT_STATES.RECOVERING) {
      attackChanceModified += 0.3;
    }

    if (action < attackChanceModified) {
      const attackTypes = ['punch', 'kick', 'punches'];
      const availableAttacks = attackTypes.filter(attack => {
        const cost = staminaCosts[attack] || 0;
        return player2Stamina >= cost;
      });
      

      if (availableAttacks.length > 0) {
        let selectedAttack;
        if (aiDifficulty === 'easy') {
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
      if (player2Stamina > 20) {
        togglePlayer2Block();
      } else {
      }
    } else {
    }
  };

  const startAI = () => {
    if (!isAIEnabled || !isCombatMode) return;

    scheduleNextAIAction();
  };

  const scheduleNextAIAction = () => {
    
    const combatEnded = player1IsDead || player2IsDead;
    if (combatEnded) {
      return;
    }
    
    if (!isAIEnabled || !isCombatMode || player1IsDead || player2IsDead) {
      return;
    }

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
      scheduleNextAIAction();
    }, delay);
    
  };

  const stopAI = () => {
    
    if (aiActionTimeoutRef.current) {
      clearTimeout(aiActionTimeoutRef.current);
      aiActionTimeoutRef.current = null;
    }
    
    if (player2IsBlocking) {
      stopPlayer2Block();
    }
    
  };

  const getAttackAnimations = (attackAnimationName) => {
    const attackIndex = findAnimationIndex(attackAnimationName);
    
    const defenseAnimationName = attackToDefenseMap[attackAnimationName] || "hurt";
    const defenseIndex = findAnimationIndex(defenseAnimationName);
    
    return { attackIndex, defenseIndex };
  };

  const triggerPlayer1Attack = (attackAnimationName) => {
    
    if (!canPlayerAttack(1)) {
      return;
    }

    const staminaCost = staminaCosts[attackAnimationName] || 0;
    if (staminaCost > 0 && player1Stamina < staminaCost) {
      return;
    }

    
    if (staminaCost > 0) {
      consumePlayer1Stamina(staminaCost);
    }
    
    executeAttackSequence(1, attackAnimationName, 2);
  };

  const triggerPlayer2Attack = (attackAnimationName) => {
    
    if (!canPlayerAttack(2)) {
      return;
    }

    const staminaCost = staminaCosts[attackAnimationName] || 0;
    if (staminaCost > 0 && player2Stamina < staminaCost) {
      return;
    }

    
    if (staminaCost > 0) {
      consumePlayer2Stamina(staminaCost);
    }
    
    executeAttackSequence(2, attackAnimationName, 1);
  };

  const triggerSyncAnimation = (index) => {
    
    if (attackTimeoutRef.current) {
      clearTimeout(attackTimeoutRef.current);
    }
    
    if (!isCombatMode && animations.length > 0) {
      const player1AnimationName = animations[index];
      
      const player2AnimationName = danceMapping[player1AnimationName] || player1AnimationName;
      
      const player1AnimationIndex = findAnimationIndex(player1AnimationName);
      const player2AnimationIndex = findAnimationIndex(player2AnimationName);
      
      
      if (player1IsDead || player2IsDead) {
        setPlayer1IsDead(false);
        setPlayer2IsDead(false);
      }
      
      setPlayer1Animation(player1AnimationIndex);
      setPlayer2Animation(player2AnimationIndex);
      
      setAnimationIndex(index);
      
      setTimeout(() => {
      }, 50);
      
    } else {
      let animationToUse = index;
      
      if (animations.length > 0) {
        const animationName = animations[index];
        if (animationName && !animationName.toLowerCase().includes('idle')) {
          const danceAnimations = Object.values(peteAnimations.dance);
          const randomDance = danceAnimations[index % danceAnimations.length];
          animationToUse = findAnimationIndex(randomDance);
        }
      }
      
      setPlayer1Animation(animationToUse);
      setPlayer2Animation(animationToUse);
      setAnimationIndex(animationToUse);
    }
  };

  const initializeCombat = () => {
    resetHealth();
    
    setPlayer1CombatState(COMBAT_STATES.IDLE);
    setPlayer2CombatState(COMBAT_STATES.IDLE);
    
    clearPlayerTimers(1);
    clearPlayerTimers(2);
    
    setVictoryCountedThisRound(false);
    
    if (introTimeoutRef.current) {
      clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    }
    
    const player1IntroIndex = findAnimationIndex("intro", 1);
    const player2IntroIndex = findAnimationIndex("intro", 2);
    setPlayer1AnimationIndex(player1IntroIndex);
    setPlayer2AnimationIndex(player2IntroIndex);
    
    
    introTimeoutRef.current = setTimeout(() => {
      const player1CombatIdleIndex = findAnimationIndex("idleFight", 1);
      const player2CombatIdleIndex = findAnimationIndex("idleFight", 2);
      setPlayer1AnimationIndex(player1CombatIdleIndex);
      setPlayer2AnimationIndex(player2CombatIdleIndex);
      
      setPlayer1CombatState(COMBAT_STATES.IDLE);
      setPlayer2CombatState(COMBAT_STATES.IDLE);
      
      
      if (isAIEnabled) {
        setTimeout(() => {
          startAI();
        }, 1000);
      }
      
      introTimeoutRef.current = null;
    }, 3000);
  };

  const cleanupCombatState = () => {
    
    stopAI();
    
    clearPlayerTimers(1);
    clearPlayerTimers(2);
    
    setPlayer1CombatState(COMBAT_STATES.IDLE);
    setPlayer2CombatState(COMBAT_STATES.IDLE);
    
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
    
    setPlayer1IsBlocking(false);
    setPlayer2IsBlocking(false);
    
    const player1IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 1) : findAnimationIndex("idle", 1);
    const player2IdleIndex = isCombatMode ? findAnimationIndex("idleFight", 2) : findAnimationIndex("idle", 2);
    
    if (!player1IsDead) {
      setPlayer1AnimationIndex(player1IdleIndex);
    }
    if (!player2IsDead) {
      setPlayer2AnimationIndex(player2IdleIndex);
    }
    
  };

  useEffect(() => {
    return () => {
      if (attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
      if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
      if (player1BlockTimeoutRef.current) clearTimeout(player1BlockTimeoutRef.current);
      if (player2BlockTimeoutRef.current) clearTimeout(player2BlockTimeoutRef.current);
      if (player1StaminaRegenRef.current) clearInterval(player1StaminaRegenRef.current);
      if (player2StaminaRegenRef.current) clearInterval(player2StaminaRegenRef.current);
      if (player1BlockStaminaRef.current) clearInterval(player1BlockStaminaRef.current);
      if (player2BlockStaminaRef.current) clearInterval(player2BlockStaminaRef.current);
      if (aiActionTimeoutRef.current) clearTimeout(aiActionTimeoutRef.current);
      
      if (player1AttackTimerRef.current) clearTimeout(player1AttackTimerRef.current);
      if (player2AttackTimerRef.current) clearTimeout(player2AttackTimerRef.current);
      if (player1RecoveryTimerRef.current) clearTimeout(player1RecoveryTimerRef.current);
      if (player2RecoveryTimerRef.current) clearTimeout(player2RecoveryTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (animations.length === 0) return;
    
    if (isCombatMode) {
    } else {
      cleanupCombatState();
      
      setAnimationIndex(-1);
      
      setTimeout(() => {
        const idleIndex = findAnimationIndex("idle");
        setPlayer1AnimationIndex(idleIndex);
        setPlayer2AnimationIndex(idleIndex);
      }, 100);
    }
  }, [isCombatMode, animations]);

  useEffect(() => {
    
    if (isAIEnabled && isCombatMode && !player1IsDead && !player2IsDead) {
      setTimeout(() => {
        startAI();
      }, 500);
    } else if (!isAIEnabled) {
      stopAI();
    }
  }, [isAIEnabled, isCombatMode, player1IsDead, player2IsDead]);

  useEffect(() => {
    if (player1IsDead || player2IsDead) {
      stopAI();
    }
  }, [player1IsDead, player2IsDead]);

  useEffect(() => {
    if (player1IsDead || player2IsDead) {
      
      if (player1IsDead && !player2IsDead) {
        registerDefeat();
      } else if (player2IsDead && !player1IsDead) {
        if (selectedOpponent) {
          const opponentId = selectedOpponent.id;
          registerVictory(opponentId);
          giveVictoryReward(opponentId);
        } else if (selectedPlayer2Character) {
          const opponentId = selectedPlayer2Character.toLowerCase();
          registerVictory(opponentId);
          giveVictoryReward(opponentId);
        }
      }
    }
  }, [player1IsDead, player2IsDead, selectedOpponent, selectedPlayer2Character, registerVictory, registerDefeat, giveVictoryReward]);

  useEffect(() => {
  }, [player1Wins]);

  
  const canPlayerAttack = (player) => {
    const playerState = player === 1 ? player1CombatState : player2CombatState;
    const opponentState = player === 1 ? player2CombatState : player1CombatState;
    const playerIsDead = player === 1 ? player1IsDead : player2IsDead;
    const opponentIsDead = player === 1 ? player2IsDead : player1IsDead;
    const playerIsBlocking = player === 1 ? player1IsBlocking : player2IsBlocking;
    
    if (playerIsDead || opponentIsDead || playerIsBlocking) {
      return false;
    }
    
    if (opponentState === COMBAT_STATES.ATTACKING) {
      return false;
    }
    
    return playerState === COMBAT_STATES.IDLE || playerState === COMBAT_STATES.RECOVERING;
  };
  
  const setPlayerCombatState = (player, newState) => {
    
    if (player === 1) {
      setPlayer1CombatState(newState);
    } else {
      setPlayer2CombatState(newState);
    }
  };
  
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
  
  const executeAttackSequence = (attackerPlayer, attackType, defenderPlayer) => {
    const timing = ATTACK_TIMINGS[attackType];
    if (!timing) {

      return;
    }
    
    
    clearPlayerTimers(attackerPlayer);
    
    setPlayerCombatState(attackerPlayer, COMBAT_STATES.ATTACKING);
    
    const { attackIndex, defenseIndex } = getAttackAnimations(attackType);
    
    if (attackerPlayer === 1) {
      setPlayer1Animation(attackIndex);
      if (!player2IsBlocking) {
        setPlayer2Animation(defenseIndex);
        setPlayerCombatState(2, COMBAT_STATES.HURT);
      }
    } else {
      setPlayer2Animation(attackIndex);
      if (!player1IsBlocking) {
        setPlayer1Animation(defenseIndex);
        setPlayerCombatState(1, COMBAT_STATES.HURT);
      }
    }
    
    const attackTimerRef = attackerPlayer === 1 ? player1AttackTimerRef : player2AttackTimerRef;
    attackTimerRef.current = setTimeout(() => {
      
      if (attackerPlayer === 1) {
        applyDamageToPlayer2(attackType);
      } else {
        applyDamageToPlayer1(attackType);
      }
      
      setPlayerCombatState(attackerPlayer, COMBAT_STATES.RECOVERING);
      
      const recoveryTimerRef = attackerPlayer === 1 ? player1RecoveryTimerRef : player2RecoveryTimerRef;
      recoveryTimerRef.current = setTimeout(() => {
        setPlayerCombatState(attackerPlayer, COMBAT_STATES.IDLE);
        
        const defenderIsDead = defenderPlayer === 1 ? player1IsDead : player2IsDead;
        if (!defenderIsDead) {
          setPlayerCombatState(defenderPlayer, COMBAT_STATES.IDLE);
        }
        
        returnToIdle();
        
      }, timing.recovery);
      
    }, timing.attack);
  };

  const navigateWithExitAnimation = (targetScreen, additionalActions = null) => {
    if (isExiting) return;
    
    setIsExiting(true);
    setNextScreen(targetScreen);
    
    setTimeout(() => {
      setCurrentScreen(targetScreen);
      setIsExiting(false);
      setNextScreen(null);
      
      if (additionalActions) {
        additionalActions();
      }
    }, 400);
  };

  const navigateToMenu = () => {
    navigateWithExitAnimation('menu', () => {
      setIsCombatMode(false);
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

  const navigateToShop = () => {
    navigateWithExitAnimation('shop');
  };

  const navigateBackFromShop = () => {
    navigateWithExitAnimation('menu');
  };

  const navigateToOpponentSelect = () => {
    navigateWithExitAnimation('opponentSelect');
  };

  const navigateBackFromOpponentSelect = () => {
    navigateWithExitAnimation('menu');
  };

  const handleOpponentChallenge = (opponent) => {
    
    setSelectedOpponent(opponent);
    
    setSelectedPlayer2Character(opponent.model || opponent.id);
    
    
    navigateWithExitAnimation('combat', () => {
      setIsCombatMode(true);
      initializeCombat();
    });
  };

  const handleCharacterSelection = (character) => {
    setSelectedPlayer1Character(character.model);
    
    navigateBackFromCharacterSelect();
  };

  return (
    <CharacterAnimationsContext.Provider
      value={{
        animationIndex,
        setAnimationIndex,
        animations,
        setAnimations,
        
        currentScreen,
        setCurrentScreen,
        isExiting,
        nextScreen,
        navigateToMenu,
        navigateToCombat,
        navigateBackToDance,
        navigateBackToMenu,
        
        player1AnimationIndex,
        player2AnimationIndex,
        setPlayer1AnimationIndex: setPlayer1Animation,
        setPlayer2AnimationIndex: setPlayer2Animation,
        isCombatMode,
        setIsCombatMode,
        triggerPlayer1Attack,
        triggerPlayer2Attack,
        triggerSyncAnimation,
        returnToIdle,
        initializeCombat,
        
        player1Health,
        player2Health,
        maxHealth,
        setPlayer1Health,
        setPlayer2Health,
        resetHealth,
        reviveLosingPlayer,
        
        player1Stamina,
        player2Stamina,
        maxStamina: MAX_STAMINA,
        
        player1IsDead,
        player2IsDead,
        
        player1Wins,
        
        victoryCountedThisRound,
        
        player1IsBlocking,
        player2IsBlocking,
        togglePlayer1Block,
        togglePlayer2Block,
        
        
        staminaCosts,
        
        player1CombatState,
        player2CombatState,
        canPlayerAttack,
        COMBAT_STATES,
        ATTACK_TIMINGS,
        
        selectedPlayer1Character,
        selectedPlayer2Character,
        isSelectingCharacter,
        setSelectedPlayer1Character,
        setSelectedPlayer2Character,
        navigateToCharacterSelect,
        navigateBackFromCharacterSelect,
        handleCharacterSelection,
        
        navigateToShop,
        navigateBackFromShop,
        
        navigateToOpponentSelect,
        navigateBackFromOpponentSelect,
        handleOpponentChallenge,
        
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
