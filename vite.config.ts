import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: '.', // 默认就是项目根目录
    build: {
        outDir: 'dist', // production 模式输出目录
        sourcemap: true,
    },
    server: {
        // 替代 devServer.static
        open: true, // 启动时自动打开浏览器
        host: '127.0.0.1',
        port: 8000,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, 'src'), // 设置别名
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
});
