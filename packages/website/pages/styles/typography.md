---
title: Typography
---

# Typography

<p class="Lead">Three families, a type scale in simple pixels, and two line heights: one for the app, one for prose.</p>

## Families

| Variable | Default | Use |
|----------|---------|-----|
| `--font-main` | `sans-serif` | everything |
| `--font-alt` | `--font-main` | display text and headings, if your system has a second voice |
| `--font-monospace` | `monospace` | code |

This site sets them to Source Sans 3, Fraunces and Source Code Pro.

## Size scale

Each step is a simple `px`. `--font-size-m` is body text; `--font-size-xxxl` is h1. Nightshade's styles don't map tags to the type scale: the app (or the system grown from the seed) does that, in its cascade layer, with display line-heights as ratios. Map the whole site, not only `.Prose`, or titles outside articles inherit `--line-height` (`--sp2`) and clip. This site maps them for itself; don't copy its `type.css` or its font tags.

<TypeScale />

```css
h1 { font-size: var(--font-size-xxxl); line-height: 1.2; } /* 88px */
h2 { font-size: var(--font-size-xxl);  line-height: 1.2; } /* 40px */
```

## Weights and leading

| Variable | Default |
|----------|---------|
| `--font-weight-thin` | 200 |
| `--font-weight-light` | 300 |
| `--font-weight-normal` | 400 |
| `--font-weight-bold` | 500 |
| `--font-weight-heavy` | 700 |
| `--line-height` | `--sp2` |
| `--line-height-main`, `-alt`, `-monospace` | `--line-height` |
| `--line-height-prose` | `1.5` |

`--font-weight-bold` is 500, not 700: on screens, medium usually reads as bold without shouting. Set it to what your typeface needs.

`--line-height` is `--sp2`: one line of a single-line control. The page sets it and everything inherits it, so application components don't fight an irregular line height to fit the grid. Don't set `line-height` to a spacing step. Running text reads `--line-height-prose` (a ratio, `1.5`), or takes the `.prose` class. Headings are the app's: map the tags, with a display ratio, not `--line-height-prose`.

```css
.Article {
    line-height: var(--line-height-prose);
}
```

A single-line box (a button, a link in a list, a row) sets its height and no vertical padding. Size adjusts the height and the padding; leave line-height inherited.

Never `em` or `rem`, except `letter-spacing`. Font sizes are `--font-size-*`.

## Utilities

`.text-xxxs` to `.text-xxxl` set the size, `.text-thin` to `.text-heavy` the weight, and `.font-alt` and `.font-monospace` the family and its line height. `.prose` sets `--line-height-prose`. `.color-subtle` and `.color-faint` apply the canvas text roles.
