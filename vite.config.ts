import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createAutoLayoutPlugin } from './src/utils/autoLayoutPlugin';
import { copyLogoPlugin } from './src/utils/copyLogoPlugin';

export default defineConfig(({ mode }) => {
  const ENV = loadEnv(mode, process.cwd(), '');
  const CLIENT = ENV.VITE_CLIENT || 'default';

  console.debug('env CLIENT: ', CLIENT);
  copyLogoPlugin(CLIENT, 'DEV');

  return {
    plugins: [
      react(),
      createAutoLayoutPlugin(CLIENT),
      copyLogoPlugin(CLIENT, 'BUILD'),
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
        { find: "@utils", replacement: path.resolve(__dirname, "./src/utils") },
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