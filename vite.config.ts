import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig ( {
  plugins: [ react(), tailwindcss() ],
  resolve: { alias: { '@': resolve( __dirname, '.' ) } },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks ( id ) {
          if ( id.includes( 'node_modules' ) ) {
            if ( id.includes( 'lucide' ) ) return 'icons';
            if ( id.includes( 'recharts' ) ) return 'charts';
            if ( id.includes( 'motion' ) ) return 'motion';
            if ( id.includes( 'react' ) ) return 'react';
            return 'vendor';
          }
        }
      }
    }
  }
} );
