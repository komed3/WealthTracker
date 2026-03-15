import { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig( ( { mode } ) => {
    const env = loadEnv( mode, process.cwd(), '' );

    return {
        plugins: [ react(), tailwindcss() ],
        define: { 'process.env.GEMINI_API_KEY': JSON.stringify( env.GEMINI_API_KEY || '' ) },
        resolve: { alias: { '@': resolve( __dirname, '.' ) } },
        server: { hmr: process.env.DISABLE_HMR !== 'true' },
        build: { rollupOptions: { output: { manualChunks( id ) {
            if ( id.includes( 'node_modules' ) ) {
                return id.toString().split( 'node_modules/' )[ 1 ].split( '/' )[ 0 ].toString();
            }
        } } } }
    };
} );
