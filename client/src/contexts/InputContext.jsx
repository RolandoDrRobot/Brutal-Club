import React, { createContext, useContext, useEffect, useRef } from 'react';
import InputManager from '../systems/InputManager';

const InputContext = createContext({});

export const InputProvider = ({ children }) => {
  const inputManagerRef = useRef(null);
  
  useEffect(() => {
    inputManagerRef.current = new InputManager();
    
    return () => {
      if (inputManagerRef.current) {
        inputManagerRef.current.cleanup();
      }
    };
  }, []);
  
  const inputManager = inputManagerRef.current;
  
  if (!inputManager) {
    return <>{children}</>;
  }
  
  const contextValue = {
    setCurrentScreen: (screen) => inputManager.setCurrentScreen(screen),
    setCombatMode: (isCombat) => inputManager.setCombatMode(isCombat),
    createTouchHandler: (action, options) => inputManager.createTouchHandler(action, options),
    getAvailableActions: () => inputManager.getAvailableActions(),
    enable: () => inputManager.enable(),
    disable: () => inputManager.disable(),
    inputManager
  };
  
  return (
    <InputContext.Provider value={contextValue}>
      {children}
    </InputContext.Provider>
  );
};

export const useInput = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('useInput must be used within an InputProvider');
  }
  return context;
};
