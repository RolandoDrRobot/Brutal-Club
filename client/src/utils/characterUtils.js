import { CHARACTER_MODELS } from './constants';

/**
 * Get model path for a character by name
 */
export const getModelPath = (characterName) => {
  const upperName = characterName?.toUpperCase();
  return CHARACTER_MODELS.paths[upperName] || CHARACTER_MODELS.paths['PETE'];
};

/**
 * Get component type for character rendering
 */
export const getCharacterComponent = (characterModel) => {
  const lowerModel = characterModel?.toLowerCase();
  return CHARACTER_MODELS.components[lowerModel] || 'Pete';
};

/**
 * Character transforms for combat vs sync mode
 */
export const getCharacterTransforms = (isCombatMode) => {
  if (isCombatMode) {
    // Combat mode: facing each other
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
    // Sync mode: same distance but facing front
    return {
      player1: {
        position: [-0.5, 0, 0],
        rotation: [0, 0, 0]
      },
      player2: {
        position: [0.5, 0, 0],
        rotation: [0, 0, 0]
      }
    };
  }
}; 