import { useState, useEffect, useRef } from 'react';

/**
 * Hook para optimizar la carga de imágenes con:
 * - Lazy loading automático
 * - Soporte para formatos modernos (WebP/AVIF)
 * - Preload inteligente
 * - Manejo de errores con fallbacks
 */
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

  // Función para generar URLs de diferentes formatos
  const generateSources = (originalSrc) => {
    const ext = originalSrc.split('.').pop();
    const basePath = originalSrc.replace(`.${ext}`, '');
    
    return formats.map(format => {
      if (format === 'original') return originalSrc;
      return `${basePath}.${format}`;
    });
  };

  // Función para verificar soporte de formato
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

  // Función para cargar imagen con fallbacks
  const loadImageWithFallbacks = async (sources) => {
    setIsLoading(true);
    setError(null);

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      const format = formats[i];
      
      // Verificar soporte del formato
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
            // Si es el último formato disponible, fallar
            if (i === sources.length - 1) {
              const error = new Error(`Failed to load image: ${source}`);
              setError(error);
              setIsLoading(false);
              onError && onError(error);
              reject(error);
            } else {
              // Continuar con el próximo formato
              reject(new Error(`Format ${format} not supported or failed`));
            }
          };
          
          img.src = source;
        });
        break; // Si carga exitosamente, salir del loop
      } catch (err) {
        // Continuar con el próximo formato
        continue;
      }
    }
  };

  // Configurar Intersection Observer para lazy loading
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
        rootMargin: '50px', // Comenzar a cargar 50px antes de que sea visible
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

  // Cargar imagen cuando debería cargar
  useEffect(() => {
    if (!shouldLoad || !src) return;

    const sources = generateSources(src);
    loadImageWithFallbacks(sources);
  }, [shouldLoad, src]);

  // Preload si está especificado
  useEffect(() => {
    if (preload && src) {
      const sources = generateSources(src);
      // Preload del primer formato disponible
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
    // Función manual para cargar si lazy está deshabilitado
    load: () => setShouldLoad(true)
  };
};

/**
 * Hook simplificado para imágenes críticas que necesitan carga inmediata
 */
export const useCriticalImage = (src, options = {}) => {
  return useOptimizedImage(src, {
    ...options,
    lazy: false,
    preload: true
  });
};

/**
 * Hook para imágenes de fondo optimizadas
 */
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