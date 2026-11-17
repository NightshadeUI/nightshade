import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineDocsConfig } from '@nightshadeui/docs/config';
import { cssLayer } from '@nightshadeui/vite';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

export default defineDocsConfig({
    srcDir: 'pages',
    // GitHub Pages serves the project at https://nightshadeui.github.io/nightshade/.
    base: '/nightshade/',
    title: 'Nightshade',
    description: 'The seed for your own design system: CSS variables first, Vue primitives optional.',
    titleTemplate: ':title · Nightshade',
    lang: 'en-US',
    head: [
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
                href: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&family=Source+Sans+3:ital,wght@0,300..700;1,300..700&family=Fraunces&display=swap',
            },
        ],
    ],
    themeConfig: {
        brand: {
            name: 'Nightshade',
            version: version.split('.').slice(0, 2).join('.'),
        },
        social: [
            {
                title: 'GitHub',
                icon: 'fab fa-github',
                link: 'https://github.com/NightshadeUI/nightshade',
            },
        ],
        variableView: 'foundation',
        footer: {
            note: 'A seed for design systems. This site is grown from it: ' +
                'the same tokens, the same primitives, its own :root.',
            legal: 'ISC License · Boris Okunskiy and contributors',
        },
        topLinks: [
            {
                title: 'Philosophy',
                link: '/philosophy/',
            },
            {
                title: 'Styles',
                link: '/styles/',
            },
            {
                title: 'Variables',
                link: '/variables',
            },
            {
                title: 'Components',
                link: '/components/',
            },
            {
                title: 'Palette Studio',
                link: '/studio',
            },
        ],
        sections: [
            {
                id: 'philosophy',
                title: 'Philosophy',
                link: '/philosophy/',
                pages: [
                    {
                        title: 'The seed',
                        link: '/philosophy/',
                    },
                    {
                        title: 'The model',
                        link: '/philosophy/layers',
                    },
                    {
                        title: 'Growing your own',
                        link: '/philosophy/ownership',
                    },
                ],
            },
            {
                id: 'styles',
                title: 'Styles',
                link: '/styles/',
                pages: [
                    {
                        title: 'Tokens',
                        link: '/styles/',
                    },
                    {
                        title: 'Color',
                        link: '/styles/color',
                    },
                    {
                        title: 'Tones and roles',
                        link: '/styles/tones',
                    },
                    {
                        title: 'Space and sizing',
                        link: '/styles/sizing',
                    },
                    {
                        title: 'Typography',
                        link: '/styles/typography',
                    },
                    {
                        title: 'Depth',
                        link: '/styles/depth',
                    },
                    {
                        title: 'Base and utilities',
                        link: '/styles/base',
                    },
                    {
                        title: 'Palette and CLI',
                        link: '/styles/palette',
                    },
                ],
            },
            {
                id: 'components',
                title: 'Components',
                link: '/components/',
                pages: [
                    {
                        title: 'Control grammar',
                        link: '/components/',
                    },
                    {
                        title: 'Button',
                        link: '/components/button',
                    },
                    {
                        title: 'Chip',
                        link: '/components/chip',
                    },
                    {
                        title: 'Text inputs',
                        link: '/components/inputs',
                    },
                    {
                        title: 'Toggle and checkbox',
                        link: '/components/toggle',
                    },
                    {
                        title: 'Slider',
                        link: '/components/slider',
                    },
                    {
                        title: 'Layout',
                        link: '/components/layout',
                    },
                    {
                        title: 'Overlays and menus',
                        link: '/components/overlays',
                    },
                ],
            },
            {
                id: 'opt-ins',
                title: 'Opt-ins',
                link: '/opt-ins/',
                pages: [
                    {
                        title: 'Overview',
                        link: '/opt-ins/',
                    },
                    {
                        title: 'Canvas',
                        link: '/opt-ins/canvas',
                    },
                    {
                        title: 'Particle system',
                        link: '/opt-ins/particles',
                    },
                    {
                        title: 'Scroller',
                        link: '/opt-ins/scroller',
                    },
                    {
                        title: 'Docs theme',
                        link: '/opt-ins/docs',
                    },
                ],
            },
            {
                id: 'release',
                title: 'Release',
                link: '/migration',
                pages: [
                    {
                        title: 'Migrating to 3.0',
                        link: '/migration',
                    },
                ],
            },
        ],
    },
    vite: {
        publicDir: fileURLToPath(new URL('../public', import.meta.url)),
        // The site compiles the components' and the canvas' sources: they keep their layer. The rest is the site's.
        plugins: [
            cssLayer('nightshade-components', { dir: new URL('../../components/src/', import.meta.url) }),
            cssLayer('nightshade-components', { dir: new URL('../../canvas/src/', import.meta.url) }),
            cssLayer('site'),
        ],
        resolve: {
            // The site reads the components' sources, and so does the docs theme it extends: one copy of each.
            alias: [
                {
                    find: /^@nightshadeui\/components$/,
                    replacement: '@nightshadeui/components/src',
                },
            ],
        },
    },
});
