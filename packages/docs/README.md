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

`themeConfig` also takes `social` (header icon links), `footer` (`note`, `legal`), `tones` (to pin the tone list instead of reading it from the styles) and `variableGroups` (your own public tokens, listed in the variable reference). The variable reference speaks to apps built on the system: the public tokens, their specified values, and when to read them. Nightshade's own site sets `variableView: 'foundation'` to add override guidance for authors of a system.

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

Import your stylesheets (Nightshade's, your palette and your `:root`). The heading ladder lives in that system layer, with display line-heights as ratios, for the whole site: Nightshade does not map `h1`–`h6`. If your first `@layer` speaks first, name `nightshade`, `nightshade-docs`, `nightshade-components`, then yours. The theme brings only what its frame needs (its own CSS, Font Awesome, the `kbd` and `transitions` modules), so the site looks like your system. It registers no controls: register the components your pages use, your own and the standard ones you pick. Its CSS sits in the `nightshade-docs` layer, and its prose rules stop at `<Demo>` and the live references, so those look the way they would in an app. To wrap the frame, set `Layout` to a component that renders `<DocsLayout>`; its `header-actions` slot adds buttons to the header.

## Layouts

`layout` in a page's frontmatter: `doc` (the default: sidebar, prose, outline; `outline: false` gives the outline's width to the content, for wide references such as `<VariableReference />`), `home` (a landing from `hero` and `features`, then the page content) or `page` (the content at full width). In the hero, `backdrop` names a registered component to show behind it (`true` is `HeroBackdrop`, below), and `aside` names one to show beside the title, on a glass card.

The particle backdrop is opt-in too, so the theme doesn't pull in particles for a site that never shows them. Install `@nightshadeui/particle-system` and register it:

```ts
import HeroBackdrop from '@nightshadeui/docs/hero-backdrop';

app.component('HeroBackdrop', HeroBackdrop);
```

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
| `<VariableReference />` | every public token, by category and tier, searchable, with the specified values from your styles |
| `<PaletteReference />` | every ramp the page defines, live |
| `<ToneMatrix />`, `<ToneRoles />` | every tone at every size (a button, or your control from the `{ tone, size }` slot), and an app card taken apart into every tone role, one tone at a time |
| `<RoleVocabulary />` | the canvas and tone roles |
| `<TypeScale />`, `<SpacingScale />`, `<InputSizes />` | the type, spacing and control-size scales |
| `<Demo>` | a live stage for examples; `dual` shows both schemes (`stacked` puts them one above the other) |
