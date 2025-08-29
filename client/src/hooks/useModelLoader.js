import { useState, useEffect, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';

// 🚀 MOBILE-FIRST OPTIMIZATION: Only load absolute minimum for first interaction
const CRITICAL_MODELS = [
  './models/pete.glb',      // Main character only
];

// SECONDARY: Load only when needed
const SECONDARY_MODELS = [
  './models/Tyler.glb',     // Default opponent - load on demand
];

// LAZY: All other models loaded only when specifically requested
const LAZY_MODELS = [
  './models/Bob.glb',       
  './models/Chuck.glb',     
  './models/Earl.glb',      
  './models/Wayne.glb',     
  './models/Vince.glb',     
];

// 🎯 ULTRA-CRITICAL: Only essential sounds for immediate feedback
const ESSENTIAL_AUDIO = [
  '/music/punch.mp3',       // Combat feedback only
];

// BACKGROUND: Loaded after game is playable
const BACKGROUND_AUDIO = [
  '/music/crowd.mp3',       
];

// OPTIONAL: Loaded in background (with aggressive timeouts)
const OPTIONAL_AUDIO = [
  '/music/button.mp3'       // Only essential UI sound
];

// 🎨 CRITICAL UI: Only what's visible immediately
const CRITICAL_IMAGES = [
  '/src/assets/punch.png',    
  '/src/assets/kick.png',     
  '/src/assets/combo.png',    
  '/src/assets/cover.png',    
];

// OPTIONAL UI: Loaded after critical
const OPTIONAL_IMAGES = [
  '/src/assets/dance.png',      
  '/src/assets/mainbutton.jpeg', 
  '/src/assets/button1.png',     
  '/src/assets/button2.png',     
  '/src/assets/button3.png',     
  '/src/assets/button4.png',     
  '/src/assets/music.png'        
];

// 🚀 AGGRESSIVE TIMEOUTS FOR MOBILE
const MOBILE_TIMEOUTS = {
  audio: 800,      // 800ms max for audio
  image: 500,      // 500ms max for images  
  model: 2000,     // 2s max for models
  emergency: 8000  // 8s emergency timeout
};

// Optimized audio preloader with mobile-first timeouts
const preloadAudio = (src, timeout = MOBILE_TIMEOUTS.audio) => {
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
      resolve(audio);
    };
    
    const handleError = () => {
      cleanup();
      console.warn(`⚠️ Audio failed: ${src.split('/').pop()}`);
      resolve(null);
    };
    
    audio.addEventListener('canplaythrough', handleSuccess);
    audio.addEventListener('loadeddata', handleSuccess);
    audio.addEventListener('error', handleError);
    
    // Aggressive timeout for mobile
    setTimeout(() => {
      if (!resolved) {
        cleanup();
        console.warn(`⏰ Audio timeout: ${src.split('/').pop()}`);
        resolve(audio.readyState >= 2 ? audio : null);
      }
    }, timeout);
    
    audio.preload = 'auto';
    audio.src = src;
    audio.load();
  });
};

// Optimized image preloader with mobile timeouts
const preloadImage = (src, timeout = MOBILE_TIMEOUTS.image) => {
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
      resolve(img);
    };
    
    const handleError = () => {
      cleanup();
      resolve(null);
    };
    
    img.addEventListener('load', handleSuccess);
    img.addEventListener('error', handleError);
    
    setTimeout(() => {
      if (!resolved) {
        cleanup();
        resolve(null);
      }
    }, timeout);
    
    img.src = src;
  });
};

// Optimized model preloader with mobile timeouts
const preloadModel = (path, priority = 'normal') => {
  return new Promise((resolve) => {
    try {
      useGLTF.preload(path);
      
      // Faster resolution for mobile
      setTimeout(() => {
        resolve(true);
      }, priority === 'critical' ? 50 : priority === 'secondary' ? 100 : 25);

    } catch (error) {
      console.error(`Failed to preload model: ${path}`, error);
      resolve(false);
    }
  });
};

