import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      shared: path.resolve(import.meta.dirname, 'src/shared/ui'),
      assets: path.resolve(import.meta.dirname, 'src/assets'),
    },
  },
});
