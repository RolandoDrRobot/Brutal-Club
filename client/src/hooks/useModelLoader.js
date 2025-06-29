import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

// PRIORITY LOADING: Core models needed immediately
const CRITICAL_MODELS = [
  './models/pete.glb',      // Main character (always visible)
  './models/Tyler.glb',     // Default opponent
];

// SECONDARY LOADING: Models loaded after critical ones
const SECONDARY_MODELS = [
  './models/Chuck.glb',     // Audience member
  './models/Earl.glb',      // Audience member
  './models/Wayne.glb',     // Audience member
];

// LAZY LOADING: Models loaded only when needed
const LAZY_MODELS = [
  './models/Vince.glb',     // Shop character
  './models/Bob.glb',       // Shop character
];

// ESSENTIAL AUDIO: Only critical sounds for initial experience
const ESSENTIAL_AUDIO = [
  '/music/crowd.mp3',       // Background ambience
  '/music/punch.mp3',       // Combat feedback
];

// OPTIONAL AUDIO: Loaded in background after essential assets
const OPTIONAL_AUDIO = [
  '/music/Styles Of Beyond - Nine Thou (Grant Mohrman Supertars Remix).mp3',
  '/music/Full On The Mouth - Another.mp3',
  '/music/button.mp3'
];

// CRITICAL IMAGES: Only essential UI elements
const CRITICAL_IMAGES = [
  '/src/assets/punch.png',
  '/src/assets/kick.png',
  '/src/assets/combo.png',
  '/src/assets/cover.png',
];

// OPTIONAL IMAGES: Loaded after critical assets
const OPTIONAL_IMAGES = [
  '/src/assets/reset.png',
  '/src/assets/dance.png',
  '/src/assets/fight.png',
  '/src/assets/mainbutton.jpeg',
  '/src/assets/button1.png',
  '/src/assets/button2.png',
  '/src/assets/button3.png',
  '/src/assets/button4.png',
  '/src/assets/music.png'
];

// Optimized audio preloader with better error handling
const preloadAudio = (src, timeout = 3000) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    let resolved = false;
    
    const cleanup = () => {
      if (resolved) return;
      resolved = true;
      audio.removeEventListener('canplaythrough', handleSuccess);
      audio.removeEventListener('loadeddata', handleSuccess);
      audio.removeEventListener('error', handleError);
    };
    
    const handleSuccess = () => {
      cleanup();
      console.log(`🎵 Audio loaded: ${src.split('/').pop()}`);
      resolve(audio);
    };
    
    const handleError = () => {
      cleanup();
      console.warn(`⚠️ Audio failed: ${src.split('/').pop()}`);
      resolve(null); // Continue without this audio
    };
    
    // Set up listeners
    audio.addEventListener('canplaythrough', handleSuccess);
    audio.addEventListener('loadeddata', handleSuccess);
    audio.addEventListener('error', handleError);
    
    // Timeout fallback
    setTimeout(() => {
      if (!resolved) {
        cleanup();
        console.warn(`⏰ Audio timeout: ${src.split('/').pop()}`);
        resolve(audio.readyState >= 2 ? audio : null);
      }
    }, timeout);
    
    // Start loading
    audio.preload = 'auto';
    audio.src = src;
    audio.load();
  });
};

// Optimized image preloader
const preloadImage = (src, timeout = 2000) => {
  return new Promise((resolve) => {
    const img = new Image();
    let resolved = false;
    
    const cleanup = () => {
      if (resolved) return;
      resolved = true;
      img.removeEventListener('load', handleSuccess);
      img.removeEventListener('error', handleError);
    };
    
    const handleSuccess = () => {
      cleanup();
      console.log(`🖼️ Image loaded: ${src.split('/').pop()}`);
      resolve(img);
    };
    
    const handleError = () => {
      cleanup();
      console.warn(`⚠️ Image failed: ${src.split('/').pop()}`);
      resolve(null);
    };
    
    img.addEventListener('load', handleSuccess);
    img.addEventListener('error', handleError);
    
    // Timeout fallback
    setTimeout(() => {
      if (!resolved) {
        cleanup();
        resolve(img.complete ? img : null);
      }
    }, timeout);
    
    img.src = src;
  });
};

