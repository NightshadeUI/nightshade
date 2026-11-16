# Token catalog

Every variable the styles define, by tier. Defaults are Nightshade's; the project may override any of them at its `:root`.

## Scales

Enumerable ladders, in `scales/`. Single values live in `settings/`, below.

### Color ramps

Generated into the app's `palette.css`, one ramp per entry in the palette spec. `base`, `primary` and `secondary` are required; the styles read them by name. The starter spec adds `tertiary`, `success`, `warning` and `danger`.

| Variable | Meaning |
|----------|---------|
| `--color-<ramp>-<step>` | step `0`, `50`, `100`, `200` … `900`, `950`; `0` is the canvas end in both schemes |
| `--color-<ramp>-contrast` | black or white, whichever reads on step 500 (per scheme) |

Single-tone components may read these directly. Multi-tone components read them through roles and the context ramp, so that they follow `.tone-*`.

### Spacing

`--sp` is the grid unit (8px). Steps are multiples of it: `--sp0-25`, `--sp0-5`, `--sp1`, `--sp1-5`, `--sp2`, `--sp2-5`, `--sp3` … `--sp10`, then `--sp12`, `--sp16`, `--sp20` and every fourth step to `--sp100`. Override `--sp` and the whole system re-grids.

### Radius

`--radius-m` (4px), `--radius-s` (half), `--radius-l` (double). Round controls don't use these.

### Type

| Variable | Default |
|----------|---------|
| `--font-size-m` | 16px |
| `--font-size-xxs`, `-xs`, `-s` | `m` minus 6, 4, 2px |
| `--font-size-l`, `-xl`, `-xxl`, `-xxxl` | `m` × 1.25, 1.5, 1.875, 2.25 |
| `--font-weight-thin|light|normal|bold|heavy` | 200, 300, 400, 500, 700 |

### Grid fractions

`--gr1` … `--gr12`: twelfths of the container. `--vgr1` … `--vgr12`: twelfths of the viewport width.

### Control sizes

One row per size, `xs`, `s`, `m`, `l`, `xl`:

| Metric | xs | s | m | l | xl |
|--------|----|---|---|---|----|
| `major-height` | `--sp2-5` | `--sp3` | `--sp4` | `--sp5` | `--sp6` |
| `minor-height` | `--sp1-5` | `--sp2` | `--sp2-5` | `--sp3` | `--sp4` |
| `major-padding` | `--sp1` | `--sp1` | `--sp1-5` | `--sp2` | `--sp2` |
| `minor-padding` | `--sp0-25` | `--sp0-25` | `--sp0-5` | `--sp0-5` | `--sp0-5` |
| `gap` | `--sp0-25` | `--sp0-5` | `--sp1` | `--sp1` | `--sp1-5` |
| `font-size` | `xs` | `s` | `m` | `m` | `l` |

Stored as `--input-size-<size>-<metric>`. *Major* is the control itself (button, text field); *minor* is an element inside or beside it (toggle, checkbox, knob).

## Settings

Single values, in `settings/`. Same tier as the scales; some pick a step of one.

### Type

| Variable | Default |
|----------|---------|
| `--font-main`, `--font-alt`, `--font-monospace` | `sans-serif`, `--font-main`, `monospace` |
| `--font-size`, `--font-weight` | `--font-size-m`, `--font-weight-normal` (the body text) |
| `--line-height` | 1.5 |
| `--line-height-main|alt|monospace` | `--line-height`; set one where a face needs its own |

### Controls

Fixed for every size: `--input-border-size` (1px), `--input-outline-size` (2px), `--input-outline-offset` (0).

Shared states: `--input-disabled-opacity` (.6), `--input-disabled-filter` (`saturate(50%)`), `--input-hover-overlay` (a 10% grey, for filled controls), `--input-hover-filter` (`brightness(.96)`, for wells).

## Context

### Tone

| Variable | Set by |
|----------|--------|
| `--tone-0` … `--tone-950` | `.tone-<tone>`: the steps of that tone's ramp |
| `--tone-contrast` | `.tone-<tone>`: that ramp's contrast color |

`:root` is `base`. `.tone-inverse` is `base` mirrored (`--tone-0` is `--color-base-950`). Every other ramp gets its class from the generator.

### Size

`.input-size-<size>` sets `--input-major-height`, `--input-minor-height`, `--input-major-padding`, `--input-minor-padding`, `--input-gap` and `--input-font-size` from that row. `:root` is `m`.

## Roles

### Canvas roles

The page, read from the base ramp. A tone context never changes them.

| Role | Default | Use |
|------|---------|-----|
| `--surface-base` / `--border-base` | base 0 / 100 | the page, and dividers on it |
| `--surface-shade` / `--border-shade` | base 50 / 100 | a region inside the page: a sidebar, a code block |
| `--surface-deep` / `--border-deep` | base 100 / 200 | a well inside that: tracks, toggles, tool strips |
| `--surface-raised` / `--border-raised` | base 0 / 100 (dark: 50 / 200) | something that floats above the page: a popup, a menu, a tooltip |
| `--surface-knob` | base 0 (dark: 800) | the moving part of a control: a toggle or slider knob, light in both schemes |
| `--surface-overlay` | a 10% / 20% black | the scrim under a modal |
| `--text-base` | base 950 | body text |
| `--text-subtle` | base 600 | secondary text |
| `--text-faint` | base 500 | hints, captions, placeholders |
| `--shadow-light|medium|heavy` | black at 10/20/30% (dark: 20/40/60%) | reference colors for shadow geometry |
| `--text-shadow-auto` | the inverse of the current text color at 25% | lifts text off any fill |
| `--translucency-mix-light|medium|heavy` | 15%, 50%, 75% | how much background shows through |
| `--translucency-blur` | 3px | backdrop blur |
| `--translucency-highlight` | white at 50% / 16% | the inner rim light |

A surface pairs with the border of the same level: a divider on `--surface-shade` is `--border-shade`.

### Tone roles

Stated once against the context ramp; read them inside any `.tone-*` context.

| Role | Step | Neutral (`base`) override |
|------|------|---------------------------|
| `--tone-text` | 600 | 900 |
| `--tone-tint` | 100 | — |
| `--tone-tint-text` | 900 | — |
| `--tone-fill` | 500 | 100 |
| `--tone-fill-top` / `-bottom` | 400 / 600 (mirrored in dark) | 0 / 200 |
| `--tone-fill-text` | contrast | 950 |
| `--tone-border` | 600 | 400 |
| `--tone-shadow` | 800 (dark: 100) | `--shadow-medium` |
| `--tone-focus-outline` | 300 | secondary 300 |
| `--tone-focus-border` | 600 | secondary 600 |

Tint is a soft background with readable text on it (chips, badges, callouts). Fill is a control's solid face, with `--tone-fill-text` on it. Top and bottom are the ends of a filled control's gradient.

### When nothing fits

In a single-tone component, read the ramp step you mean (`--color-primary-50`). In a multi-tone component, read the context ramp: `background: var(--tone-50)` inside a tone context follows the tone and the scheme. Add a role only when every tone can answer it; a role that only makes sense for one tone is a ramp step in disguise.

## Utilities

Single-purpose, low specificity: `.color-subtle`, `.color-faint`, `.color-tone` (text in `--tone-text`; pair it with a `.tone-*` class), `.text-xxs` … `.text-xxxl`, `.text-thin|light|normal|bold|heavy`, `.font-alt`, `.font-monospace`, `.nowrap`, `.flex-1` … `.flex-12`. Optional modules: `@nightshadeui/stylesheets/kbd` and `/transitions`.
