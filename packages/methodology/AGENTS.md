# Nightshade methodology

This project's design system grows from Nightshade: a few principles, styles as CSS variables, and a generated palette. The app owns everything it grows. Speak the existing vocabularies, and extend one before adding a parallel one.

These are the always-on rules. For the token catalog, the palette workflow, component recipes and the token checker, use the `nightshade` skill (installed under `.agents/skills/nightshade`).

## Tiers

- **Four tiers, and each reads only the tiers before it:** raw values → context → roles → component variables. Sizes have no role tier: raw values → context → component. Inside a tier the order holds too: settings may pick a scale step, and tone roles may read canvas roles (`--tone-shadow: var(--shadow-medium)`), never the reverse.
- **Raw values** come in two shapes. Scales are enumerable ladders: `--color-<ramp>-<step>` and `--color-<ramp>-contrast`, `--sp*`, `--radius-s|m|l`, `--font-size-*`, `--font-weight-*`, `--gr*`, and the control sizes `--input-size-<size>-<metric>`. Settings are single values: `--font-main|alt|monospace`, `--font-size`, `--font-weight`, `--line-height` and `--line-height-main|alt|monospace`, `--input-border-size`, `--input-outline-size|offset`, and the shared states below.
- **Context** is set by classes on a subtree. `.tone-<tone>` points the context ramp `--tone-0` … `--tone-950` at one ramp. `.input-size-<xs|s|m|l|xl>` sets `--input-major-height`, `--input-minor-height`, `--input-major-padding`, `--input-minor-padding`, `--input-gap` and `--input-font-size`. `:root` is the default context: tone `base`, size `m`.
- **Roles** are the meaning, stated once:
  - Canvas roles: `--surface-base`/`--border-base`, `--surface-shade`/`--border-shade`, `--surface-deep`/`--border-deep`, `--surface-raised`/`--border-raised`, `--surface-overlay`, `--text-base|subtle|faint`, `--shadow-light|medium|heavy`, `--text-shadow-auto`, `--translucency-*`.
  - Tone roles: `--tone-text`, `--tone-tint`, `--tone-tint-text`, `--tone-fill`, `--tone-fill-top|bottom`, `--tone-fill-text`, `--tone-border`, `--tone-shadow`, `--tone-focus-outline|border`. They resolve against whatever tone context they're read in.
  - This list is complete. Add a role only when every tone (or every canvas level) can answer it.
- **Customize at your `:root`**, in a cascade layer after Nightshade's: scales and settings change the character, roles change the meaning. Never copy a component's CSS to change one value.

## Color

- `palette.css` is generated from the project's palette spec with `npx nightshade palette`, and imported next to `@nightshadeui/stylesheets`, which brings none. Never edit it by hand: change the spec, regenerate, and commit both. The starter `@nightshadeui/stylesheets/palette.css` is for prototypes only.
- The spec must have `base`, `primary` and `secondary` ramps: the styles read them by name (neutral controls focus in `secondary`). Every other ramp is the app's choice.
- A new tone is a new ramp in the spec, and the generator emits its `.tone-<name>`. Never hand-write per-tone variables or roles.
- **Multi-tone components** (controls meant to work in any tone: buttons, inputs, toggles, chips) read roles, and the context ramp (`--tone-200`) when no role fits. They never read `--color-*`, so one `.tone-*` class re-tones them.
- **Single-tone components**, which is most of what an app builds, may read ramp steps directly (`--color-primary-600`, `--color-base-100`). Prefer a canvas role when one names the use (`--surface-deep` for a well).
- Nothing outside the palette and roles calls `light-dark()`: every ramp step is already scheme-aware.
- `--surface-*` are levels of the page (base, then shade, then deep), each with its `--border-*`. `--tone-fill` is a control's solid fill. Don't mix the words.
- `--shadow-*` and `--tone-shadow` are reference colors, not full shadows. Each component owns its shadow geometry.
- Role names are two words or more (`--text-base`, never `--text`) and carry no type suffix (`--tone-fill`, not `--tone-fill-color`).

## Size

- Lengths are multiples of `--sp`: `--sp0-5`, `--sp1`, `--sp1-5`, `--sp2`… Prefer a token over a literal `px` whenever one exists.
- Single-line controls have a fixed height, `--input-major-height`, and are `border-box`, so they land on the grid. Elements inside or beside them (knobs, toggles, checkboxes) take `--input-minor-height`.
- A control's padding includes its border: `padding: 0 calc(var(--Btn-padding) - var(--Btn-border-size))`. `border-box` only holds a box that has a set size; this keeps a content-sized one the same size and its content in place when `outline` adds a border.
- A round control's radius is half its own height (`calc(.5 * var(--Btn-size))`), never a radius token.

## Components

- Each component exposes its knobs as `--<Component>-*`, defaulted on its root class from roles and the size context, and read without per-use fallbacks.
- **One grammar for those variables.** Named after a role, they hold a color (`--Btn-fill`, `--Chip-text`, `--Toggle-border`, `--Btn-shadow`). Named after a CSS property, they hold a full value (`--Btn-background`, `--Btn-box-shadow`, `--Toggle-border-size`). Parts go in between (`--Slider-track-background`). No `-color` and no `-surface` suffixes.
- **States are shared:** `--input-disabled-opacity|filter`, `--input-hover-overlay` for filled controls, `--input-hover-filter` for wells. Focus rings use `:focus-visible` (text fields: `:focus-within`).
- **Controls draw their props from one set,** and take the ones that apply: `tone`, `size`, `flat`, `outline`, `round`, `translucent`, `disabled`, `force*`. No prop means something else on another control. `tone` and `size` have no default: when they're omitted the control inherits the context, so add the `.tone-*` or `.input-size-*` class only when the prop is set.
- Root and sub-element classes are PascalCase and short (`Btn`, `Label`). Modifier and state classes are prefixed with the component and camelCased (`Btn-flat`, `Toggle-forceFocus`).
- Set a look for a region with a context class, and for the whole app with `$nightshade.defaults`. Don't repeat the same props on every instance.
- If the project uses `@nightshadeui/components`, wrap or restyle those components through their variables before writing a new one. If it uses another library, map that library's variables to the roles once, at `:root`.

## Process

- After touching CSS, run `npx nightshade-methodology tokens <dir>` and fix what it reports.
- After changing the palette spec, regenerate `palette.css` and check both color schemes.
