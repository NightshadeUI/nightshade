import { fileURLToPath } from 'node:url';

const NIGHTSHADE_LAYERS = ['nightshade', 'nightshade-docs', 'nightshade-components'];

/**
 * A Vite plugin that states the cascade layer order ahead of every stylesheet: Nightshade's layers,
 * weakest first, then the app's. Otherwise the first stylesheet to name a layer sets the order, and
 * that is rarely the CSS entry: in dev a component's style loads first, and in a build a code-split
 * chunk (or a VitePress bundle) can. It prepends the statement to every CSS file the build emits, and
 * to `index.html` for dev. For sites with no `index.html` of their own, such as VitePress (the docs
 * theme uses it); an app states the order first in its `index.html` instead, and component libraries
 * never list it.
 *
 * @param {string[]} [layers] The app's own layers, after Nightshade's: `['primevue', 'acme']`.
 * @returns {import('vite').Plugin}
 */
export function cssLayerOrder(layers = []) {
    const statement = `@layer ${[...NIGHTSHADE_LAYERS, ...layers].join(', ')};`;
    return {
        name: 'nightshade-css-layer-order',
        transformIndexHtml: {
            order: 'pre',
            handler() {
                return [
                    {
                        tag: 'style',
                        children: statement,
                        injectTo: 'head-prepend',
                    },
                ];
            },
        },
        // After Vite's own CSS plugin, which emits a single-file bundle in this hook.
        generateBundle: {
            order: 'post',
            handler(_options, bundle) {
                for (const file of Object.values(bundle)) {
                    if (file.type === 'asset' && file.fileName.endsWith('.css')) {
                        file.source = `${statement}\n${String(file.source)}`;
                    }
                }
            },
        },
    };
}

/**
 * A Vite plugin that puts the styles of Vue single-file components in a cascade layer, so a
 * component's `<style>` never writes `@layer` itself.
 *
 * It wraps each style block's own module (`Foo.vue?vue&type=style…`), not the SFC source, so blocks
 * that a hot update reloads straight from disk land in the layer too. Any file compiled as an SFC
 * counts, such as a VitePress page's `<style>`.
 *
 * Without `dir`, it takes every SFC outside `node_modules`. With `dir`, only the SFCs under it,
 * wherever that is. A block that already opens with `@layer` is left alone, so the first plugin to
 * claim a file wins: list narrower ones (`dir`) before a catch-all. Put it before `vue()`.
 *
 * @param {string} layer The cascade layer: `nightshade-components` for a component library, the
 *     app's or system's own layer (`acme`) otherwise.
 * @param {{ dir?: string | URL }} [options]
 * @returns {import('vite').Plugin}
 */
export function cssLayer(layer, options = {}) {
    const dir = options.dir ? toDirPrefix(options.dir) : null;
    return {
        name: `nightshade-css-layer:${layer}`,
        enforce: 'pre',
        transform(code, id) {
            const [file, query = ''] = id.split('?', 2);
            if (!/(?:^|&)vue(?:&|$)/.test(query) || !/(?:^|&)type=style(?:&|$)/.test(query)) {
                return;
            }
            const included = dir ? file.startsWith(dir) : !file.includes('/node_modules/');
            if (!included || /^\s*@layer\b/.test(code)) {
                return;
            }
            return {
                code: `@layer ${layer} {${code}}`,
                map: null,
            };
        },
    };
}

/**
 * @param {string | URL} dir
 */
function toDirPrefix(dir) {
    const path = dir instanceof URL ? fileURLToPath(dir) : dir;
    return path.replaceAll('\\', '/').replace(/\/?$/, '/');
}
