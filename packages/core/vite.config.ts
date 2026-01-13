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
            exclude: Features.LightDark,
        }
    },
    plugins: [
        vue({}),
        dts({
            include: ['src/**'],
        }),
        {
            name: 'css-layer',
            enforce: 'pre',
            transform(code, id) {
                if (!id.endsWith('.vue')) {
                    return;
                }
                return code.replace(/<style(\s+[^>]*)?>([\s\S]*?)<\/style>/g,
                    (_, tag, css) => {
                        return `<style${tag}>@layer nightshade-core {${css}}</style>`;
                    });
            },
        }
    ],
});
