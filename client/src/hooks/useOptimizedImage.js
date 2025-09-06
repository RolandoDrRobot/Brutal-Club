import { useState, useEffect, useRef } from 'react';

export const useOptimizedImage = (src, options = {}) => {
  const {
    lazy = true,
    preload = false,
    quality = 80,
    formats = ['avif', 'webp', 'original'],
    placeholder = null,
    onLoad = null,
    onError = null
  } = options;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [shouldLoad, setShouldLoad] = useState(!lazy || preload);
  
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  const generateSources = (originalSrc) => {
    const ext = originalSrc.split('.').pop();
    const basePath = originalSrc.replace(`.${ext}`, '');
    
    return formats.map(format => {
      if (format === 'original') return originalSrc;
      return `${basePath}.${format}`;
    });
  };

  const checkFormatSupport = (format) => {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    const supportMap = {
      avif: () => canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0,
      webp: () => canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    };
    
    return supportMap[format] ? supportMap[format]() : true;
  };

  const loadImageWithFallbacks = async (sources) => {
    setIsLoading(true);
    setError(null);

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const format = formats[i];
      
      if (format !== 'original' && !checkFormatSupport(format)) {
        continue;
      }

      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          
          img.onload = () => {
            setCurrentSrc(source);
            setIsLoaded(true);
            setIsLoading(false);
            onLoad && onLoad(img);
            resolve();
          };
          
          img.onerror = () => {
            if (i === sources.length - 1) {
              const error = new Error(`Failed to load image: ${source}`);
              setError(error);
              setIsLoading(false);
              onError && onError(error);
              reject(error);
            } else {
              reject(new Error(`Format ${format} not supported or failed`));
            }
          };
          
          img.src = source;
        });
        break;
      } catch (err) {
        continue;
      }
    }
  };

  useEffect(() => {
    if (!lazy || shouldLoad) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !src) return;

    const sources = generateSources(src);
    loadImageWithFallbacks(sources);
  }, [shouldLoad, src]);

  useEffect(() => {
    if (preload && src) {
      const sources = generateSources(src);
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = sources[0];
      document.head.appendChild(link);
      
      return () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      };
    }
  }, [preload, src]);

  return {
    src: currentSrc,
    isLoaded,
    isLoading,
    error,
    ref: imgRef,
    load: () => setShouldLoad(true)
  };
};

export const useCriticalImage = (src, options = {}) => {
  return useOptimizedImage(src, {
    ...options,
    lazy: false,
    preload: true
  });
};

export const useOptimizedBackground = (src, options = {}) => {
  const { src: optimizedSrc, isLoaded, isLoading } = useOptimizedImage(src, options);
  
  const backgroundStyle = {
    backgroundImage: isLoaded ? `url(${optimizedSrc})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0
  };
  
  return {
    backgroundStyle,
    isLoaded,
    isLoading
  };
}; 