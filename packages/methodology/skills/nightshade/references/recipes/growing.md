# Recipe: growing your own system

How to turn the seed into an organization's design system, one tier at a time, without forking it.

## 1. Start from a palette spec

Tune the hues and curves (the Palette Studio on the Nightshade website helps), and keep the spec in the repository as the only source of your colors.

```bash
npx nightshade palette -f design/palette.json -o src/styles/palette.css
```

## 2. Tune the scales

A handful of variables set the character of the whole system:

```css
:root {
    --sp: 8px;
    --radius-m: 6px;
    --font-size-m: 15px;
    --font-main: "Inter", sans-serif;
    --font-alt: "Fraunces", serif;
}
```

## 3. Reassign roles, not components

Roles are the meaning tier. Changing what a deep surface or a tone's fill is takes one declaration, and every component follows. Roles may read ramp steps: that's the tier they belong to.

```css
:root {
    --surface-deep: var(--color-base-200);
    --border-deep: var(--color-base-300);
}
```

## 4. Add tones for your domain

Plans, environments, statuses: if the product has a color vocabulary, make each word a tone by adding a ramp to the spec and regenerating. See [palette.md](../palette.md#adding-a-tone).

## 5. Wrap, map or replace components

Wrap the standard components (props and context, not their internals), or write your own on the same grammar ([components.md](../components.md)), or map another library's variables to the roles. Whichever you pick, everything speaks the same tiers.

```vue
<template>
    <Btn
        v-bind="$attrs"
        round />
</template>
```

Need a look the standard control doesn't have? Write it on the grammar: `--AcmeAction-*` on `.AcmeAction`, defaulted from roles.

## 6. Ship it as a package

Put your CSS in its own cascade layer after Nightshade's and publish it. Apps then depend on your system, not on Nightshade directly. Nightshade's names, then yours, before any `@import`. The first `@layer` in the document is the order: [model.md](../model.md#cascade-layers).

```css
@layer nightshade, nightshade-docs, nightshade-components, acme;

@import 'nightshade/css';
@import './palette.css' layer(acme);
@import './type.css' layer(acme);
@import './roles.css' layer(acme);
```

```css
/* type.css — yours, in your layer. Display line-heights are ratios. */
h1 { font-size: var(--font-size-xxxl); line-height: 1.2; }
h2 { font-size: var(--font-size-xxl);  line-height: 1.2; }
```

Ship the look too: export the `$nightshade.defaults` your system wants (`{ flat: true }`), and have every app provide them once at its root. Map `h1`–`h6` in that layer, so apps and the docs site inherit the ladder. Nightshade does not. Stay in the layers.

## 7. Give it a site

`@nightshadeui/docs` is a VitePress theme for the system's own documentation: a landing, navigation from `themeConfig`, and references (variables, palette, tones, scales) that read your styles live, so they show your system as it is. Import your stylesheets in the theme, register your components, and list your own public tokens in `themeConfig.variableGroups`. The variable reference is for the apps built on the system, not a catalogue of component knobs.

The docs site is an app of yours: it imports the same stylesheets, so it already has the heading ladder. Don't copy a `type.css` or font tags off the Nightshade website; that site is an app. If a heading still clips, your first `@layer` skipped `nightshade-docs` and that layer was appended.

```ts
// docs/.vitepress/config.ts
import { defineDocsConfig } from '@nightshadeui/docs/config';
```

## Shortcuts that cost later

- Copying a component's CSS to change one color works, but changing the role it reads does the same in one line, and stays in sync.
- Ramp steps written inside a multi-tone component stop following the tone. A role, or a step of the context ramp, keeps it snapping. In a single-tone component they're fine.
- A second spacing or sizing system beside `--sp*` and the input sizes drifts. Extend the vocabularies instead.
- A `light-dark()` in a component picks a scheme by hand. The ramps already do, so the component only needs a role.
