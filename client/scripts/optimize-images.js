#!/usr/bin/env node

/**
 * Script para optimizar imágenes automáticamente
 * Convierte PNG/JPG a WebP y AVIF para mejor rendimiento
 * 
 * Uso: npm run optimize-images
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const CONFIG = {
  inputDir: path.join(__dirname, '../src/assets'),
  outputDir: path.join(__dirname, '../src/assets/optimized'),
  quality: {
    webp: 80,
    avif: 60
  },
  // Formatos de entrada soportados
  supportedFormats: ['.png', '.jpg', '.jpeg'],
  // Tamaño mínimo para optimizar (en bytes)
  minSize: 1024 * 10, // 10KB
};

/**
 * Verifica si ImageMagick está instalado
 */
function checkImageMagick() {
  try {
    execSync('magick -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifica si sharp está disponible (alternativa a ImageMagick)
 */
function checkSharp() {
  try {
    require.resolve('sharp');
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene todas las imágenes del directorio
 */
function getImages(dir) {
  const images = [];
  
  function scanDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (CONFIG.supportedFormats.includes(ext) && stat.size > CONFIG.minSize) {
          images.push({
            fullPath,
            relativePath: path.relative(CONFIG.inputDir, fullPath),
            name: path.parse(file).name,
            ext,
            size: stat.size
          });
        }
      }
    }
  }
  
  scanDir(dir);
  return images;
}

/**
 * Convierte imagen usando ImageMagick
 */
function convertWithImageMagick(inputPath, outputPath, format, quality) {
  const cmd = `magick "${inputPath}" -quality ${quality} "${outputPath}"`;
  execSync(cmd, { stdio: 'inherit' });
}

/**
 * Convierte imagen usando Sharp (si está disponible)
 */
async function convertWithSharp(inputPath, outputPath, format, quality) {
  const sharp = await import('sharp');
  
  let pipeline = sharp.default(inputPath);
  
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality });
  } else if (format === 'avif') {
    pipeline = pipeline.avif({ quality });
  }
  
  await pipeline.toFile(outputPath);
}

/**
 * Optimiza una imagen individual
 */
async function optimizeImage(image, useSharp = false) {
  const baseName = image.name;
  const inputPath = image.fullPath;
  
  // Crear directorio de salida si no existe
  const outputDir = path.join(CONFIG.outputDir, path.dirname(image.relativePath));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log(`\n🖼️  Optimizando: ${image.relativePath} (${(image.size / 1024).toFixed(1)}KB)`);
  
  const results = [];
  
  // Convertir a WebP
  try {
    const webpPath = path.join(outputDir, `${baseName}.webp`);
    
    if (useSharp) {
      await convertWithSharp(inputPath, webpPath, 'webp', CONFIG.quality.webp);
    } else {
      convertWithImageMagick(inputPath, webpPath, 'webp', CONFIG.quality.webp);
    }
    
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((image.size - webpSize) / image.size * 100).toFixed(1);
    
    results.push({
      format: 'WebP',
      path: webpPath,
      originalSize: image.size,
      newSize: webpSize,
      savings: savings
    });
    
    console.log(`  ✅ WebP: ${(webpSize / 1024).toFixed(1)}KB (-${savings}%)`);
  } catch (error) {
    console.log(`  ❌ Error WebP: ${error.message}`);
  }
  
  // Convertir a AVIF
  try {
    const avifPath = path.join(outputDir, `${baseName}.avif`);
    
    if (useSharp) {
      await convertWithSharp(inputPath, avifPath, 'avif', CONFIG.quality.avif);
    } else {
      convertWithImageMagick(inputPath, avifPath, 'avif', CONFIG.quality.avif);
    }
    
    const avifSize = fs.statSync(avifPath).size;
    const savings = ((image.size - avifSize) / image.size * 100).toFixed(1);
    
    results.push({
      format: 'AVIF',
      path: avifPath,
      originalSize: image.size,
      newSize: avifSize,
      savings: savings
    });
    
    console.log(`  ✅ AVIF: ${(avifSize / 1024).toFixed(1)}KB (-${savings}%)`);
  } catch (error) {
    console.log(`  ❌ Error AVIF: ${error.message}`);
  }
  
  return results;
}

/**
 * Genera un reporte de optimización
 */
function generateReport(results) {
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1);
  
  console.log('\n📊 REPORTE DE OPTIMIZACIÓN');
  console.log('================================');
  console.log(`📁 Imágenes procesadas: ${results.length}`);
  console.log(`📏 Tamaño original: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`📏 Tamaño optimizado: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`💾 Ahorro total: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)}MB (-${totalSavings}%)`);
  
  // Mostrar mejores optimizaciones
  const bestSavings = results
    .sort((a, b) => parseFloat(b.savings) - parseFloat(a.savings))
    .slice(0, 5);
  
  console.log('\n🏆 MEJORES OPTIMIZACIONES:');
  bestSavings.forEach((result, i) => {
    console.log(`${i + 1}. ${path.basename(result.path)} - ${result.savings}% de ahorro`);
  });
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando optimización de imágenes...\n');
  
  // Verificar herramientas disponibles
  const hasImageMagick = checkImageMagick();
  const hasSharp = checkSharp();
  
  if (!hasImageMagick && !hasSharp) {
    console.error('❌ Error: No se encontró ImageMagick ni Sharp.');
    console.error('🔧 Instala una de estas herramientas:');
    console.error('   - ImageMagick: https://imagemagick.org/script/download.php');
    console.error('   - Sharp: npm install sharp');
    process.exit(1);
  }
  
  const useSharp = hasSharp;
  console.log(`🛠️  Usando: ${useSharp ? 'Sharp' : 'ImageMagick'}`);
  
  // Buscar imágenes
  const images = getImages(CONFIG.inputDir);
  
  if (images.length === 0) {
    console.log('📭 No se encontraron imágenes para optimizar.');
    return;
  }
  
  console.log(`📸 Encontradas ${images.length} imágenes para optimizar:`);
  images.forEach(img => {
    console.log(`   - ${img.relativePath} (${(img.size / 1024).toFixed(1)}KB)`);
  });
  
  // Crear directorio de salida
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  
  // Optimizar cada imagen
  const allResults = [];
  for (const image of images) {
    const results = await optimizeImage(image, useSharp);
    allResults.push(...results);
  }
  
  // Generar reporte
  if (allResults.length > 0) {
    generateReport(allResults);
    
    console.log('\n💡 RECOMENDACIONES:');
    console.log('1. Actualiza tus imports para usar las versiones optimizadas');
    console.log('2. Usa el hook useOptimizedImage para carga automática de formatos');
    console.log('3. Configura tu servidor para servir .avif y .webp con los headers correctos');
    console.log('\n✨ ¡Optimización completada!');
  } else {
    console.log('\n⚠️  No se pudieron optimizar las imágenes.');
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { optimizeImage, getImages }; 