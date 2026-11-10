# Migrating from 2.x to 3.0

3.0 renames the color context to *tone*, makes every ramp scheme-aware, replaces per-tone variables with one finite set of roles, and makes components inherit their tone and size. Most of it is a mechanical rename.

<!-- Keep in sync with packages/website/pages/migration.md: the same body, under a different header. -->

## What changed, and why

- **`kind` is now `tone`**, everywhere: the prop, the classes and the variables. One word for one concept.
- **Every ramp is scheme-aware.** Each step is `light-dark(<light>, <dark>)`, with the dark ramp mirrored. `base-light`, `base-dark` and `--color-inverse-*` are gone: `base` covers both schemes, and `.tone-inverse` is `base` mirrored.
- **Tones are contexts over ramps.** `.tone-<tone>` sets the context ramp, `--tone-0` to `--tone-950`. The generator writes one per ramp, so a new tone is a new ramp and nothing else.
- **One set of tone roles, no per-tone variables.** `--ui-primary-surface-color` and friends are gone. Roles are stated once against the context ramp: `--tone-fill`, `--tone-text`, `--tone-border`… Read them inside a `.tone-*` context, or read the ramp step in app code.
- **`surface` is `fill` for tones.** `--tone-fill` is a control's solid fill; `--surface-base` stays the canvas. One word each.
- **Canvas roles are new.** Components and apps used to read `--color-base-200` for wells and dividers; now there are three surface levels (`--surface-base`, `--surface-shade`, `--surface-deep`), each with its border (`--border-base`…). The standard components read roles only, so they re-tone with one class.
- **New roles and settings.** `--tone-tint` and `--tone-tint-text` are a tone's soft background and the text on it. Each font face has its own line height (`--line-height-main|alt|monospace`), and the utilities gain `.text-m` and `.font-monospace`.
- **Components inherit `tone` and `size`.** They used to default to `base` and `m` and stamp their own class, which broke context. Omit the prop, and a component takes the tone and size of its surroundings. `:root` still gives `base` and `m`. A bound `undefined` (`:tone="item.tone"`) counts as omitted, so `$nightshade.defaults` still reach it.
- **States are shared.** Disabled and hover looks come from `--input-disabled-opacity|filter` and `--input-hover-overlay|filter`, not per-component values. Focus rings show on `:focus-visible` (text fields: `:focus-within`), so a mouse click no longer rings a button.
- **Geometry is tighter.** A control's padding includes its border, so `outline` no longer grows it, and round controls take half their own height as radius. Check custom CSS that compensated for either.
- **`--ui-*-z` is gone.** Stacking order has nothing to do with color. Focused controls still rise above their neighbours.
- **Radius is a scale.** `--border-radius` is now `--radius-m`, with `--radius-s` and `--radius-l` beside it.
- **The palette is yours.** `@nightshadeui/stylesheets` no longer brings one: import your generated `palette.css` next to it, or the starter `@nightshadeui/stylesheets/palette.css` while prototyping. The styles read `base`, `primary` and `secondary` by name, and the generator throws on a spec without them.
- **The palette spec speaks ramps and curves.** `scales` is `ramps`, `lightnessScale` is `lightnessCurve`, `int` is `chroma` and `lum` is `lightness`. `reverse` is gone: replace `base-light` and `base-dark` with one `base` ramp.
- **`@nightshadeui/core` is `@nightshadeui/components`**, and `coreComponents` is `standardComponents`. It's an opt-in: the styles don't need it, but it now depends on `@nightshadeui/stylesheets`, and declares `vue-router` as an optional peer for `RouterBtn`.
- **`GhyphXmark` is spelled `GlyphXmark`.**
- **`Chip` is new**, a compact label on the tint of its tone. Like `Btn`, it holds no selection state.
- **`useScroller` is gone.** Composables are out: create a `ScrollerController`, `mount(el)` it in `mounted` and `unmount()` it in `unmounted`.
- **Aliases are gone.** `--sphalf`, the `--sp-xs`…`--sp-xxl` aliases, the `gap="s"`-style group gaps, and `.input-size-small`-style classes.

## Props

| 2.x | 3.0 |
|-----|-----|
| `kind="primary"` | `tone="primary"` |
| `activeKind` | `activeTone` |
| `tooltipKind` | `tooltipTone` |
| `MenuItem.kind` | `MenuItem.tone` |
| `gap="xxs"`, `"xs"`, `"s"`, `"m"`, `"l"`, `"xl"`, `"xxl"` | `gap="0-25"`, `"0-5"`, `"1"`, `"2"`, `"4"`, `"8"`, `"16"` |

## Component variables

Component knobs follow one grammar now: named after a role, they hold a color; named after a CSS property, they hold a full value.

| 2.x | 3.0 |
|-----|-----|
| `--Btn-surface`, `--Btn-surface-top`, `--Btn-surface-bottom` | `--Btn-fill`, `--Btn-fill-top`, `--Btn-fill-bottom` |
| `--<Component>-surface`, `--<Component>-<part>-surface` | `--<Component>-background`, `--<Component>-<part>-background` |
| `--<Component>-text-color`, `-border-color`, `-outline-color`, `-icon-color` | `--<Component>-text`, `-border`, `-outline`, `-icon` |
| `--<Component>-shadow` (the full `box-shadow`) | `--<Component>-box-shadow` |
| `--<Component>-shadow-color` | `--<Component>-shadow` |
| `--Bubble-color`, `--Filler-color`, `--InputBase-label-color` | `--Bubble-background`, `--Filler-border`, `--InputBase-label-text` |
| `--Toggle-knob-surface`, `--Slider-knob-surface` | `--Toggle-knob-background`, `--Slider-knob-background` |
| `--Bubble-shadow`, `--Tab-shadow` (the `drop-shadow()` arguments) | `--Bubble-filter`, `--Tab-filter` (the whole `filter`: `drop-shadow(…)`) |
| `--Checkbox-mark-shadow` | `--Checkbox-mark-text-shadow` |
| `--CanvasBoxSelect-color`, `--canvas-box-select-color`, `--canvas-box-select-opacity` | `--CanvasBoxSelect-fill`, `--CanvasBoxSelect-opacity` |
| `--canvas-background`, `--canvas-margin-cells`, `--canvas-grid-*` | `--CanvasView-background`, `--CanvasView-margin-cells`, `--CanvasView-grid-*` |
| `--canvas-grid-major-color`, `--canvas-grid-minor-color` | `--CanvasView-grid-major-fill`, `--CanvasView-grid-minor-fill` |
| `--canvas-resize-handle-size` | `--CanvasObjectResize-handle-size` |

Translucent knobs now keep their background and set `--Toggle-knob-transparency` or `--Slider-knob-transparency` instead.

The canvas knobs are component knobs now, defaulted on `.CanvasView` from roles: set them on a class of yours on the `CanvasView`, not on an ancestor.

## Classes

| 2.x | 3.0 |
|-----|-----|
| `.ui-<tone>` | `.tone-<tone>` |
| `.input-size-extra-small`, `-small`, `-medium`, `-normal`, `-large` | `.input-size-xs`, `-s`, `-m`, `-m`, `-l` |
| `.color-sublime` | `.color-faint` |
| `.color-primary`, `.color-danger`… | `.tone-primary color-tone`, `.tone-danger color-tone`… |
| `.Toggle-force-focus`, `.Checkbox-force-hover`, `.Slider-force-focus`… | `.Toggle-forceFocus`, `.Checkbox-forceHover`, `.Slider-forceFocus`… |
| `.Slider-fill-style-<style>` | `.Slider-fill-<style>` |

## Variables

| 2.x | 3.0 |
|-----|-----|
| `--ui-surface-color`, `--ui-surface-top-color`, `--ui-surface-bottom-color` | `--tone-fill`, `--tone-fill-top`, `--tone-fill-bottom` |
| `--ui-surface-text-color` | `--tone-fill-text` |
| `--ui-<role>-color` (text, border, shadow, focus) | `--tone-<role>` |
| `--ui-<tone>-<role>-color` | the role inside `.tone-<tone>`, or a ramp step in app code |
| `--ui-z`, `--ui-<tone>-z` | removed |
| `--color-<ramp>-text` | `--color-<ramp>-contrast` (the text on step 500) |
| `--color-base-text` | `--text-base`, or `--tone-fill-text` on a fill |
| `--color-inverse-text` | `--color-base-0`, or `--tone-fill-text` inside `.tone-inverse` |
| `--color-base-light-*`, `--color-base-dark-*` | `--color-base-*` |
| `--color-inverse-<step>` | `--tone-<step>` inside `.tone-inverse`, or the mirrored base step (below) |
| `--base-color` | `--surface-base` |
| `--text-color` | `--text-base` |
| `--text-color-subtle` | `--text-subtle` |
| `--text-color-sublime` | `--text-faint` |
| `--overlay-surface` | `--surface-overlay` |
| `--color-base-0` / `-800` on knobs | `--surface-raised` |
| `--shadow-color-<strength>` | `--shadow-<strength>` |
| `--translucency-highlight-color` | `--translucency-highlight` |
| `--ui-auto-text-shadow-color` | `--text-shadow-auto` |
| `--border-radius` | `--radius-m` |
| `--sphalf` | `--sp0-5` |
| `--sp-xxs`, `-xs`, `-s`, `-m`, `-l`, `-xl`, `-xxl` | `--sp0-25`, `--sp0-5`, `--sp1`, `--sp2`, `--sp4`, `--sp8`, `--sp16` |

`--color-base-contrast` is not the old `--color-base-text`: it's the text on step 500, and often the same in both schemes. Use `--text-base` for ink on the canvas.

The inverse ramp mirrors `base` by position, not by subtracting from 950:

| `--color-inverse-*` | 0 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `--color-base-*` | 950 | 900 | 800 | 700 | 600 | 500 | 400 | 300 | 200 | 100 | 50 | 0 |

Raw ramp steps can stay in single-tone components. In multi-tone ones, and wherever a role names the use, replace them: `--color-base-0` → `--surface-base`, `--color-base-100`/`200` for wells → `--surface-deep`, for dividers → the border of the surface they sit on. Per-tone variables become the role inside a context: `color: var(--ui-primary-text-color)` → `class="tone-primary"` and `color: var(--tone-text)`. Ramps are scheme-aware now, so `light-dark(var(--color-x-300), var(--color-x-700))` is just `var(--color-x-300)`.

## Palette spec

A complete spec has the three ramps the styles read. The curves are optional, with twelve values each, one per step:

```json
{
    "ramps": [
        { "name": "base", "hue": 320, "chroma": 0.2, "lightness": 1 },
        { "name": "primary", "hue": 340, "chroma": 1.2, "lightness": 1 },
        { "name": "secondary", "hue": 172, "chroma": 0.72, "lightness": 1 }
    ]
}
```

| 2.x | 3.0 |
|-----|-----|
| `scales` | `ramps` |
| `lightnessScale`, `chromaScale` | `lightnessCurve`, `chromaCurve` |
| `int`, `lum` | `chroma`, `lightness` |
| `cssSelector` | the CLI's `--selector`, or the second argument of `generatePaletteCss` |
| `base-light` + `base-dark` with `reverse` | one `base` ramp |
| `DEFAULT_SCALE_SPECS`, `SCALE_STEPS` | `DEFAULT_RAMPS`, `RAMP_STEPS` |

## A script for the renames

Run it on a clean working tree, then review the diff. It covers the mechanical renames. `--Bubble-filter` and `--Tab-filter` take the whole `drop-shadow(…)` now, so wrap the old values. What needs a human: per-tone variables (`--ui-primary-surface-color`), each of which becomes a role inside a `.tone-*` class or a ramp step in app code; ramp-to-role replacements; and the `.color-<tone>` utilities, which become two classes.

