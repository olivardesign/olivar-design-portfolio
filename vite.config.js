import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import consultationHandler from './api/consultation.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      {
        name: 'olivar-local-api-middleware',
        configureServer(server) {
          server.middlewares.use('/api/consultation', (req, res) => {
            // Reload .env.local dynamically on each request during development
            const freshEnv = loadEnv(mode, process.cwd(), '');
            Object.assign(process.env, freshEnv);

            let rawBody = '';
            req.on('data', chunk => {
              rawBody += chunk;
            });
            req.on('end', async () => {
              req.body = rawBody;
              await consultationHandler(req, res);
            });
          });
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          portfolio: resolve(__dirname, 'portfolio/index.html'),
          architecture: resolve(__dirname, 'portfolio/architecture/index.html'),
          interiors: resolve(__dirname, 'portfolio/interiors/index.html'),
          consultation: resolve(__dirname, 'consultation/index.html'),
        },
      },
    },
  };
});
