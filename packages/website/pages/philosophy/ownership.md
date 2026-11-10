---
title: Growing your own
---

# Growing your own

<p class="Lead">The point of a seed is what it grows into. Here's how to turn Nightshade into your organization's design system, one layer at a time, without forking it.</p>

## 1. Start from a palette spec

Open the [Palette Studio](/studio), tune the hues and curves, and copy the spec. Keep it in your repository as the single source of your colors.

```bash
npx nightshade palette -f design/palette.json -o src/styles/palette.css
```

## 2. Reassign roles, not components

Roles are the meaning layer. Changing what a deep surface or a primary button is takes one variable, and every component follows.

```css
:root {
    --surface-deep: var(--color-base-100);
    --color-primary-500: var(--color-primary-600);
    --color-primary-400: var(--color-primary-500);
    --color-primary-600: var(--color-primary-700);
}
```

## 3. Add tones for your domain

Plans, environments, statuses: if your product has a color vocabulary, make each word a tone. Add a ramp to the spec and regenerate:

```json
{ "ramps": [{ "name": "pro", "hue": 290, "chroma": 1, "lightness": 1 }] }
```

The generator writes `--color-pro-*` and `.tone-pro`, and every role resolves against it. Now `<Btn tone="pro">` works, and so does `<section class="tone-pro">` around anything.

## 4. Tune the scales

A handful of variables sets the character of the whole system:

```css
:root {
    --sp: 8px;
    --radius-m: 6px;
    --font-size-m: 15px;
    --font-main: "Source Sans 3", sans-serif;
    --font-alt: "Cormorant Garamond", serif;
}
```

## 5. Wrap, map or replace components

Your system's components can wrap the standard ones, or skip them and read the same roles directly. Already on a component library? Map its variables to the roles once, at your `:root`. Either way, everything speaks the same grammar.

```vue
<template>
    <Btn
        class="AcmeAction"
        v-bind="$attrs"
        round />
</template>

<style scoped>
.AcmeAction {
    --Btn-padding: var(--sp2);
}
</style>
```

## 6. Ship it as your package

Put your CSS in its own cascade layer after Nightshade's, and publish it. Apps depend on your system, not on Nightshade directly.

```css
@layer nightshade, nightshade-components, acme;

@import 'nightshade/css';
@import './palette.css' layer(acme);
@import './roles.css' layer(acme);
```

## With a coding agent

The methodology package teaches agents the same model: the tiers, the complete role vocabulary, the palette workflow and the component grammar.

```bash
npm i --save-dev @nightshadeui/methodology
```

It adds the rules to your `AGENTS.md` and installs the `nightshade` skill, which Claude Code exposes as `/nightshade`. `npx nightshade-methodology tokens src` reports CSS that breaks the variable grammar.

## Shortcuts that cost later

- Copying a component's CSS to change one color works, but changing the role it reads does the same in one line, and stays in sync.
- Ramp steps written inside a multi-tone component stop following the tone. A role, or a step of the context ramp, keeps it snapping. In a single-tone component, they're fine.
- A second spacing or sizing system next to `--sp*` and the input sizes tends to drift. Extending the vocabularies keeps one rhythm.
