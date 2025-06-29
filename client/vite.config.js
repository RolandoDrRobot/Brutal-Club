import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert()
  ],
  build: {
    // Advanced code splitting
    rollupOptions: {
      output: {
        // Optimized chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? 
            chunkInfo.facadeModuleId.split('/').pop().replace(/\.(jsx?|tsx?)$/, '') : 'chunk';
          return `assets/js/${facadeModuleId}-[hash].js`;
        },
        // Organized asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          // Images
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          // Fonts
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          // 3D Models
          if (/glb|gltf/i.test(ext)) {
            return `assets/models/[name]-[hash][extname]`;
          }
          // Audio
          if (/mp3|wav|ogg|m4a/i.test(ext)) {
            return `assets/audio/[name]-[hash][extname]`;
          }
          // Everything else
          return `assets/misc/[name]-[hash][extname]`;
        }
      },
      // Tree-shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    // Advanced minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        // Remove specific debugging functions
        pure_funcs: process.env.NODE_ENV === 'production' ? [
          'console.log', 
          'console.info', 
          'console.debug',
          'console.trace'
        ] : [],
        // Basic optimizations
        passes: 2,
        // Remove unused code
        dead_code: true,
        // Optimize comparisons
        comparisons: true,
        // Reduce variable names
        keep_fnames: false,
        keep_classnames: false
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 800,
    // Production sourcemaps only for debugging
    sourcemap: process.env.NODE_ENV === 'development' ? true : 'hidden',
    // Report compression
    reportCompressedSize: true,
    // Modern target for better optimization
    target: ['es2020', 'chrome80', 'firefox78', 'safari14'],
    // CSS optimization
    cssCodeSplit: true,
    // Asset inlining threshold
    assetsInlineLimit: 4096
  },
  // Enhanced dependency optimization
  optimizeDeps: {
    // Pre-bundle critical dependencies
    include: [
      'react', 
      'react-dom',
      'react/jsx-runtime',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@mantine/core',
      '@mantine/hooks',
      '@emotion/react'
    ],
    // Exclude problematic packages
    exclude: [
      'three/examples/jsm/loaders/GLTFLoader'
    ],
    // Force optimization of specific packages
    force: process.env.NODE_ENV === 'production'
  },
  // Development server optimizations
  server: {
    // Enable gzip compression
    middlewareMode: false,
    hmr: {
      overlay: false,
      port: 24678
    },
    // Warm up frequently used files
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/components/Interface.jsx',
        './src/contexts/CharacterAnimations.jsx',
        './src/contexts/GameState.jsx',
        './src/hooks/useModelLoader.js'
      ]
    }
  },
  // Asset handling
  assetsInclude: [
    '**/*.gltf', 
    '**/*.glb', 
    '**/*.hdr', 
    '**/*.exr',
    '**/*.mp3',
    '**/*.wav'
  ],
  // CSS optimizations
  css: {
    devSourcemap: false
  },
  // Environment variables and build optimizations
  define: {
    __DEV__: process.env.NODE_ENV === 'development',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // Remove React DevTools in production
    __REACT_DEVTOOLS_GLOBAL_HOOK__: process.env.NODE_ENV === 'production' ? '({ isDisabled: true })' : undefined
  },
  // Resolve optimizations
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // Experimental features for better performance
  experimental: {
    renderBuiltUrl(filename, { hostType, type }) {
      if (type === 'asset' && /\.(glb|gltf)$/.test(filename)) {
        return `./models/${filename}`;
      }
      return filename;
    }
  },
  // Worker optimizations
  worker: {
    format: 'es',
    plugins: [react()]
  }
})