export const useModelLoader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');

  useEffect(() => {
    
    // 🚨 EMERGENCY TIMEOUT: Force load after 8 seconds max
    const emergencyTimeout = setTimeout(() => {
      console.warn('⚠️ Emergency timeout reached - forcing app to load');
      setLoadingProgress(100);
      setLoadingStatus('Ready to play!');
      setIsLoading(false);
    }, MOBILE_TIMEOUTS.emergency);
    
    const loadAssets = async () => {
      try {
        let progress = 0;
        
        // 🚀 PHASE 1: CRITICAL MODELS ONLY (0-20%) - Absolute minimum
        setLoadingStatus('Loading essential models...');
        const criticalPromises = CRITICAL_MODELS.map(path => preloadModel(path, 'critical'));
        await Promise.allSettled(criticalPromises);
        progress = 20;
        setLoadingProgress(progress);
        
        // 🎨 PHASE 2: CRITICAL UI (20-30%) - Essential buttons only
        setLoadingStatus('Loading essential UI...');
        const criticalImagePromises = CRITICAL_IMAGES.map(path => preloadImage(path, 300)); // Very fast timeout
        await Promise.allSettled(criticalImagePromises);
        progress = 30;
        setLoadingProgress(progress);
        
        // 🔊 PHASE 3: ESSENTIAL AUDIO (30-35%) - Core sound only
        setLoadingStatus('Loading essential audio...');
        const essentialAudioPromises = ESSENTIAL_AUDIO.map(path => preloadAudio(path, 500)); // Very fast timeout
        await Promise.allSettled(essentialAudioPromises);
        progress = 35;
        setLoadingProgress(progress);
        
        // 🎮 GAME IS PLAYABLE AT 35%! (Reduced from 40%)
        setLoadingStatus('Ready to play!');
        setIsLoading(false); // Allow user to start playing NOW
        
        // Continue loading in background without blocking gameplay
        
        // 🎯 PHASE 4: SECONDARY MODELS (35-50%) - Load opponent on demand
        setLoadingStatus('Loading opponent...');
        const secondaryPromises = SECONDARY_MODELS.map(path => preloadModel(path, 'secondary'));
        await Promise.allSettled(secondaryPromises);
        progress = 50;
        setLoadingProgress(progress);
        
        // 🎨 PHASE 5: OPTIONAL UI (50-65%) - Additional interface elements  
        setLoadingStatus('Loading additional UI...');
        const optionalImagePromises = OPTIONAL_IMAGES.map(path => preloadImage(path, 200)); // Ultra short timeout
        await Promise.allSettled(optionalImagePromises);
        progress = 65;
        setLoadingProgress(progress);
        
        // 🔊 PHASE 6: OPTIONAL AUDIO (65-80%) - UI sounds only
        setLoadingStatus('Loading UI sounds...');
        const optionalAudioPromises = OPTIONAL_AUDIO.map(path => preloadAudio(path, 300)); // Ultra short timeout
        await Promise.allSettled(optionalAudioPromises);
        progress = 80;
        setLoadingProgress(progress);
        
        // 🎵 PHASE 7: BACKGROUND AUDIO (80-90%) - Ambient sounds
        setLoadingStatus('Loading ambient sounds...');
        const backgroundAudioPromises = BACKGROUND_AUDIO.map(path => preloadAudio(path, 400));
        await Promise.allSettled(backgroundAudioPromises);
        progress = 90;
        setLoadingProgress(progress);
        
        // 🎯 PHASE 8: FINALIZATION (90-100%)
        setLoadingStatus('All assets loaded!');
        progress = 100;
        setLoadingProgress(progress);
        
        clearTimeout(emergencyTimeout);
        
        setTimeout(() => {
          setLoadingStatus('Full experience ready!');
        }, 200);
        
      } catch (error) {
        console.error('❌ Loading error:', error);
        setLoadingStatus('Loading completed with some issues');
        
        clearTimeout(emergencyTimeout);
        
        // Still start the game even with errors
        setTimeout(() => {
          setIsLoading(false);
        }, 300); // Faster fallback
      }
    };

    loadAssets();

    return () => {
      clearTimeout(emergencyTimeout);
    };
  }, []);

  // Lazy load function for on-demand assets
  const lazyLoadModel = useCallback(async (modelName) => {
    const modelPath = LAZY_MODELS.find(path => path.includes(modelName));
    if (modelPath) {
      return preloadModel(modelPath, 'lazy');
    }
    return false;
  }, []);

  // New: Load opponent model on demand
  const loadOpponentModel = useCallback(async (opponentName) => {
    const opponentPath = SECONDARY_MODELS.find(path => path.includes(opponentName));
    if (opponentPath) {
      return preloadModel(opponentPath, 'secondary');
    }
    return false;
  }, []);

  return {
    isLoading,
    loadingProgress,
    loadingStatus,
    lazyLoadModel,
    loadOpponentModel // New: function to load opponent models on demand
  };
}; 