import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [
    react()
  ],
  base: './',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',

    assetsInlineLimit: 0,
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        toplevel: true, // Mangle top-level names
      },
    },
    rollupOptions: {
      output: {

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

          if (chunkInfo.name.includes('three')) return 'assets/js/three-[hash].js';
          if (chunkInfo.name.includes('mantine')) return 'assets/js/ui-[hash].js';
          if (chunkInfo.name.includes('Experience') || chunkInfo.name.includes('3D')) return 'assets/js/3d-[hash].js';
          if (chunkInfo.name.includes('Menu') || chunkInfo.name.includes('Interface')) return 'assets/js/ui-[hash].js';
          return 'assets/js/[name]-[hash].js';
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        manualChunks: {
          // 🚀 MOBILE OPTIMIZATION: Smaller initial chunks
          'three-core': ['three'],
          'three-fiber': ['@react-three/fiber'],
          'three-drei': ['@react-three/drei'],
          'three-stdlib': ['three-stdlib'],
          'ui-core': ['@mantine/core'],
          'ui-hooks': ['@mantine/hooks'],
          'react-core': ['react'],
          'react-dom': ['react-dom'],
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
          ],
          'audio-components': [
            './src/components/CrowdSound.jsx',
            './src/components/PunchSound.jsx'
          ]
        }
      },
    },
    target: 'es2020', // Modern target for smaller bundles
    
    // 🚀 MOBILE OPTIMIZATION: Pre-bundle dependencies for faster dev and smaller initial chunks
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
        './src/components/BarBasement.jsx',
        './src/components/CrowdSound.jsx',
        './src/components/PunchSound.jsx'
      ]
    },
    
    // 🚀 MOBILE OPTIMIZATION: Chunk size warnings
    chunkSizeWarningLimit: 500, // Warn if chunks are larger than 500KB
  },
  
  // Performance optimizations
  esbuild: {
    target: 'es2020',
    // Tree-shaking optimization
    treeShaking: true,
    // Remove unused code more aggressively
    drop: ['console', 'debugger'],
  },
  
  // Optimize CSS
  css: {
    devSourcemap: false,
    // 🚀 MOBILE OPTIMIZATION: CSS optimization (removed autoprefixer for now)
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
    __REACT_DEVTOOLS_GLOBAL_HOOK__: process.env.NODE_ENV === 'production' ? '({ isDisabled: true })' : undefined,
    // 🚀 MOBILE OPTIMIZATION: Add mobile detection
    'process.env.IS_MOBILE': JSON.stringify(true)
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
  },
  
  // 🚀 MOBILE OPTIMIZATION: Add compression
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
  }
})
