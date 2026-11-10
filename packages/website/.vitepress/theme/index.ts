import '@fortawesome/fontawesome-free/css/all.css';
import './theme.css';

import * as standardComponents from '@nightshadeui/components/src';
import { Theme } from 'vitepress';
import { Component, reactive } from 'vue';

import { AppearanceManager } from '../../managers/AppearanceManager.js';
import { CanvasDemoManager } from '../../managers/CanvasDemoManager.js';
import { NavigationManager } from '../../managers/NavigationManager.js';
import { PaletteManager } from '../../managers/PaletteManager.js';
import { ParticleDemoManager } from '../../managers/ParticleDemoManager.js';
import { PlaygroundManager } from '../../managers/PlaygroundManager.js';
import { ScrollerDemoManager } from '../../managers/ScrollerDemoManager.js';
import SiteLayout from '../../views/SiteLayout.vue';

const siteComponents = import.meta.glob<{ default: Component }>([
    '../../views/*.vue',
    '../../components/*.vue',
], { eager: true });

const theme: Theme = {
    Layout: SiteLayout,
    enhanceApp({ app, router }) {
        for (const [name, component] of Object.entries(standardComponents)) {
            app.component(name, component as Component);
        }
        for (const [path, module] of Object.entries(siteComponents)) {
            app.component(path.replace(/^.*\/|\.vue$/g, ''), module.default);
        }
        const navigationManager = reactive(new NavigationManager());
        navigationManager.setPath(router.route.path);
        router.onAfterRouteChange = to => navigationManager.setPath(to);
        app.provide('navigationManager', navigationManager);
        app.provide('paletteManager', reactive(new PaletteManager()));
        app.provide('appearanceManager', reactive(new AppearanceManager()));
        app.provide('canvasDemoManager', new CanvasDemoManager());
        app.provide('particleDemoManager', new ParticleDemoManager());
        app.provide('scrollerDemoManager', new ScrollerDemoManager());
        const playgroundManager = reactive(new PlaygroundManager());
        app.provide('playgroundManager', playgroundManager);
        app.provide('$nightshade', {
            get defaults() {
                return playgroundManager.lookDefaults;
            },
        });
    },
};

export default theme;
