import { useState, useEffect, useCallback } from 'react';
import { useGLTF } from '@react-three/drei';


const CRITICAL_MODELS = [
  './models/pete.glb',      // Main character only
];


const SECONDARY_MODELS = [
  './models/Tyler.glb',     // Default opponent - load on demand
];


const LAZY_MODELS = [
  './models/Bob.glb',       
  './models/Chuck.glb',     
  './models/Earl.glb',      
  './models/Wayne.glb',     
  './models/Vince.glb',     
];


const ESSENTIAL_AUDIO = [
  '/music/punch.mp3',       // Combat feedback only
];


const BACKGROUND_AUDIO = [
  '/music/crowd.mp3',       
];


const OPTIONAL_AUDIO = [
  '/music/button.mp3'       // Only essential UI sound
];


const CRITICAL_IMAGES = [
  '/src/assets/optimized/punch.webp',    
  '/src/assets/optimized/kick.webp',     
  '/src/assets/optimized/combo.webp',    
  '/src/assets/optimized/cover.webp',    
];


const OPTIONAL_IMAGES = [
  '/src/assets/optimized/dance.webp',      
  '/src/assets/mainbutton.jpeg', 
  '/src/assets/optimized/button1.webp',     
  '/src/assets/optimized/button2.webp',     
  '/src/assets/optimized/button3.webp',     
  '/src/assets/optimized/button4.webp',     
  '/src/assets/optimized/music.webp'        
];


const MOBILE_TIMEOUTS = {
  audio: 800,      // 800ms max for audio
  image: 500,      // 500ms max for images  
  model: 2000,     // 2s max for models
  emergency: 8000  // 8s emergency timeout
};


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

      resolve(null);
    };
    
    audio.addEventListener('canplaythrough', handleSuccess);
    audio.addEventListener('loadeddata', handleSuccess);
    audio.addEventListener('error', handleError);
    

    setTimeout(() => {
      if (!resolved) {
        cleanup();

        resolve(audio.readyState >= 2 ? audio : null);
      }
    }, timeout);
    
    audio.preload = 'auto';
    audio.src = src;
    audio.load();
  });
};


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


const preloadModel = (path, priority = 'normal') => {
  return new Promise((resolve) => {
    try {
      useGLTF.preload(path);
      

      setTimeout(() => {
        resolve(true);
      }, priority === 'critical' ? 50 : priority === 'secondary' ? 100 : 25);

    } catch (error) {

      resolve(false);
    }
  });
};

export const useModelLoader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');

  useEffect(() => {
    

    const emergencyTimeout = setTimeout(() => {

      setLoadingProgress(100);
      setLoadingStatus('Ready to play!');
      setIsLoading(false);
    }, MOBILE_TIMEOUTS.emergency);
    
    const loadAssets = async () => {
      try {
        let progress = 0;
        

        setLoadingStatus('Loading essential models...');
        const criticalPromises = CRITICAL_MODELS.map(path => preloadModel(path, 'critical'));
        await Promise.allSettled(criticalPromises);
        progress = 20;
        setLoadingProgress(progress);
        

        setLoadingStatus('Loading essential UI...');
        const criticalImagePromises = CRITICAL_IMAGES.map(path => preloadImage(path, 300)); // Very fast timeout
        await Promise.allSettled(criticalImagePromises);
        progress = 30;
        setLoadingProgress(progress);
        

        setLoadingStatus('Loading essential audio...');
        const essentialAudioPromises = ESSENTIAL_AUDIO.map(path => preloadAudio(path, 500)); // Very fast timeout
        await Promise.allSettled(essentialAudioPromises);
        progress = 35;
        setLoadingProgress(progress);
        

        setLoadingStatus('Ready to play!');
        setIsLoading(false); // Allow user to start playing NOW
        

        

        setLoadingStatus('Loading opponent...');
        const secondaryPromises = SECONDARY_MODELS.map(path => preloadModel(path, 'secondary'));
        await Promise.allSettled(secondaryPromises);
        progress = 50;
        setLoadingProgress(progress);
        

        setLoadingStatus('Loading additional UI...');
        const optionalImagePromises = OPTIONAL_IMAGES.map(path => preloadImage(path, 200)); // Ultra short timeout
        await Promise.allSettled(optionalImagePromises);
        progress = 65;
        setLoadingProgress(progress);
        

        setLoadingStatus('Loading UI sounds...');
        const optionalAudioPromises = OPTIONAL_AUDIO.map(path => preloadAudio(path, 300)); // Ultra short timeout
        await Promise.allSettled(optionalAudioPromises);
        progress = 80;
        setLoadingProgress(progress);
        

        setLoadingStatus('Loading ambient sounds...');
        const backgroundAudioPromises = BACKGROUND_AUDIO.map(path => preloadAudio(path, 400));
        await Promise.allSettled(backgroundAudioPromises);
        progress = 90;
        setLoadingProgress(progress);
        

        setLoadingStatus('All assets loaded!');
        progress = 100;
        setLoadingProgress(progress);
        
        clearTimeout(emergencyTimeout);
        
        setTimeout(() => {
          setLoadingStatus('Full experience ready!');
        }, 200);
        
      } catch (error) {

        setLoadingStatus('Loading completed with some issues');
        
        clearTimeout(emergencyTimeout);
        

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


  const lazyLoadModel = useCallback(async (modelName) => {
    const modelPath = LAZY_MODELS.find(path => path.includes(modelName));
    if (modelPath) {
      return preloadModel(modelPath, 'lazy');
    }
    return false;
  }, []);


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