# @nightshadeui/stylesheets

Nightshade's styles: scales, context and roles as CSS variables, a minimal reset and a few utilities. The foundation of a design system your app owns.

```bash
npm i @nightshadeui/stylesheets
```

```css
@layer nightshade, nightshade-docs, nightshade-components, acme;

@import '@nightshadeui/stylesheets';
@import './palette.css' layer(acme); /* generated with @nightshadeui/cli, or the starter */

@layer acme {
    :root {
        --font-main: "Source Sans 3", sans-serif;
        --radius-m: 6px;
    }
}
```

Nightshade's cascade layers, weakest first: `nightshade`, `nightshade-docs`, `nightshade-components`. Name those three, then yours, before any `@import`. A system stays in the layers; an app's own CSS can stay unlayered and win. Opt-in modules: `@nightshadeui/stylesheets/kbd` (keycaps) and `@nightshadeui/stylesheets/transitions` (Vue transition classes).

See the [Nightshade repository](https://github.com/NightshadeUI/nightshade) for the model: four tiers, tones, roles and the variable catalog.
