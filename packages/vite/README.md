# @nightshadeui/vite

Vite plugins for Nightshade cascade layers. A system's or library's Vue components never write `@layer`: `cssLayer()` puts their styles in one. `cssLayerOrder()` states the order for sites with no `index.html` of their own.

```bash
npm i -D @nightshadeui/vite
```

```ts
import vue from '@vitejs/plugin-vue';
import { cssLayer } from '@nightshadeui/vite';

export default defineConfig({
    plugins: [cssLayer('acme'), vue()],
});
```

`cssLayer()` takes every SFC outside `node_modules`; `cssLayer('acme', { dir })` only those under `dir`. A block that already opens with `@layer` is left alone, so list narrower plugins first. It wraps each style block's own module, so hot updates stay in the layer. Put it before `vue()`. A component library uses its own layer (`nightshade-components` for Nightshade's) and never lists the order.

An app doesn't need either plugin. It states the order first in `<head>`, in `index.html` (`<style>@layer nightshade, nightshade-docs, nightshade-components, acme;</style>`), and its own CSS can stay unlayered: that beats the system, which is what an app wants.

`cssLayerOrder(['acme'])` is for a site with no `index.html` of its own, such as VitePress, which links its CSS before any `head` entry. It states the order (Nightshade's three, then yours) first in each CSS file the build emits, and in the page for dev. The docs theme's config adds it.

CSS that a library injects at runtime (CodeMirror's `<style>` tags) is unlayered, and no plugin can put it in a layer: it beats every layer. To restyle that library's elements, write a CSS file that your entry stylesheet imports without a layer, with selectors more specific than the library's own. `cssLayer()` has no opt-out for unlayered blocks.

The `nightshade` umbrella re-exports the same plugins as `nightshade/vite`.