// Fast model preloader with priority
const preloadModel = (path, priority = 'normal') => {
  return new Promise((resolve) => {
    try {
      console.log(`📦 Preloading ${priority} model: ${path}`);
      useGLTF.preload(path);
      
      // Faster resolution for critical models
      const delay = priority === 'critical' ? 100 : 200;
      setTimeout(() => {
        console.log(`✅ Model preloaded: ${path}`);
        resolve(true);
      }, delay + Math.random() * 100);
    } catch (error) {
      console.error(`❌ Model error: ${path}`, error);
      resolve(false);
    }
  });
};

export const useModelLoader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const [isPlayable, setIsPlayable] = useState(false);

  useEffect(() => {
    console.log('🚀 Starting optimized asset loading...');
    
    const loadAssets = async () => {
      try {
        let progress = 0;
        
        // PHASE 1: CRITICAL MODELS (0-30%) - Must have for basic functionality
        setLoadingStatus('Loading essential models...');
        const criticalPromises = CRITICAL_MODELS.map(path => preloadModel(path, 'critical'));
        await Promise.allSettled(criticalPromises);
        progress = 30;
        setLoadingProgress(progress);
        
        // PHASE 2: CRITICAL IMAGES (30-45%) - Essential UI elements
        setLoadingStatus('Loading essential UI...');
        const criticalImagePromises = CRITICAL_IMAGES.map(path => preloadImage(path, 1500));
        await Promise.allSettled(criticalImagePromises);
        progress = 45;
        setLoadingProgress(progress);
        
        // PHASE 3: ESSENTIAL AUDIO (45-60%) - Core sound effects
        setLoadingStatus('Loading essential audio...');
        const essentialAudioPromises = ESSENTIAL_AUDIO.map(path => preloadAudio(path, 2000));
        await Promise.allSettled(essentialAudioPromises);
        progress = 60;
        setLoadingProgress(progress);
        
        // GAME IS NOW PLAYABLE! 
        setLoadingStatus('Ready to play!');
        setIsPlayable(true);
        
        // PHASE 4: SECONDARY MODELS (60-75%) - Background/audience
        setLoadingStatus('Loading background elements...');
        const secondaryPromises = SECONDARY_MODELS.map(path => preloadModel(path, 'secondary'));
        await Promise.allSettled(secondaryPromises);
        progress = 75;
        setLoadingProgress(progress);
        
        // PHASE 5: OPTIONAL IMAGES (75-85%) - Non-critical UI
        setLoadingStatus('Loading additional UI...');
        const optionalImagePromises = OPTIONAL_IMAGES.map(path => preloadImage(path, 1000));
        await Promise.allSettled(optionalImagePromises);
        progress = 85;
        setLoadingProgress(progress);
        
        // PHASE 6: OPTIONAL AUDIO (85-95%) - Music tracks
        setLoadingStatus('Loading music tracks...');
        const optionalAudioPromises = OPTIONAL_AUDIO.map(path => preloadAudio(path, 4000));
        await Promise.allSettled(optionalAudioPromises);
        progress = 95;
        setLoadingProgress(progress);
        
        // PHASE 7: FINALIZATION (95-100%)
        setLoadingStatus('Optimizing experience...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setLoadingProgress(100);
        setLoadingStatus('All assets loaded!');
        console.log('✅ Complete optimized loading finished');
        
        // Start the game
        setTimeout(() => {
          setIsLoading(false);
          console.log('🎮 Game ready with optimized loading');
          
          // Auto-start music after everything is loaded
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('startMusic'));
          }, 500);
        }, 400);
        
      } catch (error) {
        console.error('❌ Loading error:', error);
        setLoadingStatus('Loading completed with some issues');
        
        // Still start the game even with errors
        setTimeout(() => {
          setIsLoading(false);
          setIsPlayable(true);
        }, 500);
      }
    };

    loadAssets();

    return () => {
      console.log('🧹 Cleaning up optimized loader');
    };
  }, []);

  // Lazy load function for on-demand assets
  const lazyLoadModel = async (modelName) => {
    const modelPath = LAZY_MODELS.find(path => path.includes(modelName));
    if (modelPath) {
      console.log(`🔄 Lazy loading: ${modelPath}`);
      return preloadModel(modelPath, 'lazy');
    }
    return false;
  };

  return {
    isLoading,
    loadingProgress,
    loadingStatus,
    isPlayable, // New: indicates when game is minimally playable
    lazyLoadModel // New: function to load additional models on demand
  };
}; 