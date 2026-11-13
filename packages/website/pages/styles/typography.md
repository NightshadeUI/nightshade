---
title: Typography
---

# Typography

<p class="Lead">Three families, one size knob and a short list of weights. The rest is derived.</p>

## Families

| Variable | Default | Use |
|----------|---------|-----|
| `--font-main` | `sans-serif` | everything |
| `--font-alt` | `--font-main` | display text and headings, if your system has a second voice |
| `--font-monospace` | `monospace` | code |

This site sets them to Source Sans 3, DM Serif Display and Source Code Pro.

## Size scale

`--font-size-m` is the knob. The small sizes step down by `2px`; the large ones multiply.

<TypeScale />

```css
:root {
    --font-size-m: 15px;
}
```

## Weights and leading

| Variable | Default |
|----------|---------|
| `--font-weight-thin` | 200 |
| `--font-weight-light` | 300 |
| `--font-weight-normal` | 400 |
| `--font-weight-bold` | 500 |
| `--font-weight-heavy` | 700 |
| `--line-height` | 1.5 |
| `--line-height-main`, `-alt`, `-monospace` | `--line-height` |

`--font-weight-bold` is 500, not 700: on screens, medium usually reads as bold without shouting. Set it to what your typeface needs.

Every face starts from `--line-height`. Set `--line-height-alt` or `--line-height-monospace` when a face needs its own leading: a display face often sets tighter, code looser.

## Utilities

`.text-xxs` to `.text-xxxl` set the size, `.text-thin` to `.text-heavy` the weight, and `.font-alt` and `.font-monospace` the family and its line height. `.color-subtle` and `.color-faint` apply the canvas text roles.
