import React, { createContext, useContext, useState, useEffect } from 'react';

const GameStateContext = createContext({});

// Configuración del juego
const GAME_CONFIG = {
  COINS_PER_WIN: 200,
  OPPONENTS: [
    {
      id: 'tyler',
      name: 'TYLER',
      model: 'Tyler',
      description: 'Soap maker with deadly skills',
      unlockRequirement: null, // Disponible desde el inicio
      coinReward: 200
    },
    {
      id: 'pete',
      name: 'PETE',
      model: 'pete',
      description: 'Construction worker with heavy fists',
      unlockRequirement: 'tyler', // Se desbloquea al vencer a Tyler
      coinReward: 200
    },
    {
      id: 'vince',
      name: 'VINCE',
      model: 'Vince',
      description: 'Fire fighter with burning rage',
      unlockRequirement: 'pete', // Se desbloquea al vencer a Pete
      coinReward: 200
    },
    {
      id: 'bob',
      name: 'BOB',
      model: 'Bob',
      description: 'Business man with corporate fury',
      unlockRequirement: 'vince', // Se desbloquea al vencer a Vince
      coinReward: 200
    }
  ],
  CHARACTERS_FOR_PURCHASE: [
    {
      id: 'pete',
      name: 'PETE',
      model: 'pete',
      description: 'Construction Worker',
      price: null, // Personaje inicial gratuito
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
  // Estado persistente del juego
  const [gameState, setGameState] = useState(() => {
    const savedState = localStorage.getItem('fightClubGameState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      console.log('🎮 Loading saved game state:', parsed);
      return parsed;
    }
    
    const initialState = {
      coins: 0,
      defeatedOpponents: [], // IDs de oponentes derrotados
      purchasedCharacters: ['pete'], // Pete es gratuito inicialmente
      unlockedOpponents: ['tyler'], // Solo Tyler está disponible al inicio
      totalWins: 0,
      totalFights: 0
    };
    
    console.log('🎮 Creating new game state with 0 coins:', initialState);
    return initialState;
  });

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('fightClubGameState', JSON.stringify(gameState));
    console.log('💾 Game state saved:', gameState);
  }, [gameState]);

  // Función para añadir monedas
  const addCoins = (amount) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  };

  // Función para gastar monedas
  const spendCoins = (amount) => {
    setGameState(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins - amount)
    }));
  };

  // Función para registrar una victoria
  const registerVictory = (opponentId) => {
    setGameState(prev => {
      const newState = {
        ...prev,
        totalWins: prev.totalWins + 1,
        totalFights: prev.totalFights + 1,
      };

      // Solo otorgar monedas si es la primera vez que derrotas a este oponente
      const isFirstTimeDefeating = !prev.defeatedOpponents.includes(opponentId);
      
      if (isFirstTimeDefeating) {
        // Primera victoria contra este oponente - otorgar monedas
        newState.coins = prev.coins + GAME_CONFIG.COINS_PER_WIN;
        newState.defeatedOpponents = [...prev.defeatedOpponents, opponentId];
        
        console.log(`🎉 First victory against ${opponentId}! Earned ${GAME_CONFIG.COINS_PER_WIN} coins`);
        
        // Desbloquear el siguiente oponente
        const nextOpponent = getNextOpponentToUnlock(opponentId);
        if (nextOpponent && !prev.unlockedOpponents.includes(nextOpponent.id)) {
          newState.unlockedOpponents = [...prev.unlockedOpponents, nextOpponent.id];
          console.log(`🔓 Unlocked new opponent: ${nextOpponent.name}`);
        }
      } else {
        // Victoria repetida - no otorgar monedas
        newState.coins = prev.coins; // Mantener las monedas actuales
        newState.defeatedOpponents = prev.defeatedOpponents; // Mantener la lista actual
        newState.unlockedOpponents = prev.unlockedOpponents; // Mantener oponentes desbloqueados
        
        console.log(`🔄 Repeat victory against ${opponentId} - no coins awarded`);
      }

      return newState;
    });
  };

  // Función para registrar una derrota
  const registerDefeat = () => {
    setGameState(prev => ({
      ...prev,
      totalFights: prev.totalFights + 1
    }));
  };

  // Función para comprar un personaje
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

  // Función para obtener el siguiente oponente a desbloquear
  const getNextOpponentToUnlock = (defeatedOpponentId) => {
    return GAME_CONFIG.OPPONENTS.find(opponent => 
      opponent.unlockRequirement === defeatedOpponentId
    );
  };

  // Función para verificar si un oponente está desbloqueado
  const isOpponentUnlocked = (opponentId) => {
    return gameState.unlockedOpponents.includes(opponentId);
  };

  // Función para verificar si un personaje está comprado
  const isCharacterPurchased = (characterId) => {
    return gameState.purchasedCharacters.includes(characterId);
  };

  // Función para verificar si puedes permitirte un personaje
  const canAffordCharacter = (characterId) => {
    const character = GAME_CONFIG.CHARACTERS_FOR_PURCHASE.find(c => c.id === characterId);
    if (!character || character.price === null) return false;
    return gameState.coins >= character.price;
  };

  // Función para obtener oponentes disponibles con su estado
  const getOpponentsStatus = () => {
    return GAME_CONFIG.OPPONENTS.map(opponent => ({
      ...opponent,
      isUnlocked: isOpponentUnlocked(opponent.id),
      isDefeated: gameState.defeatedOpponents.includes(opponent.id)
    }));
  };

  // Función para obtener personajes de la tienda con su estado
  const getShopCharactersStatus = () => {
    return GAME_CONFIG.CHARACTERS_FOR_PURCHASE.map(character => ({
      ...character,
      isPurchased: isCharacterPurchased(character.id),
      canAfford: canAffordCharacter(character.id)
    }));
  };

  // Función para resetear el juego (para desarrollo/testing)
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

  // Función para añadir monedas (para desarrollo/testing)
  const addDebugCoins = (amount = 1000) => {
    addCoins(amount);
  };

  // Función para limpiar completamente el localStorage y reiniciar
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
    console.log('🧹 Game data cleared, restarting with 0 coins:', initialState);
  };

  const contextValue = {
    // Estado del juego
    coins: gameState.coins,
    defeatedOpponents: gameState.defeatedOpponents,
    purchasedCharacters: gameState.purchasedCharacters,
    unlockedOpponents: gameState.unlockedOpponents,
    totalWins: gameState.totalWins,
    totalFights: gameState.totalFights,

    // Funciones de gestión de monedas
    addCoins,
    spendCoins,

    // Funciones de combate
    registerVictory,
    registerDefeat,

    // Funciones de tienda
    purchaseCharacter,
    isCharacterPurchased,
    canAffordCharacter,

    // Funciones de oponentes
    isOpponentUnlocked,
    getOpponentsStatus,
    getShopCharactersStatus,

    // Configuración del juego
    GAME_CONFIG,

    // Funciones de desarrollo/testing
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