import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameStateContext = createContext({});

// Game configuration
const GAME_CONFIG = {
  COINS_PER_WIN: 1,
  OPPONENTS: [
    {
      id: 'tyler_1',
      name: 'TYPER',
      model: 'Tyler',
      description: 'Soap maker with deadly skills',
      unlockRequirement: null, // Available from the start
      coinReward: 1
    },
    {
      id: 'pete_1',
      name: 'PETE',
      model: 'pete',
      description: 'Construction worker with heavy fists',
      unlockRequirement: 'tyler_1', // Unlocked by defeating Typer
      coinReward: 1
    },
    {
      id: 'tyler_2',
      name: 'TAYLER',
      model: 'Tyler',
      description: 'Final boss - ultimate challenger',
      unlockRequirement: 'pete_1', // Unlocked by defeating Pete
      coinReward: 1
    }
  ],
  CHARACTERS_FOR_PURCHASE: [
    {
      id: 'pete',
      name: 'PETE',
      model: 'pete',
      description: 'Construction Worker',
      price: null, // Free initial character
      emoji: '👷‍♂️',
      baseStats: { speed: 1, stamina: 1, strength: 1 }
    },
    {
      id: 'tyler',
      name: 'TYLER',
      model: 'Tyler',
      description: 'Soap Maker',
      price: 3,
      emoji: '🧔‍♂️',
      baseStats: { speed: 1, stamina: 1, strength: 1 }
    },
    {
      id: 'vince',
      name: 'VINCE',
      model: 'Vince',
      description: 'Fire Fighter',
      price: null, // Locked for now
      emoji: '🧑‍🚒',
      baseStats: { speed: 1, stamina: 1, strength: 1 }
    },
    {
      id: 'bob',
      name: 'BOB',
      model: 'Bob',
      description: 'Business Man',
      price: null, // Locked for now
      emoji: '👔',
      baseStats: { speed: 1, stamina: 1, strength: 1 }
    }
  ],
  STAT_CONFIG: {
    MAX_LEVEL: 10,
    UPGRADE_COST: 1, // Now using stat points instead of coins
    STAT_NAMES: {
      speed: 'SPEED',
      stamina: 'STAMINA', 
      strength: 'STRENGTH'
    },
    STAT_ICONS: {
      speed: 'SPD',
      stamina: 'STA', 
      strength: 'STR'
    }
  },
  PACK_CONFIG: {
    PACK_COST: 5, // Coins needed to buy one pack
    PACK_CONTENTS: {
      // Probabilities for pack contents (total should be 100)
      STAT_POINTS_COMMON: 60,    // 60% chance for 3-5 stat points
      STAT_POINTS_RARE: 30,      // 30% chance for 8-12 stat points  
      CHARACTER_LEGENDARY: 10    // 10% chance for a character
    },
    STAT_POINTS_RANGES: {
      COMMON: { min: 3, max: 5 },
      RARE: { min: 8, max: 12 }
    }
  }
};

