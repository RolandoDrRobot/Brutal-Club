import { useEffects as useEffectsContext } from '../contexts/EffectContext';

export const useParticleEffects = () => {
  const { createParticleEffect } = useEffectsContext();
  
  const createPackOpeningEffect = (options) => {
    return createParticleEffect('packOpening', options);
  };
  
  const createStatUpgradeEffect = (options) => {
    return createParticleEffect('statUpgrade', options);
  };
  
  return {
    createPackOpeningEffect,
    createStatUpgradeEffect
  };
};

export const useModalEffects = () => {
  const { createModalAnimation, getTextVariants } = useEffectsContext();
  
  const createDefaultModal = (options) => {
    return createModalAnimation('default', options);
  };
  
  const createPackOpeningModal = (options) => {
    return createModalAnimation('packOpening', options);
  };
  
  return {
    createDefaultModal,
    createPackOpeningModal,
    getTextVariants
  };
};
