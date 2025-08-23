import { useState, useEffect } from 'react';
import { SHOP_MODELS } from '../utils/constants';

export const useShopModels = (lazyLoadModel) => {
  const [loadingModels, setLoadingModels] = useState(new Set());
  const [loadedModels, setLoadedModels] = useState(new Set());

  useEffect(() => {
    const loadShopModels = async () => {
      if (!lazyLoadModel) return;
      
      setLoadingModels(new Set(SHOP_MODELS));
      
      const promises = SHOP_MODELS.map(modelName => lazyLoadModel(modelName));
      const results = await Promise.allSettled(promises);
      const successful = new Set();
      
      results.forEach((result, index) => {
        const modelName = SHOP_MODELS[index];
        if (result.status === 'fulfilled' && result.value) {
          successful.add(modelName);
        } else {
          console.warn(`⚠️ Shop model failed: ${modelName}`);
        }
      });
      
      setLoadedModels(successful);
      setLoadingModels(new Set());
    };

    loadShopModels();
  }, [lazyLoadModel]);

  return {
    loadingModels,
    loadedModels,
    isModelLoading: (modelName) => loadingModels.has(modelName),
    isModelLoaded: (modelName) => loadedModels.has(modelName)
  };
}; 