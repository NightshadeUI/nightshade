import { Features } from 'lightningcss';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitepress';

export default defineConfig({
    srcDir: 'pages',
    title: 'Nightshade',
    description: 'Nightshade',
    cleanUrls: true,
    titleTemplate: ':title · Nightshade UI',
    lang: 'en-US',
    head: [
        [
            'link',
            { rel: 'icon', href: '/favicon.svg' }
        ],
        [
            'link',
            { rel: 'stylesheet', href: '/fonts/futura/stylesheet.css' }
        ],
        [
            'link',
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
        ],
        [
            'link',
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: "crossorigin" }
        ],
        [
            'link',
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=MonteCarlo&display=swap' }
        ],
        [
            'link',
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600&display=swap' }
        ],
        [
            'script',
            {
                defer: 'true',
            },
            `
const classList = document.documentElement.classList;
requestAnimationFrame(() => {
    if (classList.contains('dark')) {
        classList.add('theme-dark');
    }
});
`
        ],
    ],
    vite: {
        publicDir: fileURLToPath(new URL('../public', import.meta.url)),
        resolve: {
            alias: {
                // '@nightshadeui/core': fileURLToPath(new URL('../../core/src', import.meta.url)),
            }
        },
        css: {
            transformer: 'lightningcss',
            lightningcss: {
                cssModules: true,
                exclude: Features.LightDark,
            }
        },
        build: {
            cssMinify: 'lightningcss',
        }
    },
});
