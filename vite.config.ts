import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: '.',
    server: {
        open: true,
        host: '127.0.0.1',
        port: 8000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, 'src'),
            // iframe在无名杀extension的路径，分析依赖时在iframe.html中引用
            ['extension/Blockly测试扩展/iframe/blockly-editor.js']: path.resolve(__dirname, 'extension/iframe.ts'),
            ['extension/Blockly测试扩展/iframe/blockly-editor.css']: path.resolve(__dirname, 'extension/iframe.css'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    }
});
