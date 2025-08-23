import { THEME } from './constants';

/**
 * Base button style with common properties
 */
const getBaseButtonStyle = (isMobile) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  border: 'none',
  fontWeight: 700,
  borderRadius: '8px',
  textTransform: 'uppercase',
  fontFamily: THEME.fonts.primary,
  textShadow: THEME.shadows.button,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px'
});

/**
 * Get button style for shop/character cards
 */
export const getButtonStyle = (character, options = {}) => {
  const { 
    isMobile = false, 
    isOpponent = false, 
    fontSize = { mobile: '16px', desktop: '18px' }
  } = options;

  const baseStyle = {
    ...getBaseButtonStyle(isMobile),
    fontSize: isMobile ? fontSize.mobile : fontSize.desktop,
    letterSpacing: isOpponent ? '1px' : '2px',
    padding: isOpponent ? '8px 12px' : '0px',
    minHeight: isOpponent ? '36px' : 'auto'
  };

  if (isOpponent) {
    // Opponent button styling
    const isLocked = character.isLocked;
    return {
      ...baseStyle,
      color: isLocked ? THEME.colors.gray : THEME.colors.primary,
      cursor: isLocked ? 'not-allowed' : 'pointer'
    };
  } else {
    // Shop character button styling
    if (character.isPurchased) {
      return {
        ...baseStyle,
        color: THEME.colors.gold,
        cursor: 'default',
        boxShadow: 'none'
      };
    }
    
    const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
    return {
      ...baseStyle,
      color: isLocked ? THEME.colors.gray : THEME.colors.gold,
      cursor: isLocked ? 'not-allowed' : 'pointer',
      boxShadow: 'none'
    };
  }
};

/**
 * Get character card style
 */
export const getCharacterCardStyle = (character, options = {}) => {
  const { 
    isMobile = false, 
    isOpponent = false 
  } = options;

  const baseStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    border: '3px solid #f32210',
    borderRadius: '15px',
    padding: isMobile ? (isOpponent ? '10px' : '15px') : (isOpponent ? '15px' : '20px'),
    height: isMobile ? '200px' : '250px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    transition: 'all 0.3s ease',
    boxShadow: THEME.shadows.neon,
    overflow: 'hidden'
  };

  if (isOpponent) {
    // Opponent card styling
    const isLocked = character.isLocked;
    return {
      ...baseStyle,
      cursor: isLocked ? 'not-allowed' : 'pointer',
      opacity: isLocked ? 0.6 : 1,
      border: isLocked ? '3px solid #666' : '3px solid #f32210'
    };
  } else {
    // Shop character card styling
    if (character.isPurchased) {
      return {
        ...baseStyle,
        cursor: 'default',
        opacity: 1,
        border: '3px solid #FFD700'
      };
    }
    
    const isLocked = (character.price !== null && !character.canAfford && !character.isPurchased);
    return {
      ...baseStyle,
      cursor: isLocked ? 'not-allowed' : 'pointer',
      opacity: isLocked ? 0.6 : 1,
      border: isLocked ? '3px solid #666' : '3px solid #f32210'
    };
  }
}; 