import './theme.css';

import HeroBackdrop from '@nightshadeui/docs/hero-backdrop';
import { DocsTheme } from '@nightshadeui/docs/src';
import { Theme } from 'vitepress';
import { Component, reactive } from 'vue';

import { CanvasDemoManager } from '../../managers/CanvasDemoManager.js';
import { PaletteManager } from '../../managers/PaletteManager.js';
import { ParticleDemoManager } from '../../managers/ParticleDemoManager.js';
import { PlaygroundManager } from '../../managers/PlaygroundManager.js';
import { ScrollerDemoManager } from '../../managers/ScrollerDemoManager.js';
import SiteLayout from '../../views/SiteLayout.vue';

const siteComponents = import.meta.glob<{ default: Component }>([
    '../../views/*.vue',
    '../../components/*.vue',
], { eager: true });

/**
 * The Nightshade site: the docs theme, plus the palette studio, the look playground and the opt-in demos.
 */
const theme: Theme = {
    extends: DocsTheme,
    Layout: SiteLayout,
    enhanceApp({ app }) {
        for (const [path, module] of Object.entries(siteComponents)) {
            app.component(path.replace(/^.*\/|\.vue$/g, ''), module.default);
        }
        app.component('HeroBackdrop', HeroBackdrop);
        app.provide('paletteManager', reactive(new PaletteManager()));
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
        app.provide('demoDefaults', {
            get defaults() {
                return playgroundManager.options;
            },
        });
    },
};

export default theme;
