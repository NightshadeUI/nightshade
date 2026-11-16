---
title: Color
---

# Color

<p class="Lead">Colors start as ramps: twelve steps sampled from one hue along shared lightness and chroma curves. Ramps have no meaning. Context picks one, and roles give it a meaning.</p>

## Ramps

A ramp has steps `0` to `950`, from the canvas end to the ink end. Every ramp uses the same two curves, so step `500` of primary and step `500` of success have the same perceived lightness. That's what OKLCH buys you.

<PaletteRamps />

The styles don't import a palette: your app brings its own, shaped in the [Palette Studio](/studio) or with the [CLI](/styles/palette). The ramps on this page come from the starter, `@nightshadeui/stylesheets/palette.css`, which you can import while you prototype.

## Light and dark

Every ramp is scheme-aware. The dark scheme reads the ramp mirrored, so a step keeps its meaning in both: `0` is always the canvas, `950` always the ink, `200` always a quiet line.

```css
:root {
    --color-primary-200: light-dark(oklch(0.88 0.07 340), oklch(0.48 0.07 340));
}
```

That's why roles rarely need `light-dark()`: `--border-deep: var(--color-base-200)` is right in both schemes. The few that do pick a different step per scheme, like `--surface-raised`, which sits a step above the page in the dark.

Set `color-scheme` and the whole system follows. Nightshade's base sets `light dark` on `html`, and `data-theme="light"` or `"dark"` pins one. It works on any element: `color-scheme: dark` on a panel makes a dark island.

### Contrast

Each ramp also gets `--color-<ramp>-contrast`: black or white, whichever reads better on step `500` in each scheme. `--tone-fill-text` uses it.

## Canvas roles

The canvas is the neutral world that tones are placed on. Surfaces come in three levels for three levels of nesting, and each level has its own border. Pick the level you sit on, then use its pair.

<TokenTable :tokens="[
    { name: '--surface-base', value: 'base 0', note: 'Level 1: the page, and the fields on it.' },
    { name: '--border-base', value: 'base 100', note: 'Edges and dividers on the base surface.' },
    { name: '--surface-shade', value: 'base 50', note: 'Level 2: a region inside the page: sidebars, cards, code.' },
    { name: '--border-shade', value: 'base 100', note: 'Edges and dividers on the shade surface.' },
    { name: '--surface-deep', value: 'base 100', note: 'Level 3: a well: fields, tracks, toggles, tool panels.' },
    { name: '--border-deep', value: 'base 200', note: 'Edges and dividers on the deep surface.' },
    { name: '--surface-raised', value: 'base 0 / base 50', note: 'Things that float above: popups, menus, tooltips.' },
    { name: '--border-raised', value: 'base 100 / base 200', note: 'The edge of a raised surface.' },
    { name: '--surface-knob', value: 'base 0 / base 800', note: 'Knobs: light in both schemes.' },
    { name: '--surface-overlay', value: 'black 10% / 20%', note: 'The scrim behind modal overlays.' },
    { name: '--text-base', value: 'base 950', note: 'Body text.' },
    { name: '--text-subtle', value: 'base 600', note: 'Secondary text.' },
    { name: '--text-faint', value: 'base 500', note: 'Hints, captions, placeholders.' },
]" />

<Demo dual>
    <div class="CanvasSample">
        <span class="CanvasText">Text</span>
        <span class="CanvasSubtle">Subtle</span>
        <span class="CanvasFaint">Faint</span>
        <span class="CanvasWell"><span class="CanvasKnob" /></span>
    </div>
</Demo>

<style>
.CanvasSample {
    display: flex;
    align-items: center;
    gap: var(--sp3);
    padding: var(--sp2) var(--sp3);
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
}

.CanvasText { color: var(--text-base) }
.CanvasSubtle { color: var(--text-subtle) }
.CanvasFaint { color: var(--text-faint) }

.CanvasWell {
    display: flex;
    align-items: center;
    width: var(--sp6);
    height: var(--sp3);
    padding: 3px;
    border-radius: var(--radius-m);
    background: var(--surface-deep);
}

.CanvasKnob {
    width: var(--sp2-5);
    height: 100%;
    border-radius: var(--radius-s);
    background: var(--surface-knob);
    box-shadow: 0 1px 3px var(--shadow-light);
}
</style>

## Roles, not ramps

When you style your own pieces, the outermost tier that says what you mean usually serves best:

```css
/* Says how light, not what for */
.Card {
    background: var(--color-base-50);
    border: 1px solid var(--color-base-100);
}

/* Says what it means, and follows when the meaning is reassigned */
.Card {
    background: var(--surface-shade);
    border: 1px solid var(--border-shade);
}
```

Need a shade no role names? Take a step of the [context ramp](/styles/tones#the-context-ramp), like `--tone-200`. Need it in many places? Name it at your `:root` and use the name everywhere. That's growing the seed.
