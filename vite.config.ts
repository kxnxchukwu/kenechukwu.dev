import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['**/__tests__/**/*.{ts,tsx}'],
    coverage: {
      exclude: ['**/index.ts', '**/*.css', '**/main.tsx']
    }
  },
  css: {
    postcss: {
      plugins: [tailwind, autoprefixer]
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          mui: ['@mui/icons-material', '@mui/joy']
        }
      },
      treeshake: {
        moduleSideEffects: false
      }
    }
  }
});
