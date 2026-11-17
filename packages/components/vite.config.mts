import { dirname, relative } from 'node:path';

import vue from '@vitejs/plugin-vue';
import { Features } from 'lightningcss';
import { defineConfig, Plugin } from 'vite';
import dts from 'vite-plugin-dts';

import { cssLayer } from './vite.mjs';

/**
 * Each module imports the CSS of the components it holds, so importing one component brings only its styles.
 * `components.css` still holds them all, for apps that link every style at once.
 */
function injectCss(): Plugin {
    return {
        name: 'inject-css',
        apply: 'build',
        enforce: 'post',
        generateBundle(_options, bundle) {
            const allCss: string[] = [];
            for (const file of Object.values(bundle)) {
                if (file.type === 'asset' && file.fileName.endsWith('.css')) {
                    allCss.push(String(file.source));
                }
                if (file.type !== 'chunk') {
                    continue;
                }
                const css = [...(file.viteMetadata?.importedCss ?? [])];
                if (!css.length) {
                    continue;
                }
                const imports = css.map(cssFile => {
                    const path = relative(dirname(file.fileName), cssFile);
                    return `import '${path.startsWith('.') ? path : './' + path}';`;
                });
                file.code = imports.join('\n') + '\n' + file.code;
            }
            this.emitFile({
                type: 'asset',
                fileName: 'components.css',
                source: allCss.join('\n'),
            });
        },
    };
}

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
        },
        cssCodeSplit: true,
        cssMinify: 'lightningcss',
        rollupOptions: {
            external: ['vue', /^@nightshadeui\//],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
                // `components/Btn.vue_vue_type_style_index_0_scoped_….css` → `components/Btn.css`
                assetFileNames: asset => asset.names[0].replace(/\.vue_vue_type_style.*$/, '.css'),
            },
        },
    },
    css: {
        transformer: 'lightningcss',
        lightningcss: {
            cssModules: true,
            exclude: Features.LightDark,
        },
    },
    plugins: [
        cssLayer('nightshade-components'),
        vue({}),
        dts({
            include: ['src/**'],
        }),
        injectCss(),
    ],
});
