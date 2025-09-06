import React, { createContext, useContext, useRef } from 'react';
import EconomyManager from '../systems/EconomyManager';

const EconomyContext = createContext({});

export const EconomyProvider = ({ children, gameState, setGameState, gameConfig }) => {
  const economyManagerRef = useRef(null);
  
  if (!economyManagerRef.current) {
    economyManagerRef.current = new EconomyManager(gameState, setGameState, gameConfig);
  } else {
    economyManagerRef.current.gameState = gameState;
    economyManagerRef.current.setGameState = setGameState;
  }
  
  const economyManager = economyManagerRef.current;
  
  const contextValue = {
    addCoins: (amount) => economyManager.addCoins(amount),
    spendCoins: (amount) => economyManager.spendCoins(amount),
    canAfford: (cost) => economyManager.canAfford(cost),
    purchaseCharacter: (characterId) => economyManager.purchaseCharacter(characterId),
    canAffordCharacter: (characterId) => economyManager.canAffordCharacter(characterId),
    isCharacterPurchased: (characterId) => economyManager.isCharacterPurchased(characterId),
    upgradeCharacterStat: (characterId, statName) => economyManager.upgradeCharacterStat(characterId, statName),
    addStatPoints: (amount) => economyManager.addStatPoints(amount),
    getCharacterStats: (characterId) => economyManager.getCharacterStats(characterId),
    canUpgradeStat: (characterId, statName) => economyManager.canUpgradeStat(characterId, statName),
    openPack: () => economyManager.openPack(),
    giveVictoryReward: (opponentId) => economyManager.giveVictoryReward(opponentId),
    startArcadeMode: () => economyManager.startArcadeMode(),
    economyManager
  };
  
  return (
    <EconomyContext.Provider value={contextValue}>
      {children}
    </EconomyContext.Provider>
  );
};

export const useEconomy = () => {
  const context = useContext(EconomyContext);
  if (!context) {
    throw new Error('useEconomy must be used within an EconomyProvider');
  }
  return context;
};
