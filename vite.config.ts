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
        name: 'client-login-resolver',
        resolveId(id) {
          if (id === 'virtual:client-login') {
            const clientPath = path.resolve(__dirname, `src/layouts/login/clients/${CLIENT}/Login.tsx`);
            const globalPath = path.resolve(__dirname, 'src/layouts/login/global/Login.tsx');

            if (fs.existsSync(clientPath)) {
              return clientPath;
            } else {
              return globalPath;
            }
          }
        }
      },
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
      {
        name: 'client-menu-resolver',
        resolveId(id) {
          if (id === 'virtual:client-menu') {
            const clientPath = path.resolve(__dirname, `src/layouts/menu/clients/${CLIENT}/Menu.tsx`);
            const globalPath = path.resolve(__dirname, 'src/layouts/menu/global/Menu.tsx');

            if (fs.existsSync(clientPath)) {
              return clientPath;
            } else {
              return globalPath;
            }
          }
        }
      },
      {
        name: 'client-book-resolver',
        resolveId(id) {
          if (id === 'virtual:client-bookList') {
            const clientPath = path.resolve(__dirname, `src/layouts/books/book-list/clients/${CLIENT}/BookList.tsx`);
            const globalPath = path.resolve(__dirname, 'src/layouts/books/book-list/global/BookList.tsx');

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
    resolve: {
      alias: [
        { find: "@data", replacement: path.resolve(__dirname, "./src/data") },
        { find: "@layouts", replacement: path.resolve(__dirname, "./src/layouts") },
        { find: "@plugins", replacement: path.resolve(__dirname, "./src/plugins") },
        { find: "@services", replacement: path.resolve(__dirname, "./src/services") },
      ],
    },
    server: {
      proxy: {
        '/aladin': {
          target: ENV.VITE_ALADIN_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/aladin/, ''), // '/aladin' 제거
        },
      },
    },
  }
})