import { Plugin } from 'vite';

export interface CssLayerOptions {
    /** Only the SFCs under this directory. By default, every SFC outside `node_modules`. */
    dir?: string | URL;
}

/**
 * A Vite plugin that puts the styles of Vue single-file components in a cascade layer, so a
 * component's `<style>` never writes `@layer` itself. Put it before `vue()`.
 */
export function cssLayer(layer: string, options?: CssLayerOptions): Plugin;

/**
 * A Vite plugin that states the cascade layer order (Nightshade's, then `layers`) ahead of every
 * stylesheet: first in each CSS file the build emits, and in `index.html` for dev.
 */
export function cssLayerOrder(layers?: string[]): Plugin;
