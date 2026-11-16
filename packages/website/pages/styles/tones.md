---
title: Tones and roles
---

# Tones and roles

<p class="Lead">A tone is a ramp with a meaning attached. A <code>.tone-*</code> class points a subtree at one ramp, and a short, finite list of roles says what a control takes from it.</p>

## Tones

| Tone | Reads as | Typical use |
|------|----------|-------------|
| `base` | neutral | most controls; the default |
| `inverse` | neutral, flipped | tooltips, controls on dark bands |
| `primary` | the brand | the main action on a screen |
| `secondary` | a second voice | focus rings, highlights, links |
| `tertiary` | a quiet accent | toolbars, secondary actions |
| `success` | it worked | confirmations |
| `warning` | careful | reversible risk |
| `danger` | stop | errors, destructive actions |

These are the starter palette's tones, not a closed list. Every ramp in your palette is a tone: see [adding a tone](#adding-a-tone).

## The context ramp

A `.tone-*` class sets the **context ramp**: `--tone-0` to `--tone-950` and `--tone-contrast`, pointed at one color ramp. The generator writes one such class per ramp:

```css
.tone-danger {
    --tone-0: var(--color-danger-0);
    /* … */
    --tone-500: var(--color-danger-500);
    /* … */
    --tone-950: var(--color-danger-950);
    --tone-contrast: var(--color-danger-contrast);
}
```

`:root` is the default context: `base`. `inverse` is `base`, mirrored.

## Roles

Roles are stated once, against the context ramp, and every tone context re-resolves them. That's the whole vocabulary a control needs:

| Role | Chromatic tones | `base` | `inverse` | Meaning |
|------|-----------------|--------|-----------|---------|
| `--tone-text` | `600` | `900` | `0` | tone-colored text and icons on the canvas |
| `--tone-tint` | `100` | `100` | `100` | a soft background: chips, callouts, selection |
| `--tone-tint-text` | `900` | `900` | `900` | text on the tint |
| `--tone-fill` | `500` | `100` | `0` | the solid fill of a control |
| `--tone-fill-top`, `--tone-fill-bottom` | `400` to `600` | `0` to `200` | `200` to `0` | the two ends of the fill's bevel |
| `--tone-fill-text` | contrast | `950` | `950` | text on the fill |
| `--tone-border` | `600` | `400` | `0` | the edge of a control |
| `--tone-shadow` | `800` | `--shadow-medium` | `0` (dark: `500`) | the tinted part of a raised control's shadow |
| `--tone-focus-outline`, `--tone-focus-border` | `300`, `600` | secondary `300`, `600` | secondary `300`, `600` | the focus ring, outside and inside |

Steps are read from the tone's own context ramp, so `inverse`'s `0` is `base`'s `950`.

The neutral tones override a few roles because they fill controls from the canvas end of the ramp, not from its middle; `inverse` fills from the far end, so its fill, border, text and shadow differ from `base`'s too. That's the only difference between tones.

<ToneRoles />

Beside the tone roles sit the [canvas roles](/styles/color#canvas-roles): three levels of surface, each with its border, and three levels of text. A tone context never changes them.

### Which one do I use?

When you build your own component, three questions usually settle it:

1. **Is it the canvas?** A panel, body text, a divider: a canvas role.
2. **Is it a control's accent?** Fill, border, focus ring, tone-colored text: a tone role.
3. **Neither?** A step of the context ramp, like `--tone-200`. It still follows the tone and the scheme.

All three keep your component following the tone and the color scheme, with no values to invent.

```css
.Badge {
    padding: 0 var(--sp1);
    border-radius: var(--radius-m);
    background: var(--tone-tint);
    color: var(--tone-text);
}
```

```html
<span class="Badge tone-warning">Beta</span>
```

## Components inherit the context

The `tone` prop sets the class on the component. Leave it out, and the component takes whatever tone it sits in. One class re-tones a whole subtree:

<Demo>
    <div class="tone-danger ToneContext">
        <InputText
            label="Email"
            modelValue="not an email" />
        <Btn label="Retry" />
        <Toggle :modelValue="true" />
    </div>
    <div class="tone-success ToneContext">
        <InputText
            label="Email"
            modelValue="ada@example.com" />
        <Btn label="Send" />
        <Toggle :modelValue="true" />
    </div>
</Demo>

```html
<div class="tone-danger">
    <InputText label="Email" v-model="email" />
    <Btn label="Retry" />
</div>
```

<style>
.ToneContext {
    display: flex;
    align-items: center;
    gap: var(--sp1-5);
}
</style>

## Adding a tone

Add a ramp to your palette spec and regenerate:

```json
{ "ramps": [{ "name": "pro", "hue": 290, "chroma": 1, "lightness": 1 }] }
```

The generator writes `--color-pro-*` and `.tone-pro`. Every role resolves against it, so `<Btn tone="pro">` and `class="tone-pro"` work right away. Nothing else to register.

The [Palette Studio](/studio) does the same live: add a tone there, and this site gets it.
