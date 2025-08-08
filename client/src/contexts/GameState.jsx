import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameStateContext = createContext({});

// Game configuration
const GAME_CONFIG = {
  COINS_PER_WIN: 200,
  OPPONENTS: [
    {
      id: 'tyler',
      name: 'TYLER',
      model: 'Tyler',
      description: 'Soap maker with deadly skills',
      unlockRequirement: null, // Available from the start
      coinReward: 200
    },
    {
      id: 'pete',
      name: 'PETE',
      model: 'pete',
      description: 'Construction worker with heavy fists',
      unlockRequirement: 'tyler', // Unlocked by defeating Tyler
      coinReward: 200
    }
  ],
  CHARACTERS_FOR_PURCHASE: [
    {
      id: 'pete',
      name: 'PETE',
      model: 'pete',
      description: 'Construction Worker',
      price: null, // Free initial character
      emoji: '👷‍♂️'
    },
    {
      id: 'tyler',
      name: 'TYLER',
      model: 'Tyler',
      description: 'Soap Maker',
      price: 200,
      emoji: '🧔‍♂️'
    },
    {
      id: 'vince',
      name: 'VINCE',
      model: 'Vince',
      description: 'Fire Fighter',
      price: 600,
      emoji: '🧑‍🚒'
    },
    {
      id: 'bob',
      name: 'BOB',
      model: 'Bob',
      description: 'Business Man',
      price: 800,
      emoji: '👔'
    }
  ]
};

export const GameStateProvider = ({ children }) => {
  // Persistent game state
  const [gameState, setGameState] = useState(() => {
    const savedState = localStorage.getItem('fightClubGameState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      return parsed;
    }
    
    const initialState = {
      coins: 0,
      defeatedOpponents: [], // IDs of defeated opponents
      purchasedCharacters: ['pete'], // Pete is free initially
      unlockedOpponents: ['tyler'], // Only Tyler is available at the start
      totalWins: 0,
      totalFights: 0
    };
    
    return initialState;
  });

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('fightClubGameState', JSON.stringify(gameState));
  }, [gameState]);

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

  // Function to register a defeat
  const registerDefeat = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      totalFights: prev.totalFights + 1
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
        purchasedCharacters: [...prev.purchasedCharacters, characterId]
      }));
      return true;
    }
    return false;
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
      coins: 0,
      defeatedOpponents: [],
      purchasedCharacters: ['pete'],
      unlockedOpponents: ['tyler'],
      totalWins: 0,
      totalFights: 0
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
      coins: 0,
      defeatedOpponents: [],
      purchasedCharacters: ['pete'],
      unlockedOpponents: ['tyler'],
      totalWins: 0,
      totalFights: 0
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

    // Shop functions
    purchaseCharacter,
    isCharacterPurchased,
    canAffordCharacter,

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