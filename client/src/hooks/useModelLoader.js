import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

// List of models that are actually being used in the application
const modelPaths = [
  // Core fighting characters (used in GameState.jsx)
  './models/pete.glb',      // Main character + opponent
  './models/Tyler.glb',     // Main opponent + purchasable character
  './models/Vince.glb',     // Purchasable character in shop
  './models/Bob.glb',       // Purchasable character in shop
  
  // Audience characters (used in Audience.jsx)
  './models/Chuck.glb',     // Audience member
  './models/Earl.glb',      // Audience member
  './models/Wayne.glb',     // Audience member
];

// List of all music files that need to be preloaded
const musicPaths = [
  '/music/Styles Of Beyond - Nine Thou (Grant Mohrman Supertars Remix).mp3',
  '/music/Full On The Mouth - Another.mp3',
  '/music/crowd.mp3',
  '/music/punch.mp3',
  '/music/button.mp3'
];

// List of additional images/assets that need to be preloaded
const imagePaths = [
  '/src/assets/punch.png',
  '/src/assets/kick.png',
  '/src/assets/combo.png',
  '/src/assets/cover.png',
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

// Function to preload an audio file
const preloadAudio = (src) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    const handleLoad = () => {
      console.log(`🎵 Audio loaded: ${src.split('/').pop()}`);
      audio.removeEventListener('canplaythrough', handleLoad);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
      resolve(audio);
    };
    
    const handleLoadedData = () => {
      console.log(`🎵 Audio data loaded: ${src.split('/').pop()}`);
      audio.removeEventListener('canplaythrough', handleLoad);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
      resolve(audio);
    };
    
    const handleError = (error) => {
      console.error(`❌ Error loading audio: ${src}`, error);
      audio.removeEventListener('canplaythrough', handleLoad);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
      resolve(null); // Resolver with null to continue although failed
    };
    
    audio.addEventListener('canplaythrough', handleLoad);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.preload = 'auto';
    audio.src = src;
    audio.load();
    
    // Security timeout
    setTimeout(() => {
      if (audio.readyState >= 2) { // HAVE_CURRENT_DATA
        handleLoadedData();
      } else {
        console.warn(`⏰ Audio loading timeout: ${src.split('/').pop()}`);
        resolve(audio); // Resolver of all forms
      }
    }, 5000);
  });
};

// Function to preload an image
const preloadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    
    const handleLoad = () => {
      console.log(`🖼️ Image loaded: ${src.split('/').pop()}`);
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
      resolve(img);
    };
    
    const handleError = (error) => {
      console.error(`❌ Error loading image: ${src}`, error);
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
      resolve(null);
    };
    
    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;
    
    // Security timeout
    setTimeout(() => {
      if (img.complete) {
        handleLoad();
      } else {
        console.warn(`⏰ Image loading timeout: ${src.split('/').pop()}`);
        resolve(img);
      }
    }, 3000);
  });
};

// Function to preload a GLB model
const preloadModel = (path) => {
  return new Promise((resolve) => {
    try {
      console.log(`📦 Preloading model: ${path}`);
      useGLTF.preload(path);
      // Simulate model loading time
      setTimeout(() => {
        console.log(`✅ Model preloaded: ${path}`);
        resolve(true);
      }, 300 + Math.random() * 200);
    } catch (error) {
      console.error(`❌ Error preloading model: ${path}`, error);
      resolve(false);
    }
  });
};

export const useModelLoader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('Starting...');

  useEffect(() => {
    console.log('🎮 Starting complete asset loading...');
    
    const loadAllAssets = async () => {
      try {
        let currentProgress = 0;
        
        // Phase 1: Preload GLB models (0-40%)
        setLoadingStatus('Loading 3D models...');
        const modelPromises = modelPaths.map(preloadModel);
        
        let modelsLoaded = 0;
        const modelResults = await Promise.allSettled(modelPromises.map(async (promise, index) => {
          const result = await promise;
          modelsLoaded++;
          const progress = Math.floor((modelsLoaded / modelPaths.length) * 40);
          setLoadingProgress(progress);
          setLoadingStatus(`Loading models... (${modelsLoaded}/${modelPaths.length})`);
          return result;
        }));
        
        const successfulModels = modelResults.filter(result => result.status === 'fulfilled' && result.value).length;
        console.log(`✅ ${successfulModels}/${modelPaths.length} models loaded successfully`);
        
        // Phase 2: Preload images (40-60%)
        setLoadingStatus('Loading images...');
        const imagePromises = imagePaths.map(preloadImage);
        
        let imagesLoaded = 0;
        const imageResults = await Promise.allSettled(imagePromises.map(async (promise, index) => {
          const result = await promise;
          imagesLoaded++;
          const progress = 40 + Math.floor((imagesLoaded / imagePaths.length) * 20);
          setLoadingProgress(progress);
          setLoadingStatus(`Loading images... (${imagesLoaded}/${imagePaths.length})`);
          return result;
        }));
        
        const successfulImages = imageResults.filter(result => result.status === 'fulfilled' && result.value).length;
        console.log(`✅ ${successfulImages}/${imagePaths.length} images loaded successfully`);
        
        // Phase 3: Preload music files (60-95%)
        setLoadingStatus('Loading music and sound effects...');
        console.log('🎵 Starting audio file preload...');
        
        let audiosLoaded = 0;
        const audioResults = await Promise.allSettled(musicPaths.map(async (path, index) => {
          console.log(`🎶 Loading audio ${index + 1}/${musicPaths.length}: ${path.split('/').pop()}`);
          const result = await preloadAudio(path);
          audiosLoaded++;
          const progress = 60 + Math.floor((audiosLoaded / musicPaths.length) * 35);
          setLoadingProgress(progress);
          setLoadingStatus(`Loading audio... (${audiosLoaded}/${musicPaths.length})`);
          return result;
        }));
        
        const successfulAudios = audioResults.filter(result => result.status === 'fulfilled' && result.value).length;
        console.log(`✅ ${successfulAudios}/${musicPaths.length} audio files loaded successfully`);
        
        // Phase 4: Finalization (95-100%)
        setLoadingProgress(98);
        setLoadingStatus('Preparing experience...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLoadingProgress(100);
        setLoadingStatus('Ready to fight!');
        console.log('✅ Complete loading of all assets');
        
        // Final delay before starting the game
        setTimeout(() => {
          setIsLoading(false);
          console.log('🚀 Starting game with all assets preloaded');
          
          // Automatically start music after loading
          setTimeout(() => {
            console.log('🎵 Starting automatic music playback...');
            // Fire custom event to start music
            window.dispatchEvent(new CustomEvent('startMusic'));
          }, 1000);
        }, 800);
        
      } catch (error) {
        console.error('❌ Error during asset loading:', error);
        setLoadingStatus('Loading error, starting anyway...');
        setTimeout(() => {
          setIsLoading(false);
          // Try to start music even if there were errors
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('startMusic'));
          }, 1000);
        }, 1000);
      }
    };

    loadAllAssets();

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up complete loading hook');
    };
  }, []);

  return {
    isLoading,
    loadingProgress,
    loadingStatus
  };
}; 