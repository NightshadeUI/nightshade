import './theme.css';

import * as coreComponents from '@nightshadeui/core/src';
import type { Theme } from 'vitepress';

import RootLayout from './RootLayout.vue';
import DualTheme from './DualTheme.vue';

const theme: Theme = {
    Layout: RootLayout,
    enhanceApp({ app }) {
        for (const [name, component] of Object.entries(coreComponents)) {
            app.component(name, component);
        }
        app.component('DualTheme', DualTheme);
    },
};

export default theme;
