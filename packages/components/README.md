# @nightshadeui/components

Standard Nightshade controls for Vue 3: buttons, chips, text inputs, toggles, sliders, layout groups and overlays. They read the styles' roles and context, and share one grammar of props: `tone`, `size`, `flat`, `outline`, `ghost`, `round`, `translucent`, `disabled`.

```bash
npm i @nightshadeui/stylesheets @nightshadeui/components
```

Import the ones you use. Each brings its own CSS, in the `nightshade-components` layer:

```ts
import '@nightshadeui/stylesheets';
import { Btn, HGroup } from '@nightshadeui/components';

app.component('Btn', Btn);
app.component('HGroup', HGroup);
```

`standardComponents` maps every name to its component, to register them all. Set app-wide defaults with `app.provide('$nightshade', reactive({ defaults: { round: true } }))`. Each control's `--<Component>-*` locals are how it is written, not a restyle API.

## Your own components in a layer

`@nightshadeui/components/vite` exports `cssLayer()`, a Vite plugin that puts every SFC `<style>` in a cascade layer, so components never write `@layer`. Put it before `vue()`:

```ts
import vue from '@vitejs/plugin-vue';
import { cssLayer } from '@nightshadeui/components/vite';

export default defineConfig({
    plugins: [
        cssLayer('acme'),
        vue(),
    ],
});
```

It takes every SFC outside `node_modules`; `cssLayer('acme', { dir })` only those under `dir`. A block that already opens with `@layer` is left alone, so list narrower plugins first. It wraps each style block's own module, so hot updates stay in the layer.

An app also adds `cssLayerOrder(['acme'])`: it states the order (Nightshade's three, then yours) ahead of every stylesheet, first in each CSS file the build emits and in `index.html` for dev. A library never lists the order.

`RouterBtn` needs `vue-router`. Overlays teleport into an element with `id="overlays"`.
