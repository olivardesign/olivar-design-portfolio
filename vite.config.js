import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portfolio: resolve(__dirname, 'portfolio/index.html'),
        architecture: resolve(__dirname, 'portfolio/architecture/index.html'),
        interiors: resolve(__dirname, 'portfolio/interiors/index.html'),
      },
    },
  },
});
