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
    // Habilitar code splitting agresivo
    rollupOptions: {
      output: {
        // Separar dependencias grandes en chunks propios
        manualChunks: {
          // React y React DOM en su propio chunk
          'react-vendor': ['react', 'react-dom'],
          // Three.js y R3F en su propio chunk (son las librerías más pesadas)
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Mantine UI en su propio chunk
          'mantine-vendor': ['@mantine/core', '@mantine/hooks', '@emotion/react']
        },
        // Nombres descriptivos para mejor caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? 
            chunkInfo.facadeModuleId.split('/').pop().replace('.jsx', '') : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        // Nombres para assets
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Optimizaciones de tamaño
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remover console.logs en producción
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remover funciones específicas
        passes: 2 // Múltiples pasadas de optimización
      },
      mangle: {
        safari10: true // Compatibilidad con Safari 10
      },
      format: {
        comments: false // Remover comentarios
      }
    },
    // Chunks más pequeños para mejor caching
    chunkSizeWarningLimit: 1000,
    // Habilitar sourcemaps solo en desarrollo
    sourcemap: process.env.NODE_ENV === 'development',
    // Reportar compresión de archivos
    reportCompressedSize: true,
    // Target para compatibilidad
    target: 'es2020'
  },
  // Optimizaciones de dependencias
  optimizeDeps: {
    // Pre-bundle estas dependencias críticas
    include: [
      'react', 
      'react-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@mantine/core',
      '@mantine/hooks'
    ],
    // Excluir dependencias que pueden causar problemas
    exclude: []
  },
  // Configuración del servidor de desarrollo
  server: {
    // Habilitar compresión gzip
    middlewareMode: false,
    hmr: {
      overlay: false // Reducir overhead en desarrollo
    }
  },
  // Configuración de assets
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr', '**/*.exr'],
  // Configuración de preprocessing
  css: {
    devSourcemap: false // Desactivar sourcemaps CSS en producción
  },
  // Configuración para mejor tree-shaking
  define: {
    // Eliminar checks de desarrollo en producción
    __DEV__: process.env.NODE_ENV === 'development',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
})
