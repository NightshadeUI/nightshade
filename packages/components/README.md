# @nightshadeui/components

Standard Nightshade controls for Vue 3: buttons, chips, text inputs, toggles, sliders, layout groups and overlays. They read the styles' roles and context, and share one grammar of props: `tone`, `size`, `flat`, `outline`, `round`, `translucent`, `disabled`.

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

`standardComponents` maps every name to its component, to register them all. Set app-wide defaults with `app.provide('$nightshade', reactive({ defaults: { round: true } }))`, and restyle any component through its `--<Component>-*` variables.

`RouterBtn` needs `vue-router`. Overlays teleport into an element with `id="overlays"`.
