import React, { createContext, useContext, useEffect, useRef } from 'react';
import EffectManager from '../systems/EffectManager';

const EffectContext = createContext({});

export const EffectProvider = ({ children }) => {
  const effectManagerRef = useRef(null);
  
  useEffect(() => {
    effectManagerRef.current = new EffectManager();
    
    return () => {
    };
  }, []);
  
  const effectManager = effectManagerRef.current;
  
  if (!effectManager) {
    return <>{children}</>;
  }
  
  const contextValue = {
    createParticleEffect: (type, options) => effectManager.createParticleEffect(type, options),
    createModalAnimation: (type, options) => effectManager.createModalAnimation(type, options),
    createPackOpeningAnimation: (options) => effectManager.createPackOpeningAnimation(options),
    createButtonFeedback: (element, options) => effectManager.createButtonFeedback(element, options),
    createScreenTransition: (from, to, options) => effectManager.createScreenTransition(from, to, options),
    createSuccessEffect: (element, options) => effectManager.createSuccessEffect(element, options),
    createErrorEffect: (element, options) => effectManager.createErrorEffect(element, options),
    createLoadingEffect: (element, options) => effectManager.createLoadingEffect(element, options),
    getTextVariants: (delay) => effectManager.getTextVariants(delay)
  };
  
  return (
    <EffectContext.Provider value={contextValue}>
      {children}
    </EffectContext.Provider>
  );
};

export const useEffects = () => {
  const context = useContext(EffectContext);
  if (!context) {
    throw new Error('useEffects must be used within an EffectProvider');
  }
  return context;
};
