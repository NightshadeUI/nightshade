# nightshade

The Nightshade umbrella: `@nightshadeui/stylesheets`, `@nightshadeui/components` and `@nightshadeui/vite` in one dependency.

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

```html
<!-- index.html, first in <head>: the layer order -->
<style>@layer nightshade, nightshade-docs, nightshade-components, acme;</style>
```

```ts
// vite.config.ts, for a system's or library's components: their styles in its layer
import { cssLayer } from 'nightshade/vite';

export default defineConfig({
    plugins: [cssLayer('acme'), vue()],
});
```

See [@nightshadeui/stylesheets](https://www.npmjs.com/package/@nightshadeui/stylesheets), [@nightshadeui/components](https://www.npmjs.com/package/@nightshadeui/components) and [@nightshadeui/vite](https://www.npmjs.com/package/@nightshadeui/vite).
