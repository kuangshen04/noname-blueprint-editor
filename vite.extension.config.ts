import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: '.',
    build: {
        lib: {
            entry: 'src/extension.ts',
            fileName: (format) => `extension.js`,
            formats: ["es"],
        },
        outDir: 'dist',
        // sourcemap: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, 'src'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
});