export const GameStateProvider = ({ children }) => {
  // Persistent game state
  const [gameState, setGameState] = useState(() => {
    // Try to load saved state from localStorage
    const saved = localStorage.getItem('fightClubGameState');
    
    const initialState = {
      coins: 10, // Start with more coins for buying packs
      statPoints: 0, // New: stat points from packs
      defeatedOpponents: [], // IDs of defeated opponents
      purchasedCharacters: ['pete'], // Pete is free initially
      unlockedOpponents: ['tyler_1'], // Only first opponent available at start
      totalWins: 0,
      totalFights: 0,
      packsOpened: 0, // Track total packs opened
      characterStats: {
        // Initialize stats for owned characters
        'pete': { speed: 1, stamina: 1, strength: 1 }
      },
      version: 4 // Version to force updates if needed
    };
    
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Merge saved state with initial state to handle new properties
        return { ...initialState, ...parsedState };
      } catch (error) {
        console.warn('Failed to parse saved game state, starting fresh');
        return initialState;
      }
    }
    
    return initialState;
  });

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('fightClubGameState', JSON.stringify(gameState));
  }, [gameState]);

  // Emergency coin system - give 3 coins if player has 0 coins and no progress (only for completely new players)
  useEffect(() => {
    // Solo activar para jugadores completamente nuevos que nunca han jugado
    const isCompletelyNewPlayer = gameState.coins === 0 && 
        gameState.defeatedOpponents.length === 0 && 
        gameState.totalWins === 0 && 
        gameState.totalFights === 0 &&
        gameState.purchasedCharacters.length === 1 && // Only Pete purchased (free character)
        gameState.characterStats['pete'] && 
        gameState.characterStats['pete'].speed === 1 &&
        gameState.characterStats['pete'].stamina === 1 &&
        gameState.characterStats['pete'].strength === 1; // Stats at base level
    
    if (isCompletelyNewPlayer) {
      setGameState(prev => ({
        ...prev,
        coins: 3 // Emergency coins to prevent being stuck (only for completely new players)
      }));
    }
  }, [gameState.coins, gameState.defeatedOpponents.length, gameState.totalWins, gameState.totalFights, gameState.purchasedCharacters.length, gameState.characterStats]);

  // Function to add coins
  const addCoins = (amount) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  };

  // Function to spend coins
  const spendCoins = (amount) => {
    setGameState(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins - amount)
    }));
  };

  // Function to register a victory
  const registerVictory = useCallback((opponentId) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        totalWins: prev.totalWins + 1,
        totalFights: prev.totalFights + 1,
        coins: prev.coins + GAME_CONFIG.COINS_PER_WIN, // Always award 1 coin per victory
      };

      // Track defeated opponents for progression
      const isFirstTimeDefeating = !prev.defeatedOpponents.includes(opponentId);
      
      if (isFirstTimeDefeating) {
        // First victory against this opponent - unlock next opponent
        newState.defeatedOpponents = [...prev.defeatedOpponents, opponentId];
        
        // Unlock the next opponent
        const nextOpponent = getNextOpponentToUnlock(opponentId);
        if (nextOpponent && !prev.unlockedOpponents.includes(nextOpponent.id)) {
          newState.unlockedOpponents = [...prev.unlockedOpponents, nextOpponent.id];
        }
      } else {
        // Repeat victory - keep current progression but still award coins
        newState.defeatedOpponents = prev.defeatedOpponents;
        newState.unlockedOpponents = prev.unlockedOpponents;
      }

      return newState;
    });
    }, []);

  // Function to start arcade mode (pay entry fee)
  const startArcadeMode = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins - 1) // Pay 1 coin to start arcade
    }));
  }, []);

  // Function to register a defeat - ARCADE MODE: Reset progress on loss
  const registerDefeat = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      totalFights: prev.totalFights + 1,
      // ARCADE MODE RESET: Lose all progress
      defeatedOpponents: [], // Reset all defeated opponents
      unlockedOpponents: ['tyler_1'] // Reset to only first opponent (TYPER)
      // Note: No coin deduction here since we pay when starting
    }));
  }, []);

  // Function to purchase a character
  const purchaseCharacter = (characterId) => {
    const character = GAME_CONFIG.CHARACTERS_FOR_PURCHASE.find(c => c.id === characterId);
    if (!character || character.price === null) return false;
    
    if (gameState.coins >= character.price && !gameState.purchasedCharacters.includes(characterId)) {
      setGameState(prev => ({
        ...prev,
        coins: prev.coins - character.price,
        purchasedCharacters: [...prev.purchasedCharacters, characterId],
        // Initialize stats for new character
        characterStats: {
          ...prev.characterStats,
          [characterId]: character.baseStats
        }
      }));
      return true;
    }
    return false;
  };

  // Function to upgrade character stat (now uses stat points instead of coins)
  const upgradeCharacterStat = (characterId, statName) => {
    const currentStats = gameState.characterStats[characterId];
    if (!currentStats) return false;
    
    const currentLevel = currentStats[statName];
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = GAME_CONFIG.STAT_CONFIG.UPGRADE_COST;
    
    // Check if upgrade is possible (now using stat points)
    if (currentLevel >= maxLevel || gameState.statPoints < upgradeCost) {
      return false;
    }
    
    setGameState(prev => ({
      ...prev,
      statPoints: prev.statPoints - upgradeCost,
      characterStats: {
        ...prev.characterStats,
        [characterId]: {
          ...prev.characterStats[characterId],
          [statName]: currentLevel + 1
        }
      }
    }));
    return true;
  };

  // Function to generate random pack contents
  const generatePackContents = () => {
    const { PACK_CONTENTS, STAT_POINTS_RANGES } = GAME_CONFIG.PACK_CONFIG;
    const availableCharacters = GAME_CONFIG.CHARACTERS_FOR_PURCHASE.filter(
      char => char.price !== null && !gameState.purchasedCharacters.includes(char.id)
    );
    
    const roll = Math.random() * 100;
    
    if (roll < PACK_CONTENTS.CHARACTER_LEGENDARY && availableCharacters.length > 0) {
      // Legendary character pull!
      const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
      return [{
        type: 'character',
        id: randomCharacter.id,
        name: randomCharacter.name,
        description: randomCharacter.description,
        emoji: randomCharacter.emoji
      }];
    } else if (roll < PACK_CONTENTS.CHARACTER_LEGENDARY + PACK_CONTENTS.STAT_POINTS_RARE) {
      // Rare stat points
      const amount = Math.floor(Math.random() * (STAT_POINTS_RANGES.RARE.max - STAT_POINTS_RANGES.RARE.min + 1)) + STAT_POINTS_RANGES.RARE.min;
      return [{
        type: 'stat_points',
        name: 'Rare Stat Points',
        amount: amount
      }];
    } else {
      // Common stat points
      const amount = Math.floor(Math.random() * (STAT_POINTS_RANGES.COMMON.max - STAT_POINTS_RANGES.COMMON.min + 1)) + STAT_POINTS_RANGES.COMMON.min;
      return [{
        type: 'stat_points',
        name: 'Stat Points',
        amount: amount
      }];
    }
  };

  // Function to open a pack
  const openPack = () => {
    const packCost = GAME_CONFIG.PACK_CONFIG.PACK_COST;
    
    if (gameState.coins < packCost) {
      return { success: false, reason: 'insufficient_coins' };
    }
    
    const contents = generatePackContents();
    
    setGameState(prev => {
      const newState = {
        ...prev,
        coins: prev.coins - packCost,
        packsOpened: prev.packsOpened + 1
      };
      
      // Process each item in the pack
      contents.forEach(item => {
        if (item.type === 'character') {
          // Add character to purchased characters
          newState.purchasedCharacters = [...prev.purchasedCharacters, item.id];
          
          // Initialize stats for new character
          const character = GAME_CONFIG.CHARACTERS_FOR_PURCHASE.find(c => c.id === item.id);
          if (character) {
            newState.characterStats = {
              ...newState.characterStats,
              [item.id]: character.baseStats
            };
          }
        } else if (item.type === 'stat_points') {
          // Add stat points
          newState.statPoints = prev.statPoints + item.amount;
        }
      });
      
      return newState;
    });
    
    return { success: true, contents };
  };

  // Function to get character stats
  const getCharacterStats = (characterId) => {
    return gameState.characterStats[characterId] || { speed: 1, stamina: 1, strength: 1 };
  };

  // Function to get the next opponent to unlock
  const getNextOpponentToUnlock = (defeatedOpponentId) => {
    return GAME_CONFIG.OPPONENTS.find(opponent => 
      opponent.unlockRequirement === defeatedOpponentId
    );
  };

  // Function to check if an opponent is unlocked
  const isOpponentUnlocked = (opponentId) => {
    return gameState.unlockedOpponents.includes(opponentId);
  };

  // Function to check if a character is purchased
  const isCharacterPurchased = (characterId) => {
    return gameState.purchasedCharacters.includes(characterId);
  };

  // Function to check if you can afford a character
  const canAffordCharacter = (characterId) => {
    const character = GAME_CONFIG.CHARACTERS_FOR_PURCHASE.find(c => c.id === characterId);
    if (!character || character.price === null) return false;
    return gameState.coins >= character.price;
  };

  // Function to get available opponents with their status
  const getOpponentsStatus = () => {
    return GAME_CONFIG.OPPONENTS.map(opponent => ({
      ...opponent,
      isUnlocked: isOpponentUnlocked(opponent.id),
      isDefeated: gameState.defeatedOpponents.includes(opponent.id)
    }));
  };

  // Function to get shop characters with their status
  const getShopCharactersStatus = () => {
    return GAME_CONFIG.CHARACTERS_FOR_PURCHASE.map(character => ({
      ...character,
      isPurchased: isCharacterPurchased(character.id),
      canAfford: canAffordCharacter(character.id)
    }));
  };

  // Function to reset the game (for development/testing)
  const resetGameState = () => {
    const initialState = {
      coins: 3,
      defeatedOpponents: [],
      purchasedCharacters: ['pete'],
      unlockedOpponents: ['tyler_1'], // Only first opponent available at start
      totalWins: 0,
      totalFights: 0,
      version: 2
    };
    setGameState(initialState);
    localStorage.setItem('fightClubGameState', JSON.stringify(initialState));
  };

  // Function to add coins (for development/testing)
  const addDebugCoins = (amount = 1000) => {
    addCoins(amount);
  };

  // Function to completely clear localStorage and restart
  const clearSavedData = () => {
    localStorage.removeItem('fightClubGameState');
    const initialState = {
      coins: 3,
      defeatedOpponents: [],
      purchasedCharacters: ['pete'],
      unlockedOpponents: ['tyler_1'], // Only first opponent available at start
      totalWins: 0,
      totalFights: 0,
      version: 2
    };
    setGameState(initialState);
  };

  const contextValue = {
    // Game state
    coins: gameState.coins,
    statPoints: gameState.statPoints,
    defeatedOpponents: gameState.defeatedOpponents,
    purchasedCharacters: gameState.purchasedCharacters,
    unlockedOpponents: gameState.unlockedOpponents,
    totalWins: gameState.totalWins,
    totalFights: gameState.totalFights,
    packsOpened: gameState.packsOpened,

    // Coin management functions
    addCoins,
    spendCoins,

    // Pack system functions
    openPack,
    generatePackContents,

    // Combat functions
    registerVictory,
    registerDefeat,
    startArcadeMode,

    // Shop functions (legacy - now mainly for pack system)
    purchaseCharacter,
    isCharacterPurchased,
    canAffordCharacter,

    // Character stat functions
    upgradeCharacterStat,
    getCharacterStats,

    // Opponent functions
    isOpponentUnlocked,
    getOpponentsStatus,
    getShopCharactersStatus,

    // Game configuration
    GAME_CONFIG,

    // Development/testing functions
    resetGameState,
    addDebugCoins,
    clearSavedData,
  };

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}; 