---
title: The model
---

# The model

<p class="Lead">Principles at the core, the styles around them, and your system around both. Everything else is an opt-in that orbits your system: the palette generator writes the styles' color scales, and the packages plug into your app.</p>

<LayerRings />

## The rings

| Ring | Package | What it is | What you do with it |
|------|---------|------------|---------------------|
| Principles | this site | simplicity, finite vocabularies, CSS first, ownership | take what helps, adapt the rest |
| Styles | `stylesheets` | scales, context and roles as CSS variables | override any variable at your `:root` |
| Your system | your app | your product's look and language | build it on the same roles; you own all of it |

And of each opt-in:

| Opt-in | Package | Plugs into | Provides |
|--------|---------|------------|----------|
| Palette generator | `cli`, `palette-generator`, the [Studio](/studio) | the styles | your color ramps and their tones, from a spec |
| Standard components | `components` | your system | Vue controls that read roles and context |
| Canvas, particles, scroller | `canvas`, `particle-system`, `scroller` | your system | behavior: controllers with optional components |

## The rule that makes it snap

> Each tier reads only the tier directly inside it.

That one rule shapes how Nightshade itself is built:

- **Multi-tone components never read a color ramp.** The standard components read roles (`--surface-base`, `--tone-fill`…) and the input size context, never `--color-base-200`, so one `.tone-*` class re-tones them. Your single-tone components may read ramp steps directly. Nobody needs `light-dark()`: every step is already scheme-aware.
- **Meaning is authored, values are generated.** The palette generator writes ramps and tone contexts, and nothing else. Deciding that "a deep surface is base 100" is a person's call, made once in the roles.
- **Context comes from one place.** `:root` is the default context (base tone, size `m`). A `.tone-*` or `.input-size-*` class changes it for a subtree. Components inherit it unless you pass `tone` or `size`.
- **Opt-ins bring behavior, not new colors.** An opt-in may expose its own knobs (`--canvas-grid-major-color`), but it defaults them from roles.

Your app can reach into any tier. The outermost one that does the job tends to age best: a role rather than a ramp, a context class rather than a role, a component prop rather than a context class.

## The packages

```text
nightshade ─┬─ @nightshadeui/components ─┬─ @nightshadeui/stylesheets
            │                            └─ @nightshadeui/util
            └─ @nightshadeui/stylesheets

@nightshadeui/cli ── @nightshadeui/palette-generator

@nightshadeui/canvas · particle-system · scroller ── @nightshadeui/util
```

## Inside the styles

The styles repeat the same pattern on a smaller scale: four tiers, each reading only the tiers before it. That's the subject of the next section, starting with [Tokens](/styles/).
