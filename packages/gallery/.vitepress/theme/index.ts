import '@fortawesome/fontawesome-free/css/all.css';
import './theme.css';

import * as coreComponents from '@nightshadeui/core/src';
import type { Theme } from 'vitepress';
import { reactive } from 'vue';

import DualTheme from './DualTheme.vue';
import RootLayout from './RootLayout.vue';

const commonOptions = reactive({
    round: false,
    flat: false,
    outline: false,
    disabled: false,
    forceFocus: false,
    forceHover: false,
    forceActive: false,
});

const theme: Theme = {
    Layout: RootLayout,
    enhanceApp({ app }) {
        for (const [name, component] of Object.entries(coreComponents)) {
            app.component(name, component);
        }
        app.component('DualTheme', DualTheme);
        app.provide('commonOptions', commonOptions);
        app.provide('$nightshade', reactive({
            defaults: commonOptions,
        }));
    },
};

export default theme;
