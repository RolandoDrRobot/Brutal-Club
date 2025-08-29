#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting asset optimization for mobile performance...');

// Configuration
const config = {
  modelsDir: './public/models',
  musicDir: './public/music',
  assetsDir: './src/assets',
  maxModelSize: 2 * 1024 * 1024, // 2MB
  maxAudioSize: 500 * 1024, // 500KB
  maxImageSize: 100 * 1024, // 100KB
};

// Check if required tools are installed
function checkDependencies() {
  const tools = ['ffmpeg', 'imagemagick'];
  
  for (const tool of tools) {
    try {
      execSync(`which ${tool}`, { stdio: 'ignore' });
      console.log(`✅ ${tool} found`);
    } catch (error) {
      console.warn(`⚠️ ${tool} not found - some optimizations will be skipped`);
    }
  }
}

// Get file size in MB
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

// Optimize 3D models
function optimizeModels() {
  console.log('\n📦 Optimizing 3D models...');
  
  if (!fs.existsSync(config.modelsDir)) {
    console.log('❌ Models directory not found');
    return;
  }
  
  const files = fs.readdirSync(config.modelsDir);
  
  for (const file of files) {
    if (file.endsWith('.glb') || file.endsWith('.gltf')) {
      const filePath = path.join(config.modelsDir, file);
      const size = getFileSize(filePath);
      const sizeMB = (size / 1024 / 1024).toFixed(2);
      
      console.log(`📁 ${file}: ${sizeMB}MB`);
      
      if (size > config.maxModelSize) {
        console.warn(`⚠️ ${file} is too large (${sizeMB}MB > ${config.maxModelSize / 1024 / 1024}MB)`);
        console.log(`💡 Consider using a model optimizer like gltf-pipeline or Draco compression`);
      }
    }
  }
}

// Optimize audio files
function optimizeAudio() {
  console.log('\n🎵 Optimizing audio files...');
  
  if (!fs.existsSync(config.musicDir)) {
    console.log('❌ Music directory not found');
    return;
  }
  
  const files = fs.readdirSync(config.musicDir);
  
  for (const file of files) {
    if (file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg')) {
      const filePath = path.join(config.musicDir, file);
      const size = getFileSize(filePath);
      const sizeKB = (size / 1024).toFixed(2);
      
      console.log(`🎵 ${file}: ${sizeKB}KB`);
      
      if (size > config.maxAudioSize) {
        console.warn(`⚠️ ${file} is too large (${sizeKB}KB > ${config.maxAudioSize / 1024}KB)`);
        
        // Try to optimize with ffmpeg if available
        try {
          const outputPath = filePath.replace(/\.[^/.]+$/, '_optimized.mp3');
          const command = `ffmpeg -i "${filePath}" -b:a 128k -ar 44100 "${outputPath}" -y`;
          execSync(command, { stdio: 'ignore' });
          
          const newSize = getFileSize(outputPath);
          const newSizeKB = (newSize / 1024).toFixed(2);
          const savings = ((size - newSize) / size * 100).toFixed(1);
          
          console.log(`✅ Optimized ${file}: ${sizeKB}KB → ${newSizeKB}KB (${savings}% smaller)`);
          
          // Replace original with optimized version
          fs.unlinkSync(filePath);
          fs.renameSync(outputPath, filePath);
          
        } catch (error) {
          console.log(`❌ Failed to optimize ${file}: ${error.message}`);
        }
      }
    }
  }
}

// Optimize images
function optimizeImages() {
  console.log('\n🖼️ Optimizing images...');
  
  if (!fs.existsSync(config.assetsDir)) {
    console.log('❌ Assets directory not found');
    return;
  }
  
  const files = fs.readdirSync(config.assetsDir);
  
  for (const file of files) {
    if (file.match(/\.(png|jpg|jpeg|gif|webp)$/i)) {
      const filePath = path.join(config.assetsDir, file);
      const size = getFileSize(filePath);
      const sizeKB = (size / 1024).toFixed(2);
      
      console.log(`🖼️ ${file}: ${sizeKB}KB`);
      
      if (size > config.maxImageSize) {
        console.warn(`⚠️ ${file} is too large (${sizeKB}KB > ${config.maxImageSize / 1024}KB)`);
        
        // Try to optimize with ImageMagick if available
        try {
          const outputPath = filePath.replace(/\.[^/.]+$/, '_optimized.$1');
          const command = `convert "${filePath}" -quality 85 -strip "${outputPath}"`;
          execSync(command, { stdio: 'ignore' });
          
          const newSize = getFileSize(outputPath);
          const newSizeKB = (newSize / 1024).toFixed(2);
          const savings = ((size - newSize) / size * 100).toFixed(1);
          
          console.log(`✅ Optimized ${file}: ${sizeKB}KB → ${newSizeKB}KB (${savings}% smaller)`);
          
          // Replace original with optimized version
          fs.unlinkSync(filePath);
          fs.renameSync(outputPath, filePath);
          
        } catch (error) {
          console.log(`❌ Failed to optimize ${file}: ${error.message}`);
        }
      }
    }
  }
}

// Generate optimization report
function generateReport() {
  console.log('\n📊 Optimization Report:');
  console.log('========================');
  
  let totalSize = 0;
  let fileCount = 0;
  
  // Count models
  if (fs.existsSync(config.modelsDir)) {
    const modelFiles = fs.readdirSync(config.modelsDir).filter(f => f.match(/\.(glb|gltf)$/));
    const modelSize = modelFiles.reduce((sum, file) => {
      return sum + getFileSize(path.join(config.modelsDir, file));
    }, 0);
    console.log(`📦 3D Models: ${modelFiles.length} files, ${(modelSize / 1024 / 1024).toFixed(2)}MB`);
    totalSize += modelSize;
    fileCount += modelFiles.length;
  }
  
  // Count audio
  if (fs.existsSync(config.musicDir)) {
    const audioFiles = fs.readdirSync(config.musicDir).filter(f => f.match(/\.(mp3|wav|ogg)$/));
    const audioSize = audioFiles.reduce((sum, file) => {
      return sum + getFileSize(path.join(config.musicDir, file));
    }, 0);
    console.log(`🎵 Audio: ${audioFiles.length} files, ${(audioSize / 1024 / 1024).toFixed(2)}MB`);
    totalSize += audioSize;
    fileCount += audioFiles.length;
  }
  
  // Count images
  if (fs.existsSync(config.assetsDir)) {
    const imageFiles = fs.readdirSync(config.assetsDir).filter(f => f.match(/\.(png|jpg|jpeg|gif|webp)$/i));
    const imageSize = imageFiles.reduce((sum, file) => {
      return sum + getFileSize(path.join(config.assetsDir, file));
    }, 0);
    console.log(`🖼️ Images: ${imageFiles.length} files, ${(imageSize / 1024).toFixed(2)}KB`);
    totalSize += imageSize;
    fileCount += imageFiles.length;
  }
  
  console.log(`\n📈 Total: ${fileCount} files, ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
  
  // Performance recommendations
  console.log('\n💡 Performance Recommendations:');
  console.log('================================');
  
  if (totalSize > 20 * 1024 * 1024) { // 20MB
    console.log('⚠️ Total assets are quite large (>20MB)');
    console.log('   - Consider implementing progressive loading');
    console.log('   - Use WebP format for images');
    console.log('   - Compress 3D models with Draco');
    console.log('   - Use lower quality audio for mobile');
  }
  
  console.log('✅ Asset optimization complete!');
}

// Main execution
function main() {
  try {
    checkDependencies();
    optimizeModels();
    optimizeAudio();
    optimizeImages();
    generateReport();
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

main();
