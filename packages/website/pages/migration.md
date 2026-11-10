---
title: Migrating to 3.0
---

# Migrating to 3.0

<p class="Lead">3.0 renames the color context to <em>tone</em>, makes every ramp scheme-aware, replaces per-tone variables with one finite set of roles, and makes components inherit their tone and size. Most of it is a mechanical rename.</p>

## What changed, and why

- **`kind` is now `tone`**, everywhere: the prop, the classes and the variables. One word for one concept.
- **Every ramp is scheme-aware.** Each step is `light-dark(<light>, <dark>)`, with the dark ramp mirrored. `base-light`, `base-dark` and `--color-inverse-*` are gone: `base` covers both schemes, and `.tone-inverse` is `base` mirrored.
- **Tones are contexts over ramps.** `.tone-<tone>` sets the context ramp, `--tone-0` to `--tone-950`. The generator writes one per ramp, so a new tone is a new ramp and nothing else.
- **One set of tone roles, no per-tone variables.** `--ui-primary-surface-color` and friends are gone. Roles are stated once against the context ramp: `--tone-fill`, `--tone-text`, `--tone-border`… Read them inside a `.tone-*` context, or read the ramp step in app code.
- **`surface` is `fill` for tones.** `--tone-fill` is a control's solid fill; `--surface-base` stays the canvas. One word each.
- **Canvas roles are new.** Components and apps used to read `--color-base-200` for wells and dividers; now there are three surface levels (`--surface-base`, `--surface-shade`, `--surface-deep`), each with its border (`--border-base`…). The standard components read roles only, so they re-tone with one class.
- **Components inherit `tone` and `size`.** They used to default to `base` and `m` and stamp their own class, which broke context. Omit the prop, and a component takes the tone and size of its surroundings. `:root` still gives `base` and `m`.
- **`--ui-*-z` is gone.** Stacking order has nothing to do with color. Focused controls still rise above their neighbours.
- **Radius is a scale.** `--border-radius` is now `--radius-m`, with `--radius-s` and `--radius-l` beside it. Round controls use half their own height.
- **The palette is yours.** `@nightshadeui/stylesheets` no longer imports one: import your generated `palette.css` next to it, or the starter `@nightshadeui/stylesheets/palette.css` while prototyping. The styles read `base`, `primary` and `secondary` by name, and the generator refuses a spec without them.
- **The palette spec speaks ramps and curves.** `scales` is `ramps`, `lightnessScale` is `lightnessCurve`, `int` is `chroma` and `lum` is `lightness`. `reverse` is gone: replace `base-light` and `base-dark` with one `base` ramp.
- **`@nightshadeui/core` is `@nightshadeui/components`**, and `coreComponents` is `standardComponents`. It's an opt-in: the styles don't need it.
- **`Chip` is new**, a compact selectable label.
- **Aliases are gone.** `--sphalf`, the `--sp-xs`…`--sp-xxl` aliases, the `gap="s"`-style group gaps, and `.input-size-small`-style classes.

## Props

| 2.x | 3.0 |
|-----|-----|
| `kind="primary"` | `tone="primary"` |
| `activeKind` | `activeTone` |
| `tooltipKind` | `tooltipTone` |
| `MenuItem.kind` | `MenuItem.tone` |
| `gap="xs"`, `"s"`, `"m"`, `"l"`, `"xl"` | `gap="0-5"`, `"1"`, `"2"`, `"4"`, `"8"` |

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

Translucent knobs now keep their background and set `--Toggle-knob-transparency` or `--Slider-knob-transparency` instead.

## Classes

| 2.x | 3.0 |
|-----|-----|
| `.ui-<tone>` | `.tone-<tone>` |
| `.input-size-small`, `-medium`, `-large`… | `.input-size-s`, `-m`, `-l` |
| `.color-sublime` | `.color-faint` |
| `.color-primary`, `.color-danger`… | `.tone-primary color-tone`, `.tone-danger color-tone`… |
| `.Toggle-force-focus`, `.Slider-force-hover`… | `.Toggle-forceFocus`, `.Slider-forceHover`… |
| `.Slider-fill-style-<style>` | `.Slider-fill-<style>` |

