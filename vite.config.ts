import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const ENV = loadEnv(mode, process.cwd(), '');
  const CLIENT = ENV.VITE_CLIENT;

  return {
    plugins: [
      react(),
      {
        name: 'client-header-resolver',
        resolveId(id) {
          if (id === 'virtual:client-header') {
            const clientPath = path.resolve(__dirname, `src/layouts/header/clients/${CLIENT}/Header.tsx`);
            const globalPath = path.resolve(__dirname, 'src/layouts/header/global/Header.tsx');

            if (fs.existsSync(clientPath)) {
              return clientPath;
            } else {
              return globalPath;
            }
          }
        }
      },
    ],
    define: {
      __CLIENT__: JSON.stringify(ENV.VITE_CLIENT)
    },
  }
})