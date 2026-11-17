# Nightshade methodology

This project's design system grows from Nightshade: a few principles, styles as CSS variables, and a generated palette. The app owns everything it grows. Speak the existing vocabularies, and extend one before adding a parallel one.

These are the always-on rules. For the token catalog, the palette workflow, component recipes and the token checker, use the `nightshade` skill (installed under `.agents/skills/nightshade`).

## Tiers

- **Four tiers, and each reads only the tiers before it:** raw values → context → roles → component variables. Sizes have no role tier: raw values → context → component. Inside a tier the order holds too: settings may pick a scale step, and tone roles may read canvas roles (`--tone-shadow: var(--shadow-medium)`), never the reverse.
- **Raw values** come in two shapes. Scales are enumerable ladders: `--color-<ramp>-<step>` and `--color-<ramp>-contrast`, `--sp*`, `--radius-s|m|l`, `--font-size-*`, `--font-weight-*`, `--gr*`, and the control sizes `--input-size-<size>-<metric>`. Settings are single values: `--font-main|alt|monospace`, `--font-size`, `--font-weight`, `--line-height` and `--line-height-main|alt|monospace|prose`, `--input-border-size`, `--input-outline-size|offset`, and the shared states below.
- **Context** is set by classes on a subtree. `.tone-<tone>` points the context ramp `--tone-0` … `--tone-950` at one ramp. `.input-size-<xs|s|m|l|xl>` sets `--input-major-height`, `--input-minor-height`, `--input-major-padding`, `--input-minor-padding`, `--input-gap` and `--input-font-size`. `:root` is the default context: tone `base`, size `m`.
- **Roles** are the meaning, stated once:
  - Canvas roles: `--surface-base`/`--border-base`, `--surface-shade`/`--border-shade`, `--surface-deep`/`--border-deep`, `--surface-raised`/`--border-raised`, `--surface-knob`, `--surface-overlay`, `--text-base|subtle|faint`, `--shadow-light|medium|heavy`, `--text-shadow-auto`, `--translucency-*`.
  - Tone roles: `--tone-text`, `--tone-tint`, `--tone-tint-text`, `--tone-fill`, `--tone-fill-top|bottom`, `--tone-fill-text`, `--tone-border`, `--tone-shadow`, `--tone-focus-outline|border`. They resolve against whatever tone context they're read in.
  - This list is complete. Add a role only when every tone (or every canvas level) can answer it.
- **Customize at your `:root`**, in your cascade layer: scales and settings change the character, roles change the meaning. Never copy a component's CSS to change one value.

## Cascade layers

- Nightshade's names, weakest first: `nightshade`, `nightshade-docs`, `nightshade-components`. Then libraries you wrap, then yours. Do not rename them, do not skip them.
- The first `@layer` in the document is the order. State it **once**, in your CSS entry, before any `@import`: `@layer nightshade, nightshade-docs, nightshade-components, acme`. A skipped name, first mentioned later, is appended. In dev a component's style loads before the entry, and a build can link a chunk's CSS first, so a Vite app adds `cssLayerOrder(['acme'])` from `nightshade/vite`: it states the order ahead of every stylesheet.
- Vue components never write `@layer`. `cssLayer('acme')` from `nightshade/vite` (or `@nightshadeui/vite`), before `vue()` in the Vite plugins, puts every SFC `<style>` in the layer. A component library uses its own layer, as Nightshade's use `nightshade-components`. Components never list the order.
- Stay in the layers. Unlayered CSS beats every layer; don't unlayer to win.

## Color

- `palette.css` is generated from the project's palette spec with `npx nightshade palette`, and imported next to `@nightshadeui/stylesheets`, which brings none. Never edit it by hand: change the spec, regenerate, and commit both. The starter `@nightshadeui/stylesheets/palette.css` is for prototypes only.
- The spec must have `base` and `primary` ramps: the styles read them by name. Every other ramp is the app's choice.
- A new tone is a new ramp in the spec, and the generator emits its `.tone-<name>`. Never hand-write per-tone variables or roles.
- **Multi-tone components** (controls meant to work in any tone: buttons, inputs, toggles, chips) read roles, and the context ramp (`--tone-200`) when no role fits. They never read `--color-*`, so one `.tone-*` class re-tones them.
- **Single-tone components**, which is most of what an app builds, may read ramp steps directly (`--color-primary-600`, `--color-base-100`). Prefer a canvas role when one names the use (`--surface-deep` for a well).
- Nothing outside the palette and roles calls `light-dark()`: every ramp step is already scheme-aware.
- `--surface-*` are levels of the page (base, then shade, then deep), each with its `--border-*`. `--tone-fill` is a control's solid fill. Don't mix the words.
- `--shadow-*` and `--tone-shadow` are reference colors, not full shadows. Each component owns its shadow geometry.
- Role names are two words or more (`--text-base`, never `--text`) and carry no type suffix (`--tone-fill`, not `--tone-fill-color`).

