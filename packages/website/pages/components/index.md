---
title: Control grammar
---

# Control grammar

<p class="Lead">The standard components are an opt-in: Vue controls that read the styles and nothing else. Every one speaks the same props. Learn them on a button, and you know them on a toggle, a chip, a slider and a text field.</p>

Already have a component library? Skip this package and map that library's variables to the same roles and context. The styles don't care who reads them.

## Install

```bash
npm i @nightshadeui/stylesheets @nightshadeui/components
```

```ts
import '@nightshadeui/stylesheets';
import '@nightshadeui/components/css';
import { standardComponents } from '@nightshadeui/components';

for (const [name, component] of Object.entries(standardComponents)) {
    app.component(name, component);
}
```

Or import components one by one: `import { Btn, InputText } from '@nightshadeui/components'`. The `nightshade` package bundles both.

## The grammar

<PlaygroundBar />

<Demo>
    <Btn label="Button" tone="primary" />
    <InputText placeholder="Text field" />
    <Toggle :modelValue="true" tone="primary" />
    <Checkbox :modelValue="true" tone="primary" />
    <Slider :modelValue="40" tone="primary" style="width: 160px" />
</Demo>

The playground bar above sets the same props on every demo of this section. Try it on any page.

| Prop | Type | Effect |
|------|------|--------|
| `tone` | tone name | the [tone](/styles/tones); inherits the context when omitted |
| `size` | `xs` `s` `m` `l` `xl` | the [input size](/styles/sizing#input-sizes); inherits the context when omitted |
| `flat` | boolean | no gradient, no raised shadow |
| `outline` | boolean | a border in `--tone-border`, inside the control's padding, so its size doesn't change |
| `round` | boolean | radius of half the control's own height |
| `translucent` | boolean | blends with the background and blurs it |
| `disabled` | boolean | dimmed, and ignores input |
| `forceHover`, `forceFocus`, `forceActive` | boolean | show a state without the pointer, for docs and tests |
| `hoverOverrides`, `focusOverrides`, `activeOverrides` | object | style props that apply only in that state |

Where it makes sense, controls also take `before` and `after` slots around their content.

### State overrides

The overrides take the same style props. A ghost button that turns solid primary on hover:

<Demo>
    <Btn label="Hover me" ghost :hoverOverrides="{ ghost: false, tone: 'primary' }" />
</Demo>

```html
<Btn
    label="Hover me"
    ghost
    :hoverOverrides="{ ghost: false, tone: 'primary' }" />
```

## Context, not configuration

Leave `tone` and `size` out and a control takes them from its surroundings. One class changes a whole group:

```html
<div class="tone-danger input-size-s">
    <InputText label="Name" />
    <Btn label="Remove" />
</div>
```

## App-wide defaults

Every prop resolves in three steps: the prop you pass, then `$nightshade.defaults`, then the component's own default. Provide the defaults once, and every component that doesn't set a prop takes them:

```ts
import { reactive } from 'vue';

app.provide('$nightshade', reactive({
    defaults: {
        round: true,
        flat: true,
    },
}));
```

That's what the Flat, Round, Outline and Translucent switches on the home page do: they set the defaults for this whole site. Because the defaults object is reactive, the site re-renders in place.

A few things to know:

- **Explicit props win.** `<Btn :round="false">` stays square, whatever the defaults say. It's a handy way to pin a look that shouldn't follow the app.
- **Defaults cascade like context.** A component that provides its own `$nightshade` overrides them for its subtree. The demos on this site do exactly that, to add the state switches (disabled, hover, focus, active) of the playground bar.
- **Any prop can have a default,** not only the looks: `size: 's'` makes a dense app, and `tone` sets a brand tone for every control that doesn't choose one. Prefer a context class for a region, and defaults for the whole app.
- **Every combination holds up.** Flat, round, outline and translucent are independent switches, and the standard components are built to look right in all sixteen. That's what a look-agnostic base buys you.

## Component variables

Each component exposes its own knobs as `--<Component>-*`, defaulted from roles and the size context. Set them on a class of your own:

```css
.ToolbarBtn {
    --Btn-padding: var(--sp1);
    --Btn-radius: var(--radius-s);
}
```

The names follow one grammar across every component:

| Kind | Holds | Examples |
|------|-------|----------|
| Named after a role | a color | `--Btn-fill`, `--Chip-text`, `--Toggle-border`, `--Slider-outline`, `--Btn-shadow` |
| Named after a CSS property | a full value | `--Btn-background`, `--Btn-box-shadow`, `--Btn-text-shadow`, `--Toggle-border-size` |
| Named after a metric | a length | `--Btn-size`, `--Btn-padding`, `--Btn-radius`, `--Slider-knob-size` |

Parts add their name in between: `--Slider-track-background`, `--Toggle-knob-transparency`.

States are shared across controls, in the input size scale: `--input-disabled-opacity`, `--input-disabled-filter`, `--input-hover-overlay` (filled controls) and `--input-hover-filter` (wells). Focus rings show on keyboard focus, with `:focus-visible`; text fields show theirs whenever they're focused.

## Inventory

| Component | Page |
|-----------|------|
| `Btn`, `RouterBtn` | [Button](/components/button) |
| `Chip` | [Chip](/components/chip) |
| `InputBase`, `InputText`, `InputTextarea`, `InputSelect`, `InputGroup` | [Text inputs](/components/inputs) |
| `Toggle`, `Checkbox` | [Toggle and checkbox](/components/toggle) |
| `Slider` | [Slider](/components/slider) |
| `HGroup`, `VGroup`, `Filler`, `ToolPanel`, `Tab` | [Layout](/components/layout) |
| `Bubble`, `ContextPopup`, `ModalOverlay`, `BaseMenu`, `ContextMenu` | [Overlays and menus](/components/overlays) |
