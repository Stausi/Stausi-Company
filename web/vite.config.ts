import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(( {command} ) => ({
    base: './',
    define: {
        global: 'window'
    },
    build: {
        sourcemap: false,
        outDir: 'build',
    },
    optimizeDeps: {
        esbuildOptions: {
            mainFields: ['module', 'main'],
            resolveExtensions: ['.js', '.jsx']
        }
    },
    server: {
        port: 3000,
        open: true
    },
    plugins: [react()],
}));
