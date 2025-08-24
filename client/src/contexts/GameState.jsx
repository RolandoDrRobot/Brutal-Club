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
      price: 5,
      emoji: '🧔‍♂️',
      baseStats: { speed: 1, stamina: 1, strength: 1 }
    },
    {
      id: 'vince',
      name: 'VINCE',
      model: 'Vince',
      description: 'Fire Fighter',
      price: 5,
      emoji: '🧑‍🚒',
      baseStats: { speed: 1, stamina: 1, strength: 1 }
    },
    {
      id: 'bob',
      name: 'BOB',
      model: 'Bob',
      description: 'Business Man',
      price: 5,
      emoji: '👔',
      baseStats: { speed: 1, stamina: 1, strength: 1 }
    }
  ],
  STAT_CONFIG: {
    MAX_LEVEL: 10,
    UPGRADE_COST: 1,
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
  }
};

export const GameStateProvider = ({ children }) => {
  // Persistent game state
  const [gameState, setGameState] = useState(() => {
    // Force reset to new progression system - remove this after testing
    localStorage.removeItem('fightClubGameState');
    
    const initialState = {
      coins: 1,
      defeatedOpponents: [], // IDs of defeated opponents
      purchasedCharacters: ['pete'], // Pete is free initially
      unlockedOpponents: ['tyler_1'], // Only first opponent available at start
      totalWins: 0,
      totalFights: 0,
      characterStats: {
        // Initialize stats for owned characters
        'pete': { speed: 1, stamina: 1, strength: 1 }
      },
      version: 3 // Version to force updates if needed
    };
    
    return initialState;
  });

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('fightClubGameState', JSON.stringify(gameState));
  }, [gameState]);

  // Emergency coin system - give 1 coin if player has 0 coins and no progress
  useEffect(() => {
    if (gameState.coins === 0 && gameState.defeatedOpponents.length === 0) {
      setGameState(prev => ({
        ...prev,
        coins: 1 // Emergency coin to prevent being stuck
      }));
    }
  }, [gameState.coins, gameState.defeatedOpponents.length]);

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
      };

      // Only award coins if it's the first time defeating this opponent
      const isFirstTimeDefeating = !prev.defeatedOpponents.includes(opponentId);
      
      if (isFirstTimeDefeating) {
        // First victory against this opponent - award coins
        newState.coins = prev.coins + GAME_CONFIG.COINS_PER_WIN;
        newState.defeatedOpponents = [...prev.defeatedOpponents, opponentId];
        
        // Unlock the next opponent
        const nextOpponent = getNextOpponentToUnlock(opponentId);
        if (nextOpponent && !prev.unlockedOpponents.includes(nextOpponent.id)) {
          newState.unlockedOpponents = [...prev.unlockedOpponents, nextOpponent.id];
        }
      } else {
        // Repeat victory - no coins awarded
        newState.coins = prev.coins; // Keep current coins
        newState.defeatedOpponents = prev.defeatedOpponents; // Keep current list
        newState.unlockedOpponents = prev.unlockedOpponents; // Keep unlocked opponents
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

  // Function to upgrade character stat
  const upgradeCharacterStat = (characterId, statName) => {
    const currentStats = gameState.characterStats[characterId];
    if (!currentStats) return false;
    
    const currentLevel = currentStats[statName];
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = GAME_CONFIG.STAT_CONFIG.UPGRADE_COST;
    
    // Check if upgrade is possible
    if (currentLevel >= maxLevel || gameState.coins < upgradeCost) {
      return false;
    }
    
    setGameState(prev => ({
      ...prev,
      coins: prev.coins - upgradeCost,
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
      coins: 1,
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
      coins: 1,
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
    defeatedOpponents: gameState.defeatedOpponents,
    purchasedCharacters: gameState.purchasedCharacters,
    unlockedOpponents: gameState.unlockedOpponents,
    totalWins: gameState.totalWins,
    totalFights: gameState.totalFights,

    // Coin management functions
    addCoins,
    spendCoins,

    // Combat functions
    registerVictory,
    registerDefeat,
    startArcadeMode,

    // Shop functions
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