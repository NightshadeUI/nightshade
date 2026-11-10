# Recipe: growing your own system

How to turn the seed into an organization's design system, one tier at a time, without forking it.

## 1. Start from a palette spec

Tune the hues and curves (the Palette Studio on the Nightshade website helps), and keep the spec in the repository as the only source of your colors.

```bash
npx nightshade palette -f design/palette.json -o src/styles/palette.css
```

## 2. Tune the scales

A handful of variables set the character of the whole system:

```css
:root {
    --sp: 8px;
    --radius-m: 6px;
    --font-size-m: 15px;
    --font-main: "Inter", sans-serif;
    --font-alt: "Fraunces", serif;
}
```

## 3. Reassign roles, not components

Roles are the meaning tier. Changing what a deep surface or a tone's fill is takes one declaration, and every component follows. Roles may read ramp steps: that's the tier they belong to.

```css
:root {
    --surface-deep: var(--color-base-200);
    --border-deep: var(--color-base-300);
}
```

## 4. Add tones for your domain

Plans, environments, statuses: if the product has a color vocabulary, make each word a tone by adding a ramp to the spec and regenerating. See [palette.md](../palette.md#adding-a-tone).

## 5. Wrap, map or replace components

Wrap the standard components and set their variables, or write your own on the same grammar ([components.md](../components.md)), or map another library's variables to the roles. Whichever you pick, everything speaks the same tiers.

```vue
<template>
    <Btn
        class="AcmeAction"
        v-bind="$attrs"
        round />
</template>

<style scoped>
.AcmeAction {
    --Btn-padding: var(--sp2);
}
</style>
```

## 6. Ship it as a package

Put your CSS in its own cascade layer after Nightshade's and publish it. Apps then depend on your system, not on Nightshade directly.

```css
@layer nightshade, nightshade-components, acme;

@import 'nightshade/css';
@import './palette.css' layer(acme);
@import './roles.css' layer(acme);
```

## Shortcuts that cost later

- Copying a component's CSS to change one color works, but changing the role it reads does the same in one line, and stays in sync.
- Ramp steps written inside a multi-tone component stop following the tone. A role, or a step of the context ramp, keeps it snapping. In a single-tone component they're fine.
- A second spacing or sizing system beside `--sp*` and the input sizes drifts. Extend the vocabularies instead.
- A `light-dark()` in a component picks a scheme by hand. The ramps already do, so the component only needs a role.
