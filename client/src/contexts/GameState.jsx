import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EconomyProvider } from './EconomyContext';

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
    const saved = localStorage.getItem('brutalClubGameState');
    
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
    localStorage.setItem('brutalClubGameState', JSON.stringify(gameState));
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



  const registerVictory = useCallback((opponentId) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        totalWins: prev.totalWins + 1,
        totalFights: prev.totalFights + 1,
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


  const registerDefeat = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      totalFights: prev.totalFights + 1,
      defeatedOpponents: [],
      unlockedOpponents: ['tyler_1']
    }));
  }, []);


  const getNextOpponentToUnlock = (defeatedOpponentId) => {
    return GAME_CONFIG.OPPONENTS.find(opponent => 
      opponent.unlockRequirement === defeatedOpponentId
    );
  };

  const isOpponentUnlocked = (opponentId) => {
    return gameState.unlockedOpponents.includes(opponentId);
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
      isPurchased: gameState.purchasedCharacters.includes(character.id),
      canAfford: gameState.coins >= (character.price || 0)
    }));
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

    registerVictory,
    registerDefeat,

    isOpponentUnlocked,
    getOpponentsStatus,
    getShopCharactersStatus,

    GAME_CONFIG,
  };

  return (
    <GameStateContext.Provider value={contextValue}>
      <EconomyProvider 
        gameState={gameState} 
        setGameState={setGameState} 
        gameConfig={GAME_CONFIG}
      >
        {children}
      </EconomyProvider>
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