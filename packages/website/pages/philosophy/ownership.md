---
title: Growing your own
---

# Growing your own

<p class="Lead">The point of a seed is what it grows into. Here's how to turn Nightshade into your organization's design system, one layer at a time, without forking it.</p>

## Start from a palette spec

Open the [Palette Studio](/studio), tune the hues and curves, and copy the spec. Keep it in your repository as the single source of your colors.

```bash
npx nightshade palette -f design/palette.json -o src/styles/palette.css
```

## Reassign roles, not components

Roles are the meaning layer. Changing what a deep surface or subtle text is takes one variable, and every component follows.

```css
:root {
    --surface-deep: var(--color-base-200);
    --border-deep: var(--color-base-300);
    --text-subtle: var(--color-base-700);
}
```

Tone roles are stated on every tone context, not only on `:root`, so reassign them on the same selectors to change them for every tone:

```css
:root,
[class^="tone-"],
[class*=" tone-"] {
    --tone-border: var(--tone-700);
}
```

## Add tones for your domain

Plans, environments, statuses: if your product has a color vocabulary, make each word a tone. Add a ramp to the spec and regenerate:

```json
{ "ramps": [{ "name": "pro", "hue": 290, "chroma": 1, "lightness": 1 }] }
```

The generator writes `--color-pro-*` and `.tone-pro`, and every role resolves against it. Now `<Btn tone="pro">` works, and so does `<section class="tone-pro">` around anything.

## Tune the scales

A handful of variables sets the character of the whole system:

```css
:root {
    --sp: 8px;
    --radius-m: 6px;
    --font-size-m: 15px;
    --font-main: "Source Sans 3", sans-serif;
    --font-alt: "DM Serif Display", serif;
}
```

## Wrap, map or replace components

Your system's components can wrap the standard ones, or skip them and read the same roles directly. Already on a component library? Map its variables to the roles once, at your `:root`. Either way, everything speaks the same grammar.

```vue
<template>
    <Btn
        v-bind="$attrs"
        round />
</template>
```

Need a look the standard control doesn't have? Write it on the [grammar](/components/): `--AcmeAction-*` on `.AcmeAction`, defaulted from roles.

## Ship it as your package

Put your CSS in its own cascade layer after Nightshade's, and publish it. Apps depend on your system, not on Nightshade directly. Nightshade's names, then yours, before any `@import`. The first `@layer` in the document is the order: [Tokens](/styles/#cascade-layers). Your components land in your layer through `cssLayer('acme')` in the package's Vite build; they never write `@layer`.

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

Don't copy a `type.css` or font tags off this website; this site is an app. Stay in the layers.

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