## Variables

| 2.x | 3.0 |
|-----|-----|
| `--ui-surface-color`, `--ui-surface-top-color`, `--ui-surface-bottom-color` | `--tone-fill`, `--tone-fill-top`, `--tone-fill-bottom` |
| `--ui-surface-text-color` | `--tone-fill-text` |
| `--ui-<role>-color` (text, border, shadow, focus) | `--tone-<role>` |
| `--ui-<tone>-<role>-color` | the role inside `.tone-<tone>`, or a ramp step in app code |
| `--ui-z`, `--ui-<tone>-z` | removed |
| `--color-<ramp>-text` | `--color-<ramp>-contrast` |
| `--color-base-text`, `--color-inverse-text` | `--color-base-contrast`, or `--tone-fill-text` in context |
| `--color-base-light-*`, `--color-base-dark-*` | `--color-base-*` |
| `--color-inverse-<step>` | `--color-base-<950 − step>`, or `--tone-<step>` inside `.tone-inverse` |
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
| `--sp-xxs` … `--sp-xxl` | `--sp0-25`, `--sp0-5`, `--sp1`, `--sp2`, `--sp4`, `--sp8`, `--sp16` |

Raw ramp steps can stay in single-tone components. In multi-tone ones, and wherever a role names the use, replace them: `--color-base-0` → `--surface-base`, `--color-base-100`/`200` for wells → `--surface-deep`, for dividers → the border of the surface they sit on. Per-tone variables become the role inside a context: `color: var(--ui-primary-text-color)` → `class="tone-primary"` and `color: var(--tone-text)`. Ramps are scheme-aware now, so `light-dark(var(--color-x-300), var(--color-x-700))` is just `var(--color-x-300)`.

## Palette spec

```json
{
    "lightnessCurve": [],
    "chromaCurve": [],
    "ramps": [
        { "name": "primary", "hue": 340, "chroma": 1.2, "lightness": 1 }
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

Run it on a clean working tree, then review the diff. It covers the mechanical renames; per-tone variables (`--ui-primary-surface-color`) and ramp-to-role replacements need a human, since each one becomes a role inside a `.tone-*` class, or a ramp step in app code.

```bash
perl -pi -e '
    s/--ui-surface(-top|-bottom|-text)?-color\b/--tone-fill$1/g;
    s/--ui-(text|border|shadow|focus-outline|focus-border)-color\b/--tone-$1/g;
    s/--color-base-text\b/--color-base-contrast/g;
    s/--color-inverse-text\b/--color-base-contrast/g;
    s/--color-base-(?:light|dark)-(\d+)\b/--color-base-$1/g;
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
    s/--Btn-surface(-top|-bottom)?\b(?!-)/--Btn-fill$1/g;
    s/(--[A-Z][A-Za-z]*(?:-(?!text\b|box\b)[a-z]+)*?)-shadow\b(?![\w-])/$1-box-shadow/g;
    s/(--[A-Z][A-Za-z]*(?:-[a-z]+)*?)-shadow-color\b/$1-shadow/g;
    s/(--[A-Z][A-Za-z]*(?:-[a-z]+)*?)-(text|border|outline|icon)-color\b/$1-$2/g;
    s/(--[A-Z][A-Za-z]*(?:-[a-z]+)*?)-surface\b(?![\w-])/$1-background/g;
    s/(?<![\w-])ui-(base|inverse|primary|secondary|tertiary|success|warning|danger)\b/tone-$1/g;
    s/\bui-\$\{/tone-\${/g;
    s/\@nightshadeui\/core\b/\@nightshadeui\/components/g;
    s/\bcoreComponents\b/standardComponents/g;
    s/\bactiveKind\b/activeTone/g;
    s/\btooltipKind\b/tooltipTone/g;
    s/(?<![\w-])kind(?==")/tone/g;
    s/:kind(?==)/:tone/g;
' $(git ls-files '*.vue' '*.css' '*.ts')
```

Check `kind:` keys in your own objects by hand: menu items and `$nightshade.defaults` need `tone:`, anything else may not.
