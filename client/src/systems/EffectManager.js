class EffectManager {
  constructor() {
    this.defaultConfigs = {
      particles: {
        packOpening: {
          count: 40,
          duration: 3.5,
          colors: ['rgb(245, 245, 220)', 'rgb(245, 245, 220)'],
          scale: { min: 0.5, max: 1.3 },
          delay: { min: 0, max: 1.5 },
          rotation: { min: 0, max: 360 }
        },
        statUpgrade: {
          count: 15,
          duration: 2,
          colors: ['#A00000'],
          scale: { min: 0.5, max: 1.0 },
          delay: { min: 0, max: 0.5 },
          rotation: { min: 0, max: 360 }
        },
        purchase: {
          count: 20,
          duration: 2.5,
          colors: ['#FFD700', '#FFA500'],
          scale: { min: 0.3, max: 0.8 },
          delay: { min: 0, max: 1.0 },
          rotation: { min: 0, max: 360 }
        }
      },
      modals: {
        default: {
          hidden: {
            scale: 0,
            opacity: 0,
            rotate: -10,
            y: 100
          },
          visible: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            y: 0,
            transition: {
              type: "spring",
              damping: 15,
              stiffness: 300,
              duration: 0.6
            }
          },
          exit: {
            scale: 0,
            opacity: 0,
            rotate: 10,
            y: -100,
            transition: {
              duration: 0.4,
              ease: "easeInOut"
            }
          }
        },
        packOpening: {
          hidden: {
            scale: 0,
            opacity: 0,
            x: 0,
            y: 0
          },
          visible: {
            scale: [0, 1.2, 1],
            opacity: 1,
            y: 0,
            rotateY: 0,
            transition: {
              duration: 0.8,
              ease: "easeOut"
            }
          }
        }
      },
      transitions: {
        screen: {
          duration: 400,
          ease: "easeInOut"
        },
        button: {
          scale: 0.95,
          duration: 0.2
        }
      }
    };
  }

  createParticleEffect(type, options = {}) {
    const config = { ...this.defaultConfigs.particles[type], ...options };
    const particles = Array.from({ length: config.count }, (_, i) => ({
      id: `${type}_${Date.now()}_${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * (config.delay.max - config.delay.min) + config.delay.min,
      scale: Math.random() * (config.scale.max - config.scale.min) + config.scale.min,
      rotation: Math.random() * (config.rotation.max - config.rotation.min) + config.rotation.min,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      duration: config.duration
    }));

    return {
      particles,
      variants: this.getParticleVariants(type, config),
      config
    };
  }

  getParticleVariants(type, config) {
    const baseVariants = {
      hidden: { 
        scale: 0, 
        opacity: 0,
        x: 0,
        y: 0
      }
    };

    switch (type) {
      case 'packOpening':
        return {
          ...baseVariants,
          visible: (custom) => ({
            scale: [0, custom.scale, custom.scale * 0.5, 0],
            opacity: [0, 1, 1, 0],
            y: [0, -120, -200, -300],
            x: [0, (Math.random() - 0.5) * 300],
            rotate: [0, custom.rotation, custom.rotation * 3, custom.rotation * 4],
            transition: {
              duration: config.duration,
              delay: custom.delay,
              ease: "easeOut"
            }
          })
        };

      case 'statUpgrade':
        return {
          ...baseVariants,
          visible: (custom) => ({
            scale: [0, custom.scale, 0],
            opacity: [0, 1, 0],
            y: [20, -50, -100],
            x: [0, (custom.x - 50) * 2],
            rotate: custom.rotation,
            transition: {
              duration: config.duration,
              delay: custom.delay,
              ease: "easeOut"
            }
          })
        };

      case 'purchase':
        return {
          ...baseVariants,
          visible: (custom) => ({
            scale: [0, custom.scale, 0],
            opacity: [0, 1, 0],
            y: [0, -80, -160],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, custom.rotation, custom.rotation * 2],
            transition: {
              duration: config.duration,
              delay: custom.delay,
              ease: "easeOut"
            }
          })
        };

      default:
        return baseVariants;
    }
  }

  createModalAnimation(type = 'default', options = {}) {
    const config = { ...this.defaultConfigs.modals[type], ...options };
    return config;
  }

  createPackOpeningAnimation(options = {}) {
    const config = {
      pack: {
        scale: [1, 1.2, 0.8, 1.5, 0],
        rotate: [0, 5, -5, 10, -10, 0],
        opacity: [1, 1, 1, 1, 0],
        transition: {
          duration: 2,
          ease: "easeInOut"
        }
      },
      item: {
        hidden: { 
          scale: 0, 
          opacity: 0,
          y: 50,
          rotateY: 180
        },
        visible: (index) => ({
          scale: [0, 1.2, 1],
          opacity: 1,
          y: 0,
          rotateY: 0,
          transition: {
            delay: index * 0.3,
            duration: 0.8,
            ease: "easeOut"
          }
        })
      }
    };

    return { ...config, ...options };
  }

  createButtonFeedback(element, options = {}) {
    const config = { ...this.defaultConfigs.transitions.button, ...options };
    
    if (!element) return;

    element.style.transition = `transform ${config.duration}s ease`;
    element.style.transform = `scale(${config.scale})`;
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, config.duration * 1000);
  }

  createScreenTransition(from, to, options = {}) {
    const config = { ...this.defaultConfigs.transitions.screen, ...options };
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ from, to, duration: config.duration });
      }, config.duration);
    });
  }

  createSuccessEffect(element, options = {}) {
    if (!element) return;

    const config = {
      color: '#4CAF50',
      duration: 0.5,
      scale: 1.1,
      ...options
    };

    const originalColor = element.style.color;
    const originalTransform = element.style.transform;

    element.style.color = config.color;
    element.style.transform = `scale(${config.scale})`;
    element.style.transition = `all ${config.duration}s ease`;

    setTimeout(() => {
      element.style.color = originalColor;
      element.style.transform = originalTransform;
    }, config.duration * 1000);
  }

  createErrorEffect(element, options = {}) {
    if (!element) return;

    const config = {
      color: '#f44336',
      duration: 0.3,
      shake: true,
      ...options
    };

    const originalColor = element.style.color;
    const originalTransform = element.style.transform;

    element.style.color = config.color;
    element.style.transition = `all ${config.duration}s ease`;

    if (config.shake) {
      element.style.animation = 'shake 0.3s ease-in-out';
    }

    setTimeout(() => {
      element.style.color = originalColor;
      element.style.transform = originalTransform;
      element.style.animation = '';
    }, config.duration * 1000);
  }

  createLoadingEffect(element, options = {}) {
    if (!element) return;

    const config = {
      duration: 1,
      opacity: 0.5,
      ...options
    };

    const originalOpacity = element.style.opacity;
    element.style.opacity = config.opacity;
    element.style.animation = 'pulse 1s ease-in-out infinite';

    return {
      stop: () => {
        element.style.opacity = originalOpacity;
        element.style.animation = '';
      }
    };
  }

  getTextVariants(delay = 0) {
    return {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          delay: delay,
          duration: 0.6,
          ease: "easeOut"
        }
      }
    };
  }

}

export default EffectManager;
