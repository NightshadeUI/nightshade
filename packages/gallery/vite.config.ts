import vue from '@vitejs/plugin-vue';
import { Features } from 'lightningcss';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        cssMinify: 'lightningcss',
    },
    css: {
        transformer: 'lightningcss',
        lightningcss: {
            cssModules: true,
            exclude: Features.LightDark,
        }
    },
    plugins: [
        vue(),
    ],
    server: {
        port: 8888
    }
});
