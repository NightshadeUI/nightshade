# nightshade

The Nightshade umbrella: `@nightshadeui/stylesheets` and `@nightshadeui/components` in one dependency.

```bash
npm i nightshade
```

```css
@import 'nightshade/css'; /* the styles */
@import './palette.css';
```

```ts
import { Btn, InputText } from 'nightshade'; /* each component brings its own CSS */
```

```ts
// vite.config.ts: the layer order ahead of every stylesheet, and your components' styles in your layer
import { cssLayer, cssLayerOrder } from 'nightshade/vite';

export default defineConfig({
    plugins: [cssLayerOrder(['acme']), cssLayer('acme'), vue()],
});
```

See [@nightshadeui/stylesheets](https://www.npmjs.com/package/@nightshadeui/stylesheets) and [@nightshadeui/components](https://www.npmjs.com/package/@nightshadeui/components).
