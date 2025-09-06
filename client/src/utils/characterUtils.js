import { CHARACTER_MODELS } from './constants';

export const getModelPath = (characterName) => {
  const upperName = characterName?.toUpperCase();
  return CHARACTER_MODELS.paths[upperName] || CHARACTER_MODELS.paths['PETE'];
};

export const getCharacterComponent = (characterModel) => {
  const lowerModel = characterModel?.toLowerCase();
  return CHARACTER_MODELS.components[lowerModel] || 'Pete';
};

export const getCharacterTransforms = (isCombatMode) => {
  if (isCombatMode) {
    return {
      player1: {
        position: [-0.5, 0, 0],
        rotation: [0, Math.PI / 2, 0]
      },
      player2: {
        position: [0.5, 0, 0], 
        rotation: [0, -Math.PI / 2, 0]
      }
    };
  } else {
    return {
      player1: {
        position: [-0.5, 0, 0],
        rotation: [0, Math.PI / 2, 0]
      },
      player2: {
        position: [0.5, 0, 0],
        rotation: [0, -Math.PI / 2, 0]
      }
    };
  }
}; 