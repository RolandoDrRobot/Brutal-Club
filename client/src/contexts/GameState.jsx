import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameStateContext = createContext({});

const GAME_CONFIG = {
  COINS_PER_WIN: 1,
  OPPONENTS: [
    {
      id: 'tyler_1',
      name: 'TYPER',
      model: 'Tyler',
      description: 'Soap maker with deadly skills',
      unlockRequirement: null,
      coinReward: 1
    },
    {
      id: 'pete_1',
      name: 'PETE',
      model: 'pete',
      description: 'Construction worker with heavy fists',
      unlockRequirement: 'tyler_1',
      coinReward: 1
    },
    {
      id: 'tyler_2',
      name: 'TAYLER',
      model: 'Tyler',
      description: 'Final boss - ultimate challenger',
      unlockRequirement: 'pete_1',
      coinReward: 1
    }
  ],
  CHARACTERS_FOR_PURCHASE: [
    {
      id: 'pete',
      name: 'PETE',
      model: 'pete',
      description: 'Construction Worker',
      price: null,
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
      price: null,
      emoji: '🧑‍🚒',
      baseStats: { speed: 1, stamina: 1, strength: 1 }
    },
    {
      id: 'bob',
      name: 'BOB',
      model: 'Bob',
      description: 'Business Man',
      price: null,
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
  },
  PACK_CONFIG: {
    PACK_COST: 5,
    PACK_CONTENTS: {
      STAT_POINTS_COMMON: 60,
      STAT_POINTS_RARE: 30,
      CHARACTER_LEGENDARY: 10
    },
    STAT_POINTS_RANGES: {
      COMMON: { min: 3, max: 5 },
      RARE: { min: 8, max: 12 }
    }
  }
};

export const GameStateProvider = ({ children }) => {
  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem('fightClubGameState');
    
    const initialState = {
      coins: 100,
      statPoints: 0,
      defeatedOpponents: [],
      purchasedCharacters: ['pete'],
      unlockedOpponents: ['tyler_1'],
      totalWins: 0,
      totalFights: 0,
      packsOpened: 0,
      characterStats: {
        'pete': { speed: 1, stamina: 1, strength: 1 }
      },
      version: 6
    };
    
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        if (!parsedState.version || parsedState.version < 6) {
          parsedState.coins = 100;
          parsedState.version = 6;
        }
        return { ...initialState, ...parsedState };
      } catch (error) {
        return initialState;
      }
    }
    
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('fightClubGameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    const isCompletelyNewPlayer = gameState.coins === 0 && 
        gameState.defeatedOpponents.length === 0 && 
        gameState.totalWins === 0 && 
        gameState.totalFights === 0 &&
        gameState.purchasedCharacters.length === 1 &&
        gameState.characterStats['pete'] && 
        gameState.characterStats['pete'].speed === 1 &&
        gameState.characterStats['pete'].stamina === 1 &&
        gameState.characterStats['pete'].strength === 1;
    
    if (isCompletelyNewPlayer) {
      setGameState(prev => ({
        ...prev,
        coins: 3
      }));
    }
  }, [gameState.coins, gameState.defeatedOpponents.length, gameState.totalWins, gameState.totalFights, gameState.purchasedCharacters.length, gameState.characterStats]);

  const addCoins = (amount) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  };

  const spendCoins = (amount) => {
    setGameState(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins - amount)
    }));
  };

  const registerVictory = useCallback((opponentId) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        totalWins: prev.totalWins + 1,
        totalFights: prev.totalFights + 1,
        coins: prev.coins + GAME_CONFIG.COINS_PER_WIN,
      };

      const isFirstTimeDefeating = !prev.defeatedOpponents.includes(opponentId);
      
      if (isFirstTimeDefeating) {
        newState.defeatedOpponents = [...prev.defeatedOpponents, opponentId];
        
        const nextOpponent = getNextOpponentToUnlock(opponentId);
        if (nextOpponent && !prev.unlockedOpponents.includes(nextOpponent.id)) {
          newState.unlockedOpponents = [...prev.unlockedOpponents, nextOpponent.id];
        }
      } else {
        newState.defeatedOpponents = prev.defeatedOpponents;
        newState.unlockedOpponents = prev.unlockedOpponents;
      }

      return newState;
    });
    }, []);

  const startArcadeMode = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins - 1)
    }));
  }, []);

  const registerDefeat = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      totalFights: prev.totalFights + 1,
      defeatedOpponents: [],
      unlockedOpponents: ['tyler_1']
    }));
  }, []);

  const purchaseCharacter = (characterId) => {
    const character = GAME_CONFIG.CHARACTERS_FOR_PURCHASE.find(c => c.id === characterId);
    if (!character || character.price === null) return false;
    
    if (gameState.coins >= character.price && !gameState.purchasedCharacters.includes(characterId)) {
      setGameState(prev => ({
        ...prev,
        coins: prev.coins - character.price,
        purchasedCharacters: [...prev.purchasedCharacters, characterId],
        characterStats: {
          ...prev.characterStats,
          [characterId]: character.baseStats
        }
      }));
      return true;
    }
    return false;
  };

  const upgradeCharacterStat = (characterId, statName) => {
    const currentStats = gameState.characterStats[characterId];
    if (!currentStats) return false;
    
    const currentLevel = currentStats[statName];
    const maxLevel = GAME_CONFIG.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = GAME_CONFIG.STAT_CONFIG.UPGRADE_COST;
    
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

  const generatePackContents = () => {
    const { PACK_CONTENTS, STAT_POINTS_RANGES } = GAME_CONFIG.PACK_CONFIG;
    const availableCharacters = GAME_CONFIG.CHARACTERS_FOR_PURCHASE.filter(
      char => char.price !== null && !gameState.purchasedCharacters.includes(char.id)
    );
    
    const roll = Math.random() * 100;
    
    if (roll < PACK_CONTENTS.CHARACTER_LEGENDARY && availableCharacters.length > 0) {
      const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
      return [{
        type: 'character',
        id: randomCharacter.id,
        name: randomCharacter.name,
        description: randomCharacter.description,
        emoji: randomCharacter.emoji
      }];
    } else if (roll < PACK_CONTENTS.CHARACTER_LEGENDARY + PACK_CONTENTS.STAT_POINTS_RARE) {
      const amount = Math.floor(Math.random() * (STAT_POINTS_RANGES.RARE.max - STAT_POINTS_RANGES.RARE.min + 1)) + STAT_POINTS_RANGES.RARE.min;
      return [{
        type: 'stat_points',
        name: 'Rare Stat Points',
        amount: amount
      }];
    } else {
      const amount = Math.floor(Math.random() * (STAT_POINTS_RANGES.COMMON.max - STAT_POINTS_RANGES.COMMON.min + 1)) + STAT_POINTS_RANGES.COMMON.min;
      return [{
        type: 'stat_points',
        name: 'Stat Points',
        amount: amount
      }];
    }
  };

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
      
      contents.forEach(item => {
        if (item.type === 'character') {
          newState.purchasedCharacters = [...prev.purchasedCharacters, item.id];
          
          const character = GAME_CONFIG.CHARACTERS_FOR_PURCHASE.find(c => c.id === item.id);
          if (character) {
            newState.characterStats = {
              ...newState.characterStats,
              [item.id]: character.baseStats
            };
          }
        } else if (item.type === 'stat_points') {
          newState.statPoints = prev.statPoints + item.amount;
        }
      });
      
      return newState;
    });
    
    return { success: true, contents };
  };

  const getCharacterStats = (characterId) => {
    return gameState.characterStats[characterId] || { speed: 1, stamina: 1, strength: 1 };
  };

  const getNextOpponentToUnlock = (defeatedOpponentId) => {
    return GAME_CONFIG.OPPONENTS.find(opponent => 
      opponent.unlockRequirement === defeatedOpponentId
    );
  };

  const isOpponentUnlocked = (opponentId) => {
    return gameState.unlockedOpponents.includes(opponentId);
  };

  const isCharacterPurchased = (characterId) => {
    return gameState.purchasedCharacters.includes(characterId);
  };

  const canAffordCharacter = (characterId) => {
    const character = GAME_CONFIG.CHARACTERS_FOR_PURCHASE.find(c => c.id === characterId);
    if (!character || character.price === null) return false;
    return gameState.coins >= character.price;
  };

  const getOpponentsStatus = () => {
    return GAME_CONFIG.OPPONENTS.map(opponent => ({
      ...opponent,
      isUnlocked: isOpponentUnlocked(opponent.id),
      isDefeated: gameState.defeatedOpponents.includes(opponent.id)
    }));
  };

  const getShopCharactersStatus = () => {
    return GAME_CONFIG.CHARACTERS_FOR_PURCHASE.map(character => ({
      ...character,
      isPurchased: isCharacterPurchased(character.id),
      canAfford: canAffordCharacter(character.id)
    }));
  };

  const resetGameState = () => {
    const initialState = {
      coins: 3,
      defeatedOpponents: [],
      purchasedCharacters: ['pete'],
      unlockedOpponents: ['tyler_1'],
      totalWins: 0,
      totalFights: 0,
      version: 2
    };
    setGameState(initialState);
    localStorage.setItem('fightClubGameState', JSON.stringify(initialState));
  };

  const addDebugCoins = (amount = 1000) => {
    addCoins(amount);
  };

  const clearSavedData = () => {
    localStorage.removeItem('fightClubGameState');
    const initialState = {
      coins: 3,
      defeatedOpponents: [],
      purchasedCharacters: ['pete'],
      unlockedOpponents: ['tyler_1'],
      totalWins: 0,
      totalFights: 0,
      version: 2
    };
    setGameState(initialState);
  };

  const contextValue = {
    coins: gameState.coins,
    statPoints: gameState.statPoints,
    defeatedOpponents: gameState.defeatedOpponents,
    purchasedCharacters: gameState.purchasedCharacters,
    unlockedOpponents: gameState.unlockedOpponents,
    totalWins: gameState.totalWins,
    totalFights: gameState.totalFights,
    packsOpened: gameState.packsOpened,

    addCoins,
    spendCoins,

    openPack,
    generatePackContents,

    registerVictory,
    registerDefeat,
    startArcadeMode,

    purchaseCharacter,
    isCharacterPurchased,
    canAffordCharacter,

    upgradeCharacterStat,
    getCharacterStats,

    isOpponentUnlocked,
    getOpponentsStatus,
    getShopCharactersStatus,

    GAME_CONFIG,

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