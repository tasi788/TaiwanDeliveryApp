import { defineConfig } from 'vite'

export default defineConfig({
    css: {
        preprocessorOptions: {
            sass: {
                additionalData: `@import "@/index.sass";`, // Replace with your Sass file path
            },
        },
    },
})