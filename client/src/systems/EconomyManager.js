class EconomyManager {
  constructor(gameState, setGameState, gameConfig) {
    this.gameState = gameState;
    this.setGameState = setGameState;
    this.config = gameConfig;
  }

  addCoins(amount) {
    this.setGameState(prev => ({
      ...prev,
      coins: prev.coins + amount
    }));
  }

  spendCoins(amount) {
    if (this.gameState.coins < amount) {
      return false;
    }
    
    this.setGameState(prev => ({
      ...prev,
      coins: prev.coins - amount
    }));
    
    return true;
  }

  canAfford(cost) {
    return this.gameState.coins >= cost;
  }

  purchaseCharacter(characterId) {
    const character = this.config.CHARACTERS_FOR_PURCHASE.find(c => c.id === characterId);
    if (!character || character.price === null) return false;
    
    if (this.gameState.coins >= character.price && !this.gameState.purchasedCharacters.includes(characterId)) {
      this.setGameState(prev => ({
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
  }

  canAffordCharacter(characterId) {
    const character = this.config.CHARACTERS_FOR_PURCHASE.find(c => c.id === characterId);
    if (!character || character.price === null) return false;
    return this.gameState.coins >= character.price;
  }

  isCharacterPurchased(characterId) {
    return this.gameState.purchasedCharacters.includes(characterId);
  }

  upgradeCharacterStat(characterId, statName) {
    const currentStats = this.gameState.characterStats[characterId];
    if (!currentStats) return false;
    
    const currentLevel = currentStats[statName];
    const maxLevel = this.config.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = this.config.STAT_CONFIG.UPGRADE_COST;
    
    if (currentLevel >= maxLevel || this.gameState.statPoints < upgradeCost) {
      return false;
    }
    
    this.setGameState(prev => ({
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
  }

  addStatPoints(amount) {
    this.setGameState(prev => ({
      ...prev,
      statPoints: prev.statPoints + amount
    }));
  }

  getCharacterStats(characterId) {
    return this.gameState.characterStats[characterId] || { speed: 1, stamina: 1, strength: 1 };
  }

  openPack() {
    const packCost = this.config.PACK_CONFIG.PACK_COST;
    
    if (this.gameState.coins < packCost) {
      return { success: false, reason: 'insufficient_coins' };
    }
    
    const { PACK_CONTENTS, STAT_POINTS_RANGES } = this.config.PACK_CONFIG;
    const availableCharacters = this.config.CHARACTERS_FOR_PURCHASE.filter(
      char => char.price !== null && !this.gameState.purchasedCharacters.includes(char.id)
    );
    
    const roll = Math.random() * 100;
    let contents;
    
    if (roll < PACK_CONTENTS.CHARACTER_LEGENDARY && availableCharacters.length > 0) {
      const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
      contents = [{
        type: 'character',
        id: randomCharacter.id,
        name: randomCharacter.name,
        description: randomCharacter.description,
        emoji: randomCharacter.emoji
      }];
    } else if (roll < PACK_CONTENTS.CHARACTER_LEGENDARY + PACK_CONTENTS.STAT_POINTS_RARE) {
      const amount = Math.floor(Math.random() * (STAT_POINTS_RANGES.RARE.max - STAT_POINTS_RANGES.RARE.min + 1)) + STAT_POINTS_RANGES.RARE.min;
      contents = [{
        type: 'stat_points',
        name: 'Rare Stat Points',
        amount: amount
      }];
    } else {
      const amount = Math.floor(Math.random() * (STAT_POINTS_RANGES.COMMON.max - STAT_POINTS_RANGES.COMMON.min + 1)) + STAT_POINTS_RANGES.COMMON.min;
      contents = [{
        type: 'stat_points',
        name: 'Stat Points',
        amount: amount
      }];
    }
    
    this.setGameState(prev => {
      const newState = {
        ...prev,
        coins: prev.coins - packCost,
        packsOpened: prev.packsOpened + 1
      };
      
      contents.forEach(item => {
        if (item.type === 'character') {
          newState.purchasedCharacters = [...prev.purchasedCharacters, item.id];
          
          const character = this.config.CHARACTERS_FOR_PURCHASE.find(c => c.id === item.id);
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
  }

  giveVictoryReward(opponentId) {
    const coinsReward = this.config.COINS_PER_WIN;
    this.addCoins(coinsReward);
    return coinsReward;
  }

  startArcadeMode() {
    const arcadeCost = 1;
    if (this.spendCoins(arcadeCost)) {
      return true;
    }
    return false;
  }

  canUpgradeStat(characterId, statName) {
    const currentStats = this.gameState.characterStats[characterId];
    if (!currentStats) return false;
    
    const currentLevel = currentStats[statName];
    const maxLevel = this.config.STAT_CONFIG.MAX_LEVEL;
    const upgradeCost = this.config.STAT_CONFIG.UPGRADE_COST;
    
    return currentLevel < maxLevel && this.gameState.statPoints >= upgradeCost;
  }
}

export default EconomyManager;
