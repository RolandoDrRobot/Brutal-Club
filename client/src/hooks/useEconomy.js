import { useEconomy as useEconomyContext } from '../contexts/EconomyContext';

export const useEconomy = () => {
  return useEconomyContext();
};

export const useCurrency = () => {
  const { addCoins, spendCoins, canAfford } = useEconomyContext();
  
  return {
    addCoins,
    spendCoins,
    canAfford
  };
};

export const useCharacterEconomy = () => {
  const { 
    purchaseCharacter, 
    canAffordCharacter, 
    isCharacterPurchased,
    upgradeCharacterStat,
    getCharacterStats,
    canUpgradeStat
  } = useEconomyContext();
  
  return {
    purchaseCharacter,
    canAffordCharacter,
    isCharacterPurchased,
    upgradeCharacterStat,
    getCharacterStats,
    canUpgradeStat
  };
};

export const usePackSystem = () => {
  const { openPack } = useEconomyContext();
  
  return {
    openPack
  };
};

export const useRewards = () => {
  const { giveVictoryReward, startArcadeMode, addStatPoints } = useEconomyContext();
  
  return {
    giveVictoryReward,
    startArcadeMode,
    addStatPoints
  };
};
