---
title: Tokens
---

# Tokens

<p class="Lead">Every public Nightshade variable belongs to one tier. A tier reads only the tiers before it, so you always know where a value comes from and where to change it.</p>

## Three tiers

| Tier | What it holds | Example |
|------|---------------|---------|
| **Raw** | scales (enumerable ladders) and settings (single values), no meaning | `--color-primary-500`, `--sp4`, `--radius-m`, `--input-size-m-major-height`, `--font-main`, `--input-border-size` |
| **Context** | one tone ramp and one input size, for a subtree | `.tone-primary` → `--tone-500`, `.input-size-s` → `--input-major-height` |
| **Role** | meaning, stated once | `--surface-deep`, `--border-base`, `--tone-fill`, `--tone-border` |

A control you write reads the last tier that names what it needs: a role, or the size context. Default `--<Component>-*` on its root class from those. Those locals are the control's own, not tokens. See [Control grammar](/components/).

Colors take all three steps, then the control reads the role. Sizes skip the role: a metric's name already says what it's for.

<TokenChain />

Every public token, with what it's for and how far to override it, is on one page: [Variables](/variables).

## The rules

1. **Each tier reads only the tiers before it.** A role may read the context or a raw value; a scale reads only its own base step (`--sp`, `--radius-m`), and a setting at most picks a step of a scale. Inside the role tier, canvas roles come first: a tone role may read one (the neutral tone's shadow is `--shadow-medium`), never the reverse.
2. **Multi-tone components read roles, not ramps.** A control that takes a `tone` (a button, an input) reads roles and the input size context, and the context ramp (`--tone-200`) when no role names what it needs, so one class re-tones it. A single-tone component, which is most of what an app builds, may read ramp steps directly (`--color-primary-600`). Neither calls `light-dark()`: the steps are already scheme-aware.
3. **`light-dark()` lives in the generated palette**, and in the few roles that pick different steps per scheme.
4. **`:root` is the default context:** the `base` tone and the `m` input size. Every component inherits from it unless told otherwise.
5. **A control you write** reads roles and the size context, never a ramp, and defaults `--<Component>-*` on its root class. Those locals are not a public family. [Control grammar](/components/).

## Variable families

| Family | Tier | Shape |
|--------|------|-------|
| Color ramps | scale | `--color-<ramp>-<step>`, `--color-<ramp>-contrast` |
| Spacing | scale | `--sp`, `--sp<n>` (`--sp0-5`, `--sp2-5`…) |
| Radius | scale | `--radius-s`, `--radius-m`, `--radius-l` |
| Type scale | scale | `--font-size-<t>`, `--font-weight-<w>` |
| Grid | scale | `--gr<n>`, `--vgr<n>` |
| Control sizes | scale | `--input-size-<size>-<metric>` |
| Type settings | setting | `--font-main`, `--font-alt`, `--font-monospace`, `--font-size`, `--font-weight`, `--line-height`, `--line-height-<face>` |
| Control settings | setting | `--input-border-size`, `--input-outline-*`, `--input-disabled-*`, `--input-hover-*` |
| Tone context | context | `--tone-<step>`, `--tone-contrast`, set by `.tone-<tone>` |
| Size context | context | `--input-<metric>`, set by `.input-size-<size>` |
| Canvas | role | `--surface-*`, `--border-*`, `--text-*`, `--shadow-*`, `--text-shadow-auto`, `--translucency-*` |
| Tone | role | `--tone-text`, `--tone-tint`, `--tone-tint-text`, `--tone-fill*`, `--tone-border`, `--tone-shadow`, `--tone-focus-*` |

## The files, in order

`@nightshadeui/stylesheets` is an ordered list of imports. The order *is* the tier order:

```css
/* 1. Raw values. Scales: enumerable ladders */
@import './scales/spacing.css' layer(nightshade);
@import './scales/radius.css' layer(nightshade);
@import './scales/grid.css' layer(nightshade);
@import './scales/font.css' layer(nightshade);
@import './scales/inputs.css' layer(nightshade);

/* 1. Raw values. Settings: one value each */
@import './settings/font.css' layer(nightshade);
@import './settings/inputs.css' layer(nightshade);

/* 2. Context */
@import './context/tones.css' layer(nightshade);
@import './context/inputs.css' layer(nightshade);

/* 3. Roles */
@import './roles/canvas.css' layer(nightshade);
@import './roles/tones.css' layer(nightshade);

/* Page */
@import './base.css' layer(nightshade);
@import './utilities.css' layer(nightshade);
```

The palette isn't in that list: import your own generated `palette.css` next to the styles, or the starter one while you prototype. Put it in the same cascade layer as your `:root`.

## Cascade layers

CSS cascade layers, not the token tiers. Later layers win, at any specificity. Unlayered CSS beats every named layer; don't use that to win over Nightshade.

Nightshade's names, weakest first. Do not rename them, do not skip them:

| Layer | Package | Holds |
|-------|---------|-------|
| `nightshade` | `@nightshadeui/stylesheets` | scales, settings, context, roles, reset, utilities |
| `nightshade-docs` | `@nightshadeui/docs` | the docs theme. Empty until that package loads. |
| `nightshade-components` | `@nightshadeui/components` | standard controls |

Then libraries you wrap, then yours. The first `@layer` statement in the document is the order. Declare it **once**, in your CSS entry, before any `@import`. Components sit in a named layer; they never list the order. A name first mentioned later is appended. In a Vite app the entry rarely loads first, so `cssLayerOrder()` (below) states the order ahead of every stylesheet.

```css
@layer nightshade, nightshade-docs, nightshade-components, acme;

@import '@nightshadeui/stylesheets';
@import './palette.css' layer(acme);
@import './type.css' layer(acme);
```

Vue components never write `@layer`. `cssLayer()` from `nightshade/vite` (or `@nightshadeui/components/vite`) puts every SFC `<style>` in your layer, at build time and on hot updates. `cssLayerOrder()` states the order ahead of every stylesheet: in dev a component's style loads before your entry, and a build can link a chunk's CSS first. Put both before `vue()`:

```ts
import vue from '@vitejs/plugin-vue';
import { cssLayer, cssLayerOrder } from 'nightshade/vite';

export default defineConfig({
    plugins: [
        cssLayerOrder(['acme']), // Nightshade's three, then yours
        cssLayer('acme'),
        vue(),
    ],
});
```

It takes every SFC outside `node_modules`. `cssLayer('x', { dir })` takes only those under `dir`, for sources another layer owns; list it first. A block that already opens with `@layer` is left alone.

A prototype can skip the list and write an unlayered `:root`; it will win, and then fight the next unlayered file. A system stays in the layers. [Growing your own](/philosophy/ownership#ship-it-as-your-package).

## Taking only some of it

Each file is exported on its own. A system that brings its own reset imports the tiers and skips `base.css`:

```css
@layer nightshade, nightshade-docs, nightshade-components, acme;

@import '@nightshadeui/stylesheets/scales/spacing.css' layer(nightshade);
/* … the other scales, settings and context files, in the same order … */
@import '@nightshadeui/stylesheets/roles/canvas.css' layer(nightshade);
@import '@nightshadeui/stylesheets/roles/tones.css' layer(nightshade);
@import './palette.css' layer(acme);
```
