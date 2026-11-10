---
title: Docs theme
---

# Docs theme

<p class="Lead">Your system deserves a site of its own. <code>@nightshadeui/docs</code> is a VitePress theme that dresses in your styles, and whose references read them live: your palette, your tones, your overrides.</p>

```bash
npm i -D @nightshadeui/docs vitepress vue
```

## What you get

- **The frame:** a header with your logo, a sidebar, an outline, previous and next links, a footer and a scheme switch.
- **A landing:** `layout: home` builds a hero and feature cards from frontmatter; the page's own Markdown follows. `backdrop` names a component to show behind it (`true` is the particle backdrop, `HeroBackdrop`), and `aside` names a component of yours to show beside the title, on a glass card.
- **References** that render from the page's styles, so they always show your system as it is:

| Component | Shows |
|-----------|-------|
| `<VariableReference />` | every variable, by tier, searchable, with override guidance, your values and your own variables |
| `<PaletteReference />` | every ramp your palette defines |
| `<ToneMatrix />`, `<ToneRoles />` | every tone at every size (a button, or your control from the `{ tone, size }` slot), and every tone role in every tone |
| `<RoleVocabulary />` | the canvas and tone roles |
| `<TypeScale />`, `<SpacingScale />`, `<InputSizes />` | the scales |
| `<Demo>` | a live stage for your examples; `dual` shows both schemes (`stacked` puts them one above the other) |

This site is built on it. The frame, the layouts and the references above are the theme; the home hero, the Palette Studio, the look playground and the opt-in demos are this site's own.

## Config

The site's brand and navigation are its `themeConfig`. `defineDocsConfig` adds what the theme needs: clean URLs, the scheme switch, code colors from your palette.

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

`themeConfig` also takes `social` (icon links in the header), `footer` (`note`, `legal`), `tones` (a fixed tone list, instead of the one read from your styles) and `variableGroups`: your own variables, listed in the variable reference with the same stances.

## Theme

The theme brings no styles of its own beyond the frame (its CSS, Font Awesome, the `kbd` and `transitions` modules) and registers the standard components. Import your styles, and register your own components so pages can use them.

```ts
// docs/.vitepress/theme/index.ts
import '@acme/design/stylesheets';

import { DocsTheme } from '@nightshadeui/docs';
import type { Theme } from 'vitepress';

import { Panel } from '../../../src/components/index.js';

export default {
    extends: DocsTheme,
    enhanceApp({ app }) {
        app.component('Panel', Panel);
    },
} satisfies Theme;
```

The particle backdrop is opt-in too, so the theme doesn't pull in particles for a site that never shows them. Install `@nightshadeui/particle-system` and register it:

```ts
import HeroBackdrop from '@nightshadeui/docs/hero-backdrop';

app.component('HeroBackdrop', HeroBackdrop);
```

To wrap the frame, set `Layout` to a component that renders `<DocsLayout>`; its `header-actions` slot adds to the header. The frame's dimensions and code colors are `--Site-*` and `--code-*` variables: set them at your `:root`.

## Pages

Pages are Markdown. `layout` picks the frame: `doc` (the default), `home` or `page` (full width, for a reference like the variables).

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
