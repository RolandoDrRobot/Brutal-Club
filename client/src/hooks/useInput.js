import { useInput as useInputContext } from '../contexts/InputContext';

export const useCombatControls = () => {
  const { createTouchHandler } = useInputContext();
  
  const createAttackHandler = (attackType) => {
    return createTouchHandler(`attack_${attackType}`, {
      visualFeedback: true,
      hoverEffect: true
    });
  };
  
  const createBlockHandler = () => {
    return createTouchHandler('block', {
      visualFeedback: true,
      hoverEffect: true
    });
  };
  
  return {
    createAttackHandler,
    createBlockHandler
  };
};

