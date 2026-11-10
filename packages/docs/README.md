# @nightshadeui/docs

A documentation site for a design system grown from Nightshade: a VitePress theme with a header, a sidebar, a landing, and live references (variables, palette, tones, sizes) that read the site's own styles. Your overrides show up as they are.

```bash
npm i -D @nightshadeui/docs vitepress vue
```

## Config

```ts
// docs/.vitepress/config.ts
import { defineDocsConfig } from '@nightshadeui/docs/config';

export default defineDocsConfig({
    title: 'Acme Design',
    themeConfig: {
        brand: {
            name: 'Acme Design',
            logo: '/logo.svg',
        },
        topLinks: [
            {
                title: 'Foundations',
                link: '/foundations/',
            },
        ],
        sections: [
            {
                id: 'foundations',
                title: 'Foundations',
                link: '/foundations/',
                pages: [
                    {
                        title: 'Variables',
                        link: '/foundations/',
                    },
                ],
            },
        ],
    },
});
```

`themeConfig` also takes `social` (header icon links), `footer` (`note`, `legal`), `tones` (to pin the tone list instead of reading it from the styles) and `variableGroups` (your own variables, listed in the variable reference).

## Theme

```ts
// docs/.vitepress/theme/index.ts
import '@acme/design/stylesheets';
import { DocsTheme } from '@nightshadeui/docs';
import type { Theme } from 'vitepress';

import * as components from '../../../src/components/index.js';

export default {
    extends: DocsTheme,
    enhanceApp({ app }) {
        for (const [name, component] of Object.entries(components)) {
            app.component(name, component);
        }
    },
} satisfies Theme;
```

Import your stylesheets (Nightshade's, your palette and your `:root`): the theme brings none, so the site looks like your system. To wrap the frame, set `Layout` to a component that renders `<DocsLayout>`; its `header-actions` slot adds buttons to the header.

## Layouts

`layout` in a page's frontmatter: `doc` (the default: sidebar, prose, outline), `home` (a landing from `hero` and `features`, then the page content) or `page` (the content at full width). In the hero, `backdrop: true` adds the particle backdrop, and `aside` names a registered component to show beside the title, on a glass card.

```md
---
layout: home
hero:
  backdrop: true
  aside: HomeShowcase
  title: Acme Design
  tagline: Tokens, components and guidance for every Acme product.
  actions:
    - text: Get started
      link: /foundations/
features:
  - icon: fas fa-palette
    title: Palette
    details: Generated ramps, one tone each.
    link: /foundations/palette
---
```

## References

Registered globally, so pages use them by name:

| Component | Shows |
|-----------|-------|
| `<VariableReference />` | every variable, by tier, searchable, with override guidance and your site's values |
| `<PaletteReference />` | every ramp the page defines, live |
| `<ToneMatrix />`, `<ToneRoles />` | every tone at every size, and every tone role |
| `<RoleVocabulary />` | the canvas and tone roles |
| `<TypeScale />`, `<SpacingScale />`, `<InputSizes />` | the type, spacing and control-size scales |
| `<Demo>` | a live stage for examples; `dual` shows both schemes |
