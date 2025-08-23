import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

// PRIORITY LOADING: Core models needed immediately
const CRITICAL_MODELS = [
  './models/pete.glb',      // Main character (always visible)
  './models/Tyler.glb',     // Default opponent
];

// SECONDARY LOADING: Only essential for immediate gameplay  
const SECONDARY_MODELS = [
  // Audience models moved to lazy loading for faster initial load
];

// LAZY LOADING: Models loaded in background after game is playable
const LAZY_MODELS = [
  './models/Bob.glb',       // Shop character
  './models/Chuck.glb',     // Audience member (lazy loaded for faster startup)
  './models/Earl.glb',      // Audience member (lazy loaded for faster startup)  
  './models/Wayne.glb',     // Audience member (lazy loaded for faster startup)
  './models/Vince.glb',     // Audience member (lazy loaded for faster startup)
];

// ESSENTIAL AUDIO: Only critical sounds for initial experience
const ESSENTIAL_AUDIO = [
  '/music/punch.mp3',       // Combat feedback (most critical)
];

// BACKGROUND AUDIO: Loaded after game is playable
const BACKGROUND_AUDIO = [
  '/music/crowd.mp3',       // Background ambience (nice to have)
];

// OPTIONAL AUDIO: Loaded in background after essential assets (OPTIMIZED - only existing files)
const OPTIONAL_AUDIO = [
  '/music/Styles Of Beyond - Nine Thou (Grant Mohrman Supertars Remix).mp3', // ✅ Exists
  '/music/Full On The Mouth - Another.mp3',                                   // ✅ Exists  
  '/music/button.mp3'                                                          // ✅ Exists
].concat(BACKGROUND_AUDIO); // Include background audio in optional loading

// CRITICAL IMAGES: Only essential UI elements (verified usage)
const CRITICAL_IMAGES = [
  '/src/assets/punch.png',    // ✅ Used in attack buttons
  '/src/assets/kick.png',     // ✅ Used in attack buttons  
  '/src/assets/combo.png',    // ✅ Used in attack buttons
  '/src/assets/cover.png',    // ✅ Used in block button
];

// OPTIONAL IMAGES: Loaded after critical assets (removed unused assets)
const OPTIONAL_IMAGES = [
  // ❌ REMOVED: '/src/assets/reset.png' - imported but never used
  // ❌ REMOVED: '/src/assets/fight.png' - imported but never used  
  '/src/assets/dance.png',      // ✅ Used in dance button
  '/src/assets/mainbutton.jpeg', // ✅ Used in multiple buttons
  '/src/assets/button1.png',     // ✅ Used in MainMenu
  '/src/assets/button2.png',     // ✅ Used in MainMenu
  '/src/assets/button3.png',     // ✅ Used in MainMenu
  '/src/assets/button4.png',     // ✅ Used in MainMenu
  '/src/assets/music.png'        // ✅ Used in MusicPlayer
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
      resolve(img);
    };
    
    const handleError = () => {
      cleanup();
      resolve(null); // Continue without this image
    };
    
    img.addEventListener('load', handleSuccess);
    img.addEventListener('error', handleError);
    
    // Timeout fallback
    setTimeout(() => {
      if (!resolved) {
        cleanup();
        resolve(null);
      }
    }, timeout);
    
    img.src = src;
  });
};

// Optimized model preloader using useGLTF.preload
const preloadModel = (path, priority = 'normal') => {
  return new Promise((resolve) => {
    try {
      useGLTF.preload(path);
      
      setTimeout(() => {
        resolve(true);
      }, priority === 'critical' ? 100 : priority === 'secondary' ? 200 : 50);

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
    
    // Emergency timeout to ensure app always loads
    const emergencyTimeout = setTimeout(() => {
      console.warn('⚠️ Emergency timeout reached - forcing app to load');
      setLoadingProgress(100);
      setLoadingStatus('Ready to play!');
      setIsLoading(false);
    }, 15000); // 15 seconds max
    
    const loadAssets = async () => {
      try {
        let progress = 0;
        
        // PHASE 1: CRITICAL MODELS (0-25%) - Must have for basic functionality
        setLoadingStatus('Loading essential models...');
        const criticalPromises = CRITICAL_MODELS.map(path => preloadModel(path, 'critical'));
        await Promise.allSettled(criticalPromises);
        progress = 25;
        setLoadingProgress(progress);
        
        // PHASE 2: CRITICAL IMAGES (25-35%) - Essential UI elements
        setLoadingStatus('Loading essential UI...');
        const criticalImagePromises = CRITICAL_IMAGES.map(path => preloadImage(path, 800)); // Faster timeout
        await Promise.allSettled(criticalImagePromises);
        progress = 35;
        setLoadingProgress(progress);
        
        // PHASE 3: ESSENTIAL AUDIO (35-40%) - Core sound effects only
        setLoadingStatus('Loading essential audio...');
        const essentialAudioPromises = ESSENTIAL_AUDIO.map(path => preloadAudio(path, 1000)); // Much faster timeout
        await Promise.allSettled(essentialAudioPromises);
        progress = 40;
        setLoadingProgress(progress);
        
        // 🎮 GAME IS NOW PLAYABLE AT 40%! 
        setLoadingStatus('Ready to play!');
        setIsLoading(false); // Allow user to start playing NOW
        
        // Continue loading in background without blocking gameplay
        
        // PHASE 4: LAZY MODELS (40-60%) - Background loading while playing
        setLoadingStatus('Loading background elements...');
        const lazyPromises = LAZY_MODELS.map(path => preloadModel(path, 'lazy'));
        await Promise.allSettled(lazyPromises);
        progress = 60;
        setLoadingProgress(progress);
        
        // PHASE 5: OPTIONAL UI (60-75%) - Additional interface elements  
        setLoadingStatus('Loading additional UI...');
        const optionalImagePromises = OPTIONAL_IMAGES.map(path => preloadImage(path, 500)); // Very short timeout
        await Promise.allSettled(optionalImagePromises);
        progress = 75;
        setLoadingProgress(progress);
        
        // PHASE 6: OPTIONAL AUDIO (75-90%) - Music tracks
        setLoadingStatus('Loading music tracks...');
        const optionalAudioPromises = OPTIONAL_AUDIO.map(path => preloadAudio(path, 800)); // Very short timeout
        await Promise.allSettled(optionalAudioPromises);
        progress = 90;
        setLoadingProgress(progress);
        
        // PHASE 7: FINALIZATION (90-100%)
        setLoadingStatus('All assets loaded!');
        progress = 100;
        setLoadingProgress(progress);
        
        // Clear emergency timeout
        clearTimeout(emergencyTimeout);
        
        // Background loading is complete
        setTimeout(() => {
          setLoadingStatus('Full experience ready!');
        }, 200);
        
      } catch (error) {
        console.error('❌ Loading error:', error);
        setLoadingStatus('Loading completed with some issues');
        
        // Clear emergency timeout
        clearTimeout(emergencyTimeout);
        
        // Still start the game even with errors
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    loadAssets();

    return () => {
      clearTimeout(emergencyTimeout);
    };
  }, []);

  // Lazy load function for on-demand assets
  const lazyLoadModel = async (modelName) => {
    const modelPath = LAZY_MODELS.find(path => path.includes(modelName));
    if (modelPath) {
      return preloadModel(modelPath, 'lazy');
    }
    return false;
  };

  return {
    isLoading,
    loadingProgress,
    loadingStatus,
    lazyLoadModel // New: function to load additional models on demand
  };
}; 