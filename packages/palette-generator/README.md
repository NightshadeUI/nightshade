# @nightshadeui/palette-generator

The library behind `nightshade palette`: scheme-aware OKLCH ramps and tone contexts from a palette spec.

```bash
npm i @nightshadeui/palette-generator
```

```ts
import { generatePaletteCss, PaletteSpecSchema } from '@nightshadeui/palette-generator';

const spec = PaletteSpecSchema.decode(JSON.parse(input));
const css = generatePaletteCss(spec, ':root');
```

A spec has twelve-step `lightnessCurve` and `chromaCurve`, and `ramps` of `{ name, hue, chroma, lightness }`. It must keep `base`, `primary` and `secondary`: the styles read them by name.
