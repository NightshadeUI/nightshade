import { cssLayer, cssLayerOrder } from '@nightshadeui/components/vite';
import { Features } from 'lightningcss';
import { createCssVariablesTheme } from 'shiki/core';
import { mergeConfig, UserConfig } from 'vitepress';

import { DocsThemeConfig } from '../config/DocsThemeConfig.js';
import { schemeStorageKey } from './commons.js';

const codeTheme = createCssVariablesTheme({
    name: 'nightshade-docs',
    variablePrefix: '--code-',
    fontStyle: true,
});

const schemeScript = `
try {
    const scheme = JSON.parse(localStorage.getItem('${schemeStorageKey}'));
    if (scheme === 'light' || scheme === 'dark') {
        document.documentElement.dataset.theme = scheme;
    }
} catch {}
`;

/**
 * The VitePress config of a documentation site on the Nightshade docs theme:
 * clean URLs, the scheme switch, code colors from the palette, and the build settings the theme needs.
 * The theme's components land in `nightshade-docs`; the site layers its own with `cssLayer()`.
 * `cssLayerOrder()` states Nightshade's layer order ahead of every stylesheet; a site's own layer
 * is named later, so it comes last. A site with several layers passes `cssLayerOrder([...])` itself.
 * Anything the site passes wins.
 */
export function defineDocsConfig(config: UserConfig<DocsThemeConfig>): UserConfig<DocsThemeConfig> {
    const defaults: UserConfig<DocsThemeConfig> = {
        cleanUrls: true,
        appearance: false,
        head: [
            [
                'script',
                {},
                schemeScript,
            ],
        ],
        markdown: {
            theme: codeTheme,
        },
        vite: docsViteConfig(),
    };
    return mergeConfig(defaults, config) as UserConfig<DocsThemeConfig>;
}

/**
 * The Vite settings the theme needs: its components in `nightshade-docs`, its sources compiled
 * rather than pre-bundled, and Lightning CSS.
 */
function docsViteConfig(): UserConfig['vite'] {
    return {
        // Ahead of the site's plugins, so the theme's sources are claimed first.
        plugins: [
            cssLayerOrder(),
            cssLayer('nightshade-docs', { dir: new URL('../../src/', import.meta.url) }),
        ],
        resolve: {
            dedupe: [
                'vue',
                'vitepress',
            ],
        },
        // The theme and the packages it reads ship Vue and TypeScript sources:
        // Vite compiles them and never pre-bundles them.
        optimizeDeps: {
            exclude: [
                '@nightshadeui/docs',
                '@nightshadeui/components',
                '@nightshadeui/particle-system',
                '@nightshadeui/util',
            ],
        },
        ssr: {
            noExternal: [
                /^@nightshadeui\//,
            ],
        },
        css: {
            transformer: 'lightningcss',
            lightningcss: {
                exclude: Features.LightDark,
            },
        },
        build: {
            cssMinify: 'lightningcss',
        },
    };
}
