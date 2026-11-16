---
title: Tokens
---

# Tokens

<p class="Lead">Every Nightshade variable belongs to one tier. A tier reads only the tiers before it, so you always know where a value comes from and where to change it.</p>

## Four tiers

| Tier | What it holds | Example |
|------|---------------|---------|
| **Raw** | scales (enumerable ladders) and settings (single values), no meaning | `--color-primary-500`, `--sp4`, `--radius-m`, `--input-size-m-major-height`, `--font-main`, `--input-border-size` |
| **Context** | one tone ramp and one input size, for a subtree | `.tone-primary` → `--tone-500`, `.input-size-s` → `--input-major-height` |
| **Role** | meaning, stated once | `--surface-deep`, `--border-base`, `--tone-fill`, `--tone-border` |
| **Component** | a component's own knobs | `--Btn-fill`, `--Slider-knob-size` |

Colors take all four steps. Sizes take three: a size metric's name already says what it's for, so the context is its role.

<TokenChain />

Every variable, with what it's for and how far to override it, is on one page: [Variables](/variables).

## The rules

1. **Each tier reads only the tiers before it.** A role may read the context or a raw value; a scale reads only its own base step (`--sp`, `--font-size-m`, `--radius-m`), and a setting at most picks a step of a scale. Inside the role tier, canvas roles come first: a tone role may read one (the neutral tone's shadow is `--shadow-medium`), never the reverse.
2. **Multi-tone components read roles, not ramps.** A control that takes a `tone` (a button, an input) reads roles and the input size context, and the context ramp (`--tone-200`) when no role names what it needs, so one class re-tones it. A single-tone component, which is most of what an app builds, may read ramp steps directly (`--color-primary-600`). Neither calls `light-dark()`: the steps are already scheme-aware.
3. **`light-dark()` lives in the generated palette**, and in the few roles that pick different steps per scheme.
4. **`:root` is the default context:** the `base` tone and the `m` input size. Every component inherits from it unless told otherwise.
5. **Component variables are prefixed** with the component (`--Btn-*`) and defaulted on its root class, without per-usage fallbacks.

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
| Component | component | `--<Component>-*` |

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

Everything is in `@layer nightshade`. Unlayered CSS beats any layer, so a plain `:root { … }` in your app always wins, whatever the specificity. The palette isn't in the list: import your own generated `palette.css` next to the styles, or the starter one while you prototype:

```css
@import '@nightshadeui/stylesheets';
@import './palette.css';
```

The palette goes where your `:root` goes: unlayered next to an unlayered `:root`, as here, or in your system's own layer when you ship one ([Growing your own](/philosophy/ownership#ship-it-as-your-package)).

## Taking only some of it

Each file is exported on its own. A system that brings its own reset imports the tiers and skips `base.css`:

```css
@layer nightshade, nightshade-components;

@import '@nightshadeui/stylesheets/scales/spacing.css' layer(nightshade);
/* … the other scales, settings and context files, in the same order … */
@import '@nightshadeui/stylesheets/roles/canvas.css' layer(nightshade);
@import '@nightshadeui/stylesheets/roles/tones.css' layer(nightshade);
@import './palette.css';
```
