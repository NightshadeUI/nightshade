import vue from '@vitejs/plugin-vue';
import { Features } from 'lightningcss';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
        },
        rollupOptions: {
            external: ['vue'],
        },
        cssMinify: 'lightningcss',
    },
    css: {
        transformer: 'lightningcss',
        lightningcss: {
            cssModules: true,
            exclude: Features.LightDark
        }
    },
    plugins: [
        vue({}),
        dts({
            include: ['src/**'],
        }),
    ],
});
