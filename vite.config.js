import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true,
  },
  resolve: 
  {
  alias: {
    'shared': path.resolve(__dirname, 'src/shared/ui'),
    'assets': path.resolve(__dirname, 'src/assets')
    }
  }
});

