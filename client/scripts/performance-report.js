#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Performance Analysis Report');
console.log('================================\n');

// Bundle Analysis
console.log('📊 Bundle Size Analysis:');
try {
  const buildOutput = execSync('yarn build 2>/dev/null', { cwd: path.join(__dirname, '..') });
  
  // Calculate total JS bundle size
  const distPath = path.join(__dirname, '../dist');
  const jsFiles = [];
  
  function scanJSFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        scanJSFiles(filePath);
      } else if (file.endsWith('.js')) {
        const size = stat.size;
        jsFiles.push({ name: file, size, path: filePath });
      }
    });
  }
  
  if (fs.existsSync(distPath)) {
    scanJSFiles(distPath);
    
    const totalJSSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
    const totalJSSizeKB = Math.round(totalJSSize / 1024);
    
    console.log(`📦 Total JavaScript: ${totalJSSizeKB} KB`);
    
    // Show largest bundles
    const largestBundles = jsFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
      .map(file => `  ${file.name}: ${Math.round(file.size / 1024)} KB`);
    
    console.log('🎯 Largest bundles:');
    largestBundles.forEach(bundle => console.log(bundle));
  }
  
} catch (error) {
  console.log('⚠️ Could not analyze build output');
}

console.log('\n📱 Mobile Optimization Checklist:');

// Check for critical optimizations
const checks = [
  {
    name: 'Lazy Loading Components',
    check: () => {
      const appFile = fs.readFileSync(path.join(__dirname, '../src/App.jsx'), 'utf8');
      return appFile.includes('React.lazy') ? '✅' : '❌';
    }
  },
  {
    name: 'Image Optimization',
    check: () => {
      return fs.existsSync(path.join(__dirname, '../src/assets/optimized')) ? '✅' : '❌';
    }
  },
  {
    name: 'Service Worker',
    check: () => {
      const swFile = path.join(__dirname, '../public/sw.js');
      return fs.existsSync(swFile) ? '✅' : '❌';
    }
  },
  {
    name: 'Preload Critical Assets',
    check: () => {
      const htmlFile = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
      return htmlFile.includes('rel="preload"') ? '✅' : '❌';
    }
  },
  {
    name: 'Font Display Swap',
    check: () => {
      const htmlFile = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
      return htmlFile.includes('display=swap') ? '✅' : '❌';
    }
  },
  {
    name: 'Bundle Splitting',
    check: () => {
      const viteConfig = fs.readFileSync(path.join(__dirname, '../vite.config.js'), 'utf8');
      return viteConfig.includes('manualChunks') ? '✅' : '❌';
    }
  }
];

checks.forEach(({ name, check }) => {
  console.log(`${check()} ${name}`);
});

console.log('\n🎯 Next Optimizations to Consider:');
console.log('• ⚡ HTTP/2 Push for critical resources');
console.log('• 📦 Brotli compression on server');
console.log('• 🎨 Critical CSS extraction');
console.log('• 📱 Progressive Web App features');
console.log('• 🔄 Background sync for offline support');

console.log('\n✨ Report generated successfully!');
