# The palette

All color starts in one JSON spec, kept in the repository. The generator turns it into `palette.css`, which is never edited by hand. `@nightshadeui/stylesheets` doesn't import a palette: the app imports its own next to the styles.

```css
@import '@nightshadeui/stylesheets';
@import './palette.css';
```

While prototyping, `@nightshadeui/stylesheets/palette.css` is a starter: the generator's defaults. Replace it before the app's colors matter.

## The spec

```json
{
    "lightnessCurve": [1, 0.98, 0.94, 0.88, 0.8, 0.72, 0.64, 0.56, 0.48, 0.42, 0.36, 0.32],
    "chromaCurve": [0.01, 0.02, 0.03, 0.06, 0.09, 0.12, 0.12, 0.09, 0.06, 0.03, 0.02, 0.01],
    "ramps": [
        { "name": "base", "hue": 320, "chroma": 0.2, "lightness": 1 },
        { "name": "primary", "hue": 340, "chroma": 1.2, "lightness": 1 }
    ]
}
```

| Field | Meaning |
|-------|---------|
| `lightnessCurve` | twelve OKLCH lightness values, one per step `0` … `950`, shared by every ramp |
| `chromaCurve` | twelve OKLCH chroma values, shared by every ramp |
| `ramps[].name` | the ramp and its tone: `--color-<name>-*` and `.tone-<name>` |
| `ramps[].hue` | OKLCH hue, 0–360 |
| `ramps[].chroma` | multiplier on the chroma curve (0 is grey, 1 is the curve, 2 is twice as vivid) |
| `ramps[].lightness` | multiplier on the lightness curve (above 1 lightens, below darkens) |

Every field is optional. Leave out `ramps` and you get the starter seven: `base`, `primary`, `secondary`, `tertiary`, `success`, `warning`, `danger`. A spec with `ramps` replaces that list. It must keep `base`, `primary` and `secondary`, the ramps the styles read by name, and the generator refuses a spec without them. Ramp names are lowercase and kebab-case, and `inverse` is reserved.

## Generating

```bash
npm i -D @nightshadeui/cli
npx nightshade palette -f palette.json -o src/styles/palette.css
```

| Option | Effect |
|--------|--------|
| `-f, --file <path>` | read the spec (`-` for stdin); without it, the defaults |
| `-o, --output <path>` | write to a file instead of stdout |
| `-s, --selector <selector>` | where the ramps are declared, `:root` by default |
| `--raw` | bare declarations, without a selector or tone contexts |

From code, the same thing:

```ts
import { generatePaletteCss, PaletteSpecSchema } from '@nightshadeui/palette-generator';

const spec = PaletteSpecSchema.decode(JSON.parse(text));
const css = generatePaletteCss(spec, ':root');
```

Decode untrusted input (files, storage, the clipboard) with `PaletteSpecSchema` before using it. `generateRampSteps(ramp, spec)` gives the sampled steps if you need to draw swatches.

The Palette Studio on the Nightshade website edits a spec visually and exports both the spec and the CSS.

## What it writes

For each ramp:

- `--color-<name>-0` … `--color-<name>-950`, each `light-dark(<light>, <dark>)`. The dark ramp is the light one reversed, so step 0 is the canvas end in both schemes.
- `--color-<name>-contrast`: `#000` or `#fff`, whichever reads on step 500, per scheme.
- `.tone-<name>`: sets `--tone-0` … `--tone-950` and `--tone-contrast` to that ramp.

Light and dark therefore come for free, as long as nothing downstream picks a scheme on its own. That's why components never call `light-dark()`.

## Adding a tone

A tone is a word in your product's color vocabulary: a plan, an environment, a status.

1. Add a ramp to the spec: `{ "name": "pro", "hue": 290, "chroma": 1, "lightness": 1 }`.
2. Regenerate `palette.css` and commit both files.
3. Use it: `<Btn tone="pro">`, `<section class="tone-pro">`, or `class="tone-pro color-tone"` for text.

Every tone role already resolves against the new ramp. Don't write `--pro-fill` or `.tone-pro { --tone-fill: … }` by hand. If a tone's fill reads poorly, tune its `chroma` and `lightness` multipliers instead.

## Tuning

- **Too loud or too dull overall:** scale the chroma curve, or one ramp's `chroma`.
- **A tone's fill is too light for white text:** lower its `lightness` a little; the contrast color flips where it needs to.
- **Neutral feels cold or warm:** move `base`'s hue, and keep its `chroma` low (0.1–0.3).
- **Dark mode feels washed out:** steepen the dark end of `lightnessCurve` (the last steps), since dark mode reads the curve mirrored.

Check both schemes after any change.