```bash
perl -pi -e '
    BEGIN {
        @steps = (0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950);
        %mirror = map { $steps[$_] => $steps[$#steps - $_] } 0 .. $#steps;
        %sp = (xxs => "0-25", xs => "0-5", s => "1", m => "2", l => "4", xl => "8", xxl => "16");
        %size = ("extra-small" => "xs", small => "s", medium => "m", normal => "m", large => "l");
    }
    s/--ui-surface(-top|-bottom|-text)?-color\b/--tone-fill$1/g;
    s/--ui-(text|border|shadow|focus-outline|focus-border)-color\b/--tone-$1/g;
    s/--color-base-(?:light|dark)-text\b/--color-base-contrast/g;
    s/--color-base-(?:light|dark)-(\d+)\b/--color-base-$1/g;
    s/--color-base-text\b/--text-base/g;
    s/--color-inverse-text\b/--color-base-0/g;
    s/--color-inverse-(\d+)\b/--color-base-$mirror{$1}/g;
    s/--color-([a-z-]+?)-text\b/--color-$1-contrast/g;
    s/--text-color-sublime\b/--text-faint/g;
    s/--text-color-subtle\b/--text-subtle/g;
    s/--text-color\b/--text-base/g;
    s/--base-color\b/--surface-base/g;
    s/--overlay-surface\b/--surface-overlay/g;
    s/--shadow-color-(light|medium|heavy)\b/--shadow-$1/g;
    s/--translucency-highlight-color\b/--translucency-highlight/g;
    s/--ui-auto-text-shadow-color\b/--text-shadow-auto/g;
    s/--border-radius\b/--radius-m/g;
    s/--sphalf\b/--sp0-5/g;
    s/--sp-(xxs|xs|s|m|l|xl|xxl)\b/--sp$sp{$1}/g;
    s/\bgap="(xxs|xs|s|m|l|xl|xxl)"/gap="$sp{$1}"/g;
    s/\binput-size-(extra-small|small|medium|normal|large)\b/input-size-$size{$1}/g;
    s/\bcolor-sublime\b/color-faint/g;
    s/\b(Toggle|Checkbox|Slider)-force-(focus|hover)\b/$1-force\u$2/g;
    s/\bSlider-fill-style-/Slider-fill-/g;
    s/--canvas-grid-(major|minor)-color\b/--CanvasView-grid-$1-fill/g;
    s/--canvas-(background|margin-cells|grid-[a-z-]+)\b/--CanvasView-$1/g;
    s/--(?:canvas-box-select|CanvasBoxSelect)-color\b/--CanvasBoxSelect-fill/g;
    s/--canvas-box-select-opacity\b/--CanvasBoxSelect-opacity/g;
    s/--canvas-resize-handle-size\b/--CanvasObjectResize-handle-size/g;
    s/--(Bubble|Tab)-shadow\b(?![\w-])/--$1-filter/g;
    s/--Checkbox-mark-shadow\b(?![\w-])/--Checkbox-mark-text-shadow/g;
    s/--Btn-surface(-top|-bottom)?\b(?!-)/--Btn-fill$1/g;
    s/(--[A-Z][A-Za-z]*(?:-(?!text\b|box\b)[a-z]+)*?)-shadow\b(?![\w-])/$1-box-shadow/g;
    s/(--[A-Z][A-Za-z]*(?:-[a-z]+)*?)-shadow-color\b/$1-shadow/g;
    s/(--[A-Z][A-Za-z]*(?:-[a-z]+)*?)-(text|border|outline|icon)-color\b/$1-$2/g;
    s/(--[A-Z][A-Za-z]*(?:-[a-z]+)*?)-surface\b(?![\w-])/$1-background/g;
    s/(?<![\w-])ui-(base|inverse|primary|secondary|tertiary|success|warning|danger)\b/tone-$1/g;
    s/\bui-\$\{/tone-\${/g;
    s/\@nightshadeui\/core\b/\@nightshadeui\/components/g;
    s/\bcoreComponents\b/standardComponents/g;
    s/\bGhyphXmark\b/GlyphXmark/g;
    s/\bactiveKind\b/activeTone/g;
    s/\btooltipKind\b/tooltipTone/g;
    s/(?<![\w-])kind(?==")/tone/g;
    s/:kind(?==)/:tone/g;
' $(git ls-files '*.vue' '*.css' '*.ts')
```

Check `kind:` keys in your own objects by hand: menu items and `$nightshade.defaults` need `tone:`, anything else may not.

## Migrating a repository

1. **Dependencies.** Bump every `@nightshadeui/*` package to the same 3.x version. Replace `@nightshadeui/core` with `@nightshadeui/components`.
2. **Palette spec.** Convert it with the table above: `scales` → `ramps`, merge `base-light` and `base-dark` into one `base` ramp, then regenerate `palette.css` and import it next to `@nightshadeui/stylesheets`, which no longer brings one.
3. **Mechanical renames.** On a clean working tree, run the script above and review the diff.
4. **Manual pass.** Search for what the script leaves: `--ui-`, `light-dark(`, `kind:`, `color-primary`… Turn per-tone variables into a `.tone-*` class plus a role, or into the ramp step they meant. Ramp steps in single-tone components can stay; swap them for a canvas role where one names the use (`--surface-deep` for a well). Replace `useScroller` with a `ScrollerController`.
5. **Defaults.** Components inherit `tone` and `size` now. Look for places that relied on a `base` or `m` default inside a toned or sized region, and set the prop explicitly where the old look was intended.
6. **Check.** Run `npx nightshade-methodology tokens`, build, and look at both color schemes, with the keyboard too: focus rings now show on keyboard focus only.
