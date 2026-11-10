import '@fortawesome/fontawesome-free/css/all.css';
import './styles/docs.css';

import * as standardComponents from '@nightshadeui/components/src';
import { Theme } from 'vitepress';
import { Component, reactive } from 'vue';

import { DocsThemeConfig } from './config/DocsThemeConfig.js';
import { AppearanceManager } from './managers/AppearanceManager.js';
import { SiteManager } from './managers/SiteManager.js';
import { StylesManager } from './managers/StylesManager.js';
import DocsLayout from './views/DocsLayout.vue';

export * from './catalog/variables.js';
export * from './config/DocsThemeConfig.js';
export * from './helpers/commons.js';
export * from './managers/AppearanceManager.js';
export * from './managers/SiteManager.js';
export * from './managers/StylesManager.js';
export { default as DocsLayout } from './views/DocsLayout.vue';

const docsComponents = import.meta.glob<{ default: Component }>([
    './views/*.vue',
    './components/*.vue',
], { eager: true });

/**
 * The docs theme. A site extends it (`extends: DocsTheme`) to register its own components and managers,
 * or to wrap `DocsLayout` in a layout of its own.
 *
 * Provides `siteManager`, `appearanceManager` and `stylesManager`, and registers the standard components
 * and the theme's views globally, so Markdown pages use them by name.
 */
export const DocsTheme: Theme = {
    Layout: DocsLayout,
    enhanceApp({ app, router, siteData }) {
        for (const [name, component] of Object.entries(standardComponents)) {
            app.component(name, component as Component);
        }
        for (const [path, module] of Object.entries(docsComponents)) {
            app.component(path.replace(/^.*\/|\.vue$/g, ''), module.default);
        }
        const config = siteData.value.themeConfig as DocsThemeConfig;
        const siteManager = reactive(new SiteManager(config));
        siteManager.setPath(router.route.path);
        router.onAfterRouteChange = to => siteManager.setPath(to);
        app.provide('siteManager', siteManager);
        app.provide('appearanceManager', reactive(new AppearanceManager()));
        app.provide('stylesManager', reactive(new StylesManager(config.tones)));
    },
};

export default DocsTheme;
