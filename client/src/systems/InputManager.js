class InputManager {
  constructor() {
    this.isEnabled = true;
    this.currentScreen = 'menu';
    this.isCombatMode = false;
    
    this.screenContexts = {
      'menu': ['back', 'confirm', 'navigate_up', 'navigate_down', 'toggle_music'],
      'combat': ['attack_punch', 'attack_kick', 'attack_combo', 'block', 'back'],
      'characterSelect': ['back', 'confirm', 'navigate_up', 'navigate_down', 'navigate_left', 'navigate_right'],
      'opponentSelect': ['back', 'confirm', 'navigate_up', 'navigate_down'],
      'shop': ['back', 'confirm', 'navigate_up', 'navigate_down']
    };
  }
  
  
  isActionValidForScreen(action) {
    const validActions = this.screenContexts[this.currentScreen] || [];
    return validActions.includes(action);
  }
  
  triggerAction(action, inputData = {}) {
    const customEvent = new CustomEvent('gameInput', {
      detail: {
        action,
        inputData,
        screen: this.currentScreen,
        combatMode: this.isCombatMode
      }
    });
    
    document.dispatchEvent(customEvent);
  }
  
  createTouchHandler(action, options = {}) {
    return {
      onTouchStart: (e) => {
        if (!this.isEnabled) return;
        if (!this.isActionValidForScreen(action)) return;
        
        this.handleTouchStart(e, action, options);
      },
      onTouchEnd: (e) => {
        this.handleTouchEnd(e, action, options);
      },
      onMouseDown: (e) => {
        if (!this.isEnabled) return;
        if (!this.isActionValidForScreen(action)) return;
        
        this.handleMouseDown(e, action, options);
      },
      onMouseUp: (e) => {
        this.handleMouseUp(e, action, options);
      },
      onMouseEnter: (e) => {
        if (options.hoverEffect) {
          this.handleHoverEnter(e, options);
        }
      },
      onMouseLeave: (e) => {
        if (options.hoverEffect) {
          this.handleHoverLeave(e, options);
        }
      }
    };
  }
  
  handleTouchStart(event, action, options) {
    const element = event.currentTarget;
    
    if (options.visualFeedback !== false) {
      element.style.transform = 'scale(0.95)';
      element.style.backgroundColor = 'rgba(243, 34, 16, 0.1)';
      element.style.animation = 'impactShake 0.3s ease-out';
    }
    
    event.preventDefault();
  }
  
  handleTouchEnd(event, action, options) {
    const element = event.currentTarget;
    
    if (options.visualFeedback !== false) {
      element.style.transform = 'scale(1)';
      element.style.backgroundColor = 'transparent';
      element.style.animation = 'none';
    }
    
    this.triggerAction(action, {
      type: 'touch',
      event: event
    });
  }
  
  handleMouseDown(event, action, options) {
    const element = event.currentTarget;
    
    if (options.visualFeedback !== false) {
      element.style.transform = 'scale(0.95)';
      element.style.backgroundColor = 'rgba(243, 34, 16, 0.1)';
      element.style.animation = 'impactShake 0.3s ease-out';
    }
  }
  
  handleMouseUp(event, action, options) {
    const element = event.currentTarget;
    
    if (options.visualFeedback !== false) {
      element.style.transform = 'scale(1)';
      element.style.backgroundColor = 'transparent';
      element.style.animation = 'none';
    }
    
    this.triggerAction(action, {
      type: 'mouse',
      event: event
    });
  }
  
  handleHoverEnter(event, options) {
    const element = event.currentTarget;
    
    if (options.hoverEffect !== false) {
      element.style.transform = 'scale(1.05)';
      element.style.backgroundColor = 'rgba(243, 34, 16, 0.1)';
      element.style.animation = 'impactShake 0.3s ease-out';
    }
  }
  
  handleHoverLeave(event, options) {
    const element = event.currentTarget;
    
    if (options.hoverEffect !== false) {
      element.style.transform = 'scale(1)';
      element.style.backgroundColor = 'transparent';
      element.style.animation = 'none';
    }
  }
  
  setCurrentScreen(screen) {
    this.currentScreen = screen;
  }
  
  setCombatMode(isCombat) {
    this.isCombatMode = isCombat;
  }
  
  enable() {
    this.isEnabled = true;
  }
  
  disable() {
    this.isEnabled = false;
  }
  
  getAvailableActions() {
    return this.screenContexts[this.currentScreen] || [];
  }
  
  cleanup() {
  }
}

export default InputManager;
