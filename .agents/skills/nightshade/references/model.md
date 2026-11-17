# The model

Nightshade is not a design system. It is the seed one grows from. The app decides what grows next, and owns all of it.

## What's in the seed

| Piece | Package | What it gives you |
|-------|---------|-------------------|
| The styles | `@nightshadeui/stylesheets` | scales, settings, context and roles as CSS variables, a reset, utilities |
| The palette | `@nightshadeui/cli`, `@nightshadeui/palette-generator` | OKLCH ramps and tone contexts from a small JSON spec; the app imports its own `palette.css` (a starter ships for prototypes) |

Everything else is an opt-in: `@nightshadeui/components` (standard Vue controls), `canvas`, `particle-system` and `scroller` (behavior as controllers, with optional components). The styles never depend on an opt-in. `nightshade` bundles the styles and the standard components.

## Principles

- **Simplicity first.** Every tier, role and prop has to earn its place. If styling a panel needs a cheat sheet, the system has a bug.
- **Finite vocabularies.** Turn an open space into a short list, then only speak the list: lengths are multiples of `--sp`, colors are twelve-step ramps, ramp steps are reached directly or through a handful of roles, control sizes are five steps. When you need something new, add it to a vocabulary so everyone gets it.
- **CSS variables first.** Theming is CSS: no theme object, no provider tree, no build step. Light and dark come from the browser.
- **Buttons and inputs set the rhythm.** Single-line controls have a fixed height on the grid, every control is `border-box`, and companions (toggles, checkboxes, knobs) take the minor height of the same size.
- **Style over strict semantics.** `danger` is a red that reads as caution, not a rule about deleting. Tones keep colors from appearing out of nowhere; they don't police the product.
- **Ownership.** Your system wraps, maps or replaces anything here. Nobody is obliged to use an opt-in.

## The tiers

Four tiers for color, three for size. Each reads only the tiers before it, which is what makes the layers snap: change one link and everything after it follows. The order holds inside a tier too: a setting may pick a scale step, and a tone role may read a canvas role (`--tone-shadow: var(--shadow-medium)` for the neutral tones), never the reverse.

```
color:  scale  →  context  →  role  →  component
        --color-primary-500 → --tone-500 → --tone-fill → --Btn-fill
size:   scale  →  context  →  component
        --input-size-s-major-height → --input-major-height → --Btn-size
```

### Scales and settings

Raw values with no meaning, in two shapes. **Scales** are enumerable ladders: ramps, spacing, radius, the type scale, grid fractions, control sizes. **Settings** are single values, some picked from a scale: the font families, the body size and line height, the control border and outline sizes, the shared disabled and hover states. They live in `scales/` and `settings/`; both are the first tier. The ramps are generated into `palette.css`. Every step is `light-dark(<light>, <dark>)`, and the dark ramp mirrors the light one, so step 0 is always the canvas end and a step means the same thing in both schemes.

### Context

A class sets context for a whole subtree:

- `.tone-<tone>` points the context ramp, `--tone-0` … `--tone-950` plus `--tone-contrast`, at one ramp. The generator writes one per ramp. `:root` is `base`, and `.tone-inverse` is `base` mirrored.
- `.input-size-<size>` collapses one row of the size scale into the generic `--input-*` slots. `:root` is `m`.

Context is how a region changes color or density with one class, and how components inherit both.

### Roles

The meaning, stated once. Canvas roles read the base ramp directly, so a tone never changes the page. Tone roles are stated against the context ramp and redeclared on every tone context, so `--tone-fill` inside `.tone-danger` is the danger fill. Neutral tones (`base`, `inverse`) override a few roles to fill from the canvas end of the ramp. The vocabulary is complete: see [tokens.md](tokens.md).

### Reading ramps directly

A component that must work in any tone (a button, an input) reads roles and the context ramp, so a `.tone-*` class re-tones it. Most app components use one color scheme, and may read ramp steps directly: `border-color: var(--color-primary-600)` is fine in a card that is always primary. Either way the step is scheme-aware, so it reads right in light and dark.

### Component variables

`--<Component>-*`, defaulted on the component's root class from roles and the size context. They are how the control is written, not a public token family. See [components.md](components.md).

## Cascade layers

CSS cascade layers, not the token tiers. Later layers win, at any specificity. Unlayered CSS beats every named layer; don't use that to win over Nightshade.

Nightshade's names, weakest first. Do not rename them, do not skip them:

| Layer | Package | Holds |
|-------|---------|-------|
| `nightshade` | `@nightshadeui/stylesheets` | scales, settings, context, roles, reset, utilities |
| `nightshade-docs` | `@nightshadeui/docs` | the docs theme. Empty until that package loads. |
| `nightshade-components` | `@nightshadeui/components` | standard controls |

Then libraries you wrap (`primevue`, …), then yours (`acme`, `ubio`, `site`).

The first `@layer` statement in the document is the order. Declare it **once**, in your CSS entry, before any `@import`. Components and the docs theme put styles in their named layer; they never list the order. A name first mentioned later is **appended**. If you skip `nightshade-docs`, that layer lands last and the docs theme beats you.

Nightshade's three, then yours:

```css
@layer nightshade, nightshade-docs, nightshade-components, acme;

@import '@nightshadeui/stylesheets';
@import './palette.css' layer(acme);
@import './type.css' layer(acme);
@import './roles.css' layer(acme);
```

An app that wants a different order declares `@layer` before it imports you. Stay in the layers: `:root`, the heading ladder and wrappers belong in yours. Same-layer, a class beats an element (`.page-title` over `h1`).

Nightshade does not map `h1`–`h6`. You do, in your layer, with display line-heights as ratios. Don't copy the Nightshade website's `type.css` or its fonts: that site is an app.

## Where things go

| Change | Where |
|--------|-------|
| A hue, the curves, a new tone | the palette spec, then regenerate |
| `--sp`, `--radius-m`, `--font-*` | your `:root` |
| `h1`–`h6` (size and a display line-height) | your cascade layer; Nightshade does not map tags |
| What a surface or border means | your `:root`, reassigning the role |
| A region's tone or density | a context class on the region |
| A control's padding or radius | `--<Component>-*` on that control's root class |
| Defaults for every control | `$nightshade.defaults` |
