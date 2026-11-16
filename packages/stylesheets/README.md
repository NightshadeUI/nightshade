# @nightshadeui/stylesheets

Nightshade's styles: scales, context and roles as CSS variables, a minimal reset and a few utilities. The foundation of a design system your app owns.

```bash
npm i @nightshadeui/stylesheets
```

```css
@import '@nightshadeui/stylesheets';
@import './palette.css'; /* generated with @nightshadeui/cli, or the starter: '@nightshadeui/stylesheets/palette.css' */

:root {
    --font-main: "Source Sans 3", sans-serif;
    --radius-m: 6px;
}
```

Everything sits in the `nightshade` cascade layer, so your own CSS wins. Opt-in modules: `@nightshadeui/stylesheets/kbd` (keycaps) and `@nightshadeui/stylesheets/transitions` (Vue transition classes).

See the [Nightshade repository](https://github.com/NightshadeUI/nightshade) for the model: four tiers, tones, roles and the variable catalog.
