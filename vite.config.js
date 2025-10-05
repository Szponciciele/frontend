import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  // Explicit asset handling
  assetsInclude: ['**/*.json', '**/*.svg', '**/*.png', '**/*.jpg', '**/*.webp'],
  
  build: {
    // Asset file names
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep original names for certain file types
          if (assetInfo.name?.endsWith('.json') || 
              assetInfo.name?.endsWith('.svg')) {
            return 'assets/[name][extname]';
          }
          // Use hash for images and other assets
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  
  plugins: [
    {
      name: 'copy-assets',
      writeBundle() {
        // Copy assets folder to dist/assets
        const copyDir = (src, dest) => {
          try {
            mkdirSync(dest, { recursive: true });
            const entries = readdirSync(src);
            
            for (const entry of entries) {
              const srcPath = join(src, entry);
              const destPath = join(dest, entry);
              
              if (statSync(srcPath).isDirectory()) {
                copyDir(srcPath, destPath);
              } else {
                copyFileSync(srcPath, destPath);
              }
            }
          } catch (err) {
            console.log('Copy assets warning:', err.message);
          }
        };
        
        copyDir('assets', 'dist/assets');
      }
    }
  ]
});