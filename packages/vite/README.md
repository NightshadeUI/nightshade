# @nightshadeui/vite

Vite plugins for Nightshade cascade layers. Vue components never write `@layer`; these put their styles in one, and state the order ahead of every stylesheet.

```bash
npm i -D @nightshadeui/vite
```

```ts
import vue from '@vitejs/plugin-vue';
import { cssLayer, cssLayerOrder } from '@nightshadeui/vite';

export default defineConfig({
    plugins: [
        cssLayerOrder(['acme']), // Nightshade's three, then yours
        cssLayer('acme'),
        vue(),
    ],
});
```

`cssLayer()` takes every SFC outside `node_modules`; `cssLayer('acme', { dir })` only those under `dir`. A block that already opens with `@layer` is left alone, so list narrower plugins first. It wraps each style block's own module, so hot updates stay in the layer. Put it before `vue()`. A component library uses its own layer (`nightshade-components` for Nightshade's) and never lists the order.

`cssLayerOrder(['acme'])` states the order (Nightshade's three, then yours) ahead of every stylesheet: first in each CSS file the build emits, and in `index.html` for dev. Apps use it; libraries don't.

The `nightshade` umbrella re-exports the same plugins as `nightshade/vite`.
