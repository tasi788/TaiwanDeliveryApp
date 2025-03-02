import { defineConfig } from 'vite'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import fs from 'fs';

const serviceFiles = fs.readdirSync(path.resolve(__dirname, 'src/service'))
    .filter(file => file.endsWith('.ts'))
    .reduce((entries, file) => {
        const name = path.parse(file).name;
        entries[name] = path.resolve(__dirname, 'src/service', file);
        return entries;
    }, {});

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
                injectScript: path.resolve(__dirname, 'src/injectScript/kkren.ts'),
                ...serviceFiles
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'background') {
                        return 'background.js';
                    }
                    if (chunkInfo.name === 'injectScript') {
                        return 'injectScript.js';
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