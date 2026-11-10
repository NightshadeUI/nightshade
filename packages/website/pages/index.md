---
layout: page
title: Nightshade
titleTemplate: Grow your own design system
---

<HomeHero />

<HomeSection
    title="The model"
    tagline="Principles, styles, and your system. Everything else is opt-in."
    text="Install the stylesheets, generate a palette, and you're ready: override the essentials at your :root and build your own. Standard components, canvas, particles and scroller orbit your system. Use them, map your own component library to the same variables, or ignore them. Hover anything to find it in the legend.">

<LayerRings />

</HomeSection>

<HomeSection
    title="From seed to button"
    tagline="Four steps: scale, context, role, component."
    text="Colors take four steps from a raw value to a component; sizes take three. Components read only the last, generic slot, so one class re-tones or re-sizes a whole subtree.">

<TokenChain />

</HomeSection>

<HomeSection
    title="Two axes"
    tagline="Any tone, five sizes, one grammar."
    text="Controls take the same tone and size, and the same switches where they apply: flat, outline, round, translucent. Toggle them in the hero above: the styles are look-agnostic, so every combination has to hold up.">

<Demo>
<ToneMatrix />
</Demo>

</HomeSection>

<HomeSection
    title="Roles"
    tagline="A complete, finite vocabulary."
    text="Building your own component? Ask three questions. Is it the canvas: a panel, text, a divider? Use a canvas role. Is it the control's accent: fill, border, focus? Use a tone role. Neither? A step of the context ramp, like --tone-200, still follows the tone and the scheme.">

<RoleVocabulary />

</HomeSection>

<HomeSection
    title="Open tones"
    tagline="A new tone is one ramp away."
    text="Every ramp in your palette spec becomes a tone: the generator writes its color scale and its .tone-<name> context, and every component re-tones with that one class. Nothing else to register.">

<div class="OpenTones Prose">
<div>

```json
{ "ramps": [{ "name": "brand", "hue": 250, "chroma": 1, "lightness": 1 }] }
```

```css
/* npx nightshade palette -f palette.json -o src/palette.css */
:root {
    --color-brand-500: light-dark(oklch(0.64 0.12 250), oklch(0.72 0.12 250));
}

.tone-brand {
    --tone-500: var(--color-brand-500);
}
```

</div>
<div>

```html
<Btn tone="brand" label="Ship it" />
<div class="tone-brand">
    <Toggle /> <Chip label="Also brand" />
</div>
```

Add a tone in the [Palette Studio](/studio) and this whole site gets it.

</div>
</div>

</HomeSection>

<HomeSection title="Get started" tagline="Plant it in three steps.">

<div class="HomeSteps Prose">
<div class="HomeStep">

<span class="HomeStepIndex">1</span>

### Install

```bash
npm i @nightshadeui/stylesheets
```

The styles are the whole foundation. Add `@nightshadeui/components` if you want the standard controls.

</div>
<div class="HomeStep">

<span class="HomeStepIndex">2</span>

### Generate your palette

```bash
npm i -D @nightshadeui/cli
npx nightshade palette -f palette.json -o src/palette.css
```

Or design it in the [Palette Studio](/studio) and copy the CSS. Just prototyping? Import the starter, `@nightshadeui/stylesheets/palette.css`, and generate your own later.

</div>
<div class="HomeStep">

<span class="HomeStepIndex">3</span>

### Own your `:root`

```css
@import '@nightshadeui/stylesheets';
@import './palette.css';

:root {
    --font-main: "Source Sans 3", sans-serif;
    --radius-m: 6px;
}
```

Then grow it: [growing your own](/philosophy/ownership).

</div>
</div>

</HomeSection>
