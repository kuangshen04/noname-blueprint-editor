import { build } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import zipSource from './zipSource'
import path from "path";

await build({
    root: '.',
    plugins: [
        zipSource(),
        viteStaticCopy({
            targets: [
                {
                    src: 'README.md',
                    dest: ''
                },
                {
                    src: 'LICENSE',
                    dest: ''
                },
                {
                    src: 'info.json',
                    dest: ''
                }
            ]
        })
    ],
    build: {
        lib: {
            entry: 'extension/extension.ts',
            fileName: (format) => `extension.js`,
            formats: ["es"],
        },
        outDir: 'dist',
    },
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, 'src'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
});

await build({
    root: '.',
    build: {
        lib:{
            entry: 'extension/iframe.ts',
            formats: ["es"],
        },
        outDir: 'dist/iframe',
    },
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, 'src'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    }
});
