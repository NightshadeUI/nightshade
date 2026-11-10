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
        vite: {
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
        },
    };
    return mergeConfig(defaults, config) as UserConfig<DocsThemeConfig>;
}
