import { fileURLToPath } from 'node:url';

import { Features } from 'lightningcss';
import { createCssVariablesTheme } from 'shiki/core';
import { defineConfig } from 'vitepress';

import { schemeStorageKey } from '../helpers/commons.js';

const codeTheme = createCssVariablesTheme({
    name: 'nightshade',
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

export default defineConfig({
    srcDir: 'pages',
    title: 'Nightshade',
    description: 'The seed for your own design system: CSS variables first, Vue primitives optional.',
    cleanUrls: true,
    titleTemplate: ':title · Nightshade',
    lang: 'en-US',
    appearance: false,
    head: [
        [
            'link',
            {
                rel: 'icon',
                href: '/favicon.svg',
            },
        ],
        [
            'link',
            {
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com',
            },
        ],
        [
            'link',
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossorigin: 'crossorigin',
            },
        ],
        [
            'link',
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&family=Source+Sans+3:ital,wght@0,300..700;1,300..700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap',
            },
        ],
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
        publicDir: fileURLToPath(new URL('../public', import.meta.url)),
        css: {
            transformer: 'lightningcss',
            lightningcss: {
                cssModules: true,
                exclude: Features.LightDark,
            },
        },
        build: {
            cssMinify: 'lightningcss',
        },
    },
});
