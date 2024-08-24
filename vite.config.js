import { defineConfig } from 'vite'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    css: {
        preprocessorOptions: {
            sass: {
                additionalData: `@import "@/index.sass";`,
            },
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                popup: path.resolve(__dirname, 'popup.html'),
                background: path.resolve(__dirname, 'src/background.ts'),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'background') {
                        return 'background.js';
                    }
                    return '[name]-[hash].js';
                }
            }
        },
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'manifest.json',
                    dest: ''
                },
                {
                    src: 'services.json',
                    dest: ''
                },
                {
                    src: 'images',
                    dest: ''
                },
            ]
        })
    ]
})