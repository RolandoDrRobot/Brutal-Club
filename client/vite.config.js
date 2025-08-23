import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  base: './',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // CRITICAL: Disable inlining for all assets to avoid MIME type issues
    assetsInlineLimit: 0,
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // OPTIMIZED: Advanced code splitting for better caching and load times
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          
          if (/\.(mp3|wav|ogg|flac)$/i.test(assetInfo.name)) {
            return `assets/audio/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          if (/\.(glb|gltf)$/i.test(assetInfo.name)) {
            return `assets/models/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: (chunkInfo) => {
          // Create separate chunks for different types of components
          if (chunkInfo.name.includes('three')) return 'assets/js/three-[hash].js';
          if (chunkInfo.name.includes('mantine')) return 'assets/js/ui-[hash].js';
          if (chunkInfo.name.includes('Experience') || chunkInfo.name.includes('3D')) return 'assets/js/3d-[hash].js';
          if (chunkInfo.name.includes('Menu') || chunkInfo.name.includes('Interface')) return 'assets/js/ui-[hash].js';
          return 'assets/js/[name]-[hash].js';
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        manualChunks: {
          // Vendor chunks for better caching
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', 'three-stdlib'],
          'ui-vendor': ['@mantine/core', '@mantine/hooks'],
          'react-vendor': ['react', 'react-dom'],
          // Separate chunks for heavy components that load on demand
          'menu-screens': [
            './src/components/MainMenu.jsx',
            './src/components/Shop.jsx', 
            './src/components/CharacterSkillTree.jsx',
            './src/components/CombinedShopOpponents.jsx'
          ],
          '3d-components': [
            './src/components/Audience.jsx',
            './src/components/BarBasement.jsx'
          ]
        }
      },
    },
    target: 'es2020', // Modern target for smaller bundles
    
    // OPTIMIZED: Pre-bundle dependencies for faster dev and smaller initial chunks
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@mantine/core',
        '@mantine/hooks',
        '@react-three/fiber',
        '@react-three/drei',
        'three',
        'three-stdlib'
      ],
      exclude: [
        // Exclude heavy optional dependencies from initial bundle
        './src/components/Audience.jsx',
        './src/components/BarBasement.jsx'
      ]
    },
  },
  
  // Performance optimizations
  esbuild: {
    target: 'es2020',
    // Tree-shaking optimization
    treeShaking: true,
  },
  
  // Optimize CSS
  css: {
    devSourcemap: false,
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