## Size

- Lengths are multiples of `--sp`: `--sp0-5`, `--sp1`, `--sp1-5`, `--sp2`… Prefer a token over a literal `px` whenever one exists.
- `--line-height` is `--sp2`: one line of a single-line control. It is set on the page and inherited, so application components don't fight it. Don't set `line-height` to a spacing step (`--sp7`, `--sp9`); inherit `--line-height`, or for running text read `--line-height-prose`.
- `--line-height-prose` is `1.5`, a ratio, for articles and long copy (`.prose`).
- **Map heading tags yourself**, in your cascade layer. Nightshade does not style `h1`–`h6`. Display type takes a unitless ratio (`1.2`), not `--line-height` and not `--line-height-prose`. Do it for the whole app, not only `.Prose`. Without that, headings inherit `--sp2` and the letters clip.
- Never `em` or `rem`, except `letter-spacing`. Font sizes are `--font-size-*` (simple `px` in the scale: 8, 10, 12, 14, 16, 20, 24, 40, 88). Don't `calc` a size from another step.
- Single-line controls have a fixed height, `--input-major-height`, and are `border-box`. Companions take `--input-minor-height`. Size adjusts height and padding (`--input-major-padding`, `--input-minor-padding`, `--input-gap`); leave line-height inherited.
- `calc()` is for values that have to be derived: a round radius (`calc(.5 * var(--Btn-size))`), a negative offset, adding two tokens. Not for font sizes, and not for subtracting a border or a pixel from padding. Content doesn't jump when `outline` stays a look, not a state.
- A round control's radius is half its own height (`calc(.5 * var(--Btn-size))`), never a radius token.

## Components

- Each control you write defaults `--<Component>-*` on its root class from roles and the size context, and reads them without per-use fallbacks. Those locals are how the control is written, not a public token family.
- **One grammar for those variables.** Named after a role, they hold a color (`--Btn-fill`, `--Chip-text`, `--Toggle-border`, `--Btn-shadow`). Named after a CSS property, they hold a full value (`--Btn-background`, `--Btn-box-shadow`, `--Toggle-border-size`). Named after a metric, they hold a length (`--Btn-size`, `--Btn-padding`, `--Slider-knob-size`). Parts go in between (`--Slider-track-background`). No `-color` and no `-surface` suffixes.
- **States are shared:** `--input-disabled-opacity|filter`, `--input-hover-overlay` for filled controls, `--input-hover-filter` for wells, `--input-focus-outline|border` for the neutral tones' focus ring (`primary` by default; colored tones focus in their own ramp). Focus rings use `:focus-visible` (text fields: `:focus-within`).
- **Controls draw their props from one set,** and take the ones that apply: `tone`, `size`, `flat`, `outline`, `ghost`, `round`, `translucent`, `disabled`, `force*`. No prop means something else on another control. `tone` and `size` have no default: when they're omitted the control inherits the context, so add the `.tone-*` or `.input-size-*` class only when the prop is set.
- `outline` is a look, not selected. A chosen control drops `ghost`; the rest stay ghost. Toggling `outline` grows a border, and a row or toolbar jumps.
- Root and sub-element classes are PascalCase and short (`Btn`, `Label`). Modifier and state classes are prefixed with the component and camelCased (`Btn-flat`, `Toggle-forceFocus`).
- Set a look for a region with a context class, and for the whole app with `$nightshade.defaults`. Don't repeat the same props on every instance.
- If the project uses `@nightshadeui/components`, those already follow the grammar. If it uses another library, map that library's variables to the roles once, at `:root`.

## Process

- After touching CSS, run `npx nightshade-methodology tokens <dir>…` on the directories you touched (it takes several) and fix what it reports.
- After changing the palette spec, regenerate `palette.css` and check both color schemes.
