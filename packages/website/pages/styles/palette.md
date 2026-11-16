---
title: Palette and CLI
---

# Palette and CLI

<p class="Lead"><code>nightshade palette</code> turns a palette spec into CSS: one scheme-aware color ramp and one tone context per ramp. It writes your <code>palette.css</code> and nothing else. The <a href="/studio">Palette Studio</a> is the same generator, with a UI.</p>

## Install

```bash
npm i -D @nightshadeui/cli
```

## Usage

```bash
# The starter palette, to stdout
npx nightshade palette

# Your spec, to a file
npx nightshade palette -f design/palette.json -o src/styles/palette.css

# Ramps under another selector, or bare ramp declarations
npx nightshade palette -f palette.json -s '.Brand'
npx nightshade palette -f palette.json --raw
```

| Option | Does |
|--------|------|
| `-f, --file <path>` | read the spec from a file, or from stdin with `-` |
| `-o, --output <path>` | write to a file instead of stdout |
| `-s, --selector <selector>` | the selector that holds the ramps; `:root` by default |
| `--raw` | emit bare ramp declarations, without a selector or tone contexts |

## The output

```css
:root {
    --color-primary-contrast: #fff;
    --color-primary-0: light-dark(oklch(1 0.012 340), oklch(0.32 0.012 340));
    /* … twelve steps per ramp */
}

.tone-primary {
    --tone-0: var(--color-primary-0);
    /* … */
    --tone-contrast: var(--color-primary-contrast);
}
```

Each step is `light-dark(<light>, <dark>)`, where the dark value is the ramp mirrored: step `0` is always the canvas end. Each ramp also becomes a tone, `.tone-<name>`.

## The spec

Every field is optional; anything you leave out takes the default. A `ramps` list replaces the default ramps, and must keep `base`, `primary` and `secondary`: the styles read them by name. The [Palette Studio](/studio) copies a complete spec for you.

```json
{
    "lightnessCurve": [1, 0.98, 0.94, 0.88, 0.8, 0.72, 0.64, 0.56, 0.48, 0.42, 0.36, 0.32],
    "chromaCurve": [0.01, 0.02, 0.03, 0.06, 0.09, 0.12, 0.12, 0.09, 0.06, 0.03, 0.02, 0.01],
    "ramps": [
        { "name": "base", "hue": 320, "chroma": 0.2, "lightness": 1 },
        { "name": "primary", "hue": 340, "chroma": 1.2, "lightness": 1 },
        { "name": "secondary", "hue": 172, "chroma": 0.72, "lightness": 1 },
        { "name": "brand", "hue": 250, "chroma": 1, "lightness": 1 }
    ]
}
```

| Field | Means |
|-------|-------|
| `lightnessCurve` | twelve OKLCH lightness values, one per step from `0` to `950` |
| `chromaCurve` | twelve OKLCH chroma values, one per step |
| `ramps[].name` | becomes `--color-<name>-<step>` and `.tone-<name>` |
| `ramps[].hue` | OKLCH hue, 0 to 360 |
| `ramps[].chroma` | multiplier on the chroma curve |
| `ramps[].lightness` | multiplier on the lightness curve |
| `ramps[].lightnessCurve` | optional: this ramp's own lightness curve, in place of the palette's |
| `ramps[].chromaCurve` | optional: this ramp's own chroma curve, in place of the palette's |

Three ramps are required, because the styles read them by name: `base` (the canvas roles, `:root` and `inverse` are built on it), and `primary` and `secondary` (neutral controls focus in `secondary`). The generator refuses a spec without them. Every other ramp is yours to name.

## In code

The generator is a plain library too:

```ts
import { generatePaletteCss, generatePaletteOklch, PaletteSpecSchema } from '@nightshadeui/palette-generator';

const spec = PaletteSpecSchema.decode(JSON.parse(input));
const css = generatePaletteCss(spec, ':root');
const ramps = generatePaletteOklch(spec); // { '--color-primary-500': 'light-dark(…)', … }
```
