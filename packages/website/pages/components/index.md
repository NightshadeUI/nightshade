---
title: Control grammar
---

# Control grammar

<p class="Lead">How to write a reusable control: it reads roles and the size context, takes a shared set of props, and defaults its own <code>--&lt;Component&gt;-*</code> on its root class. Do that, and it works in any tone, size and scheme.</p>

The standard components are an opt-in that already follows this. Already have a library? Skip the package and map that library's variables to the same roles and context. The styles don't care who reads them.

## The prop grammar

Every control you write takes the props that make sense for it, with the same names and meanings. `tone` and `size` have no default: omit them, and the control inherits the region's context.

<PlaygroundBar active />

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
| `outline` | boolean | a border in `--tone-border`. A look, not selected |
| `ghost` | boolean | no surface; text in `--tone-text`. Unchosen stays ghost; chosen drops it |
| `round` | boolean | radius of half the control's own height |
| `translucent` | boolean | blends with the background and blurs it |
| `disabled` | boolean | dimmed, and ignores input |
| `forceHover`, `forceFocus`, `forceActive` | boolean | show a state without the pointer, for docs and tests |
| `hoverOverrides`, `focusOverrides`, `activeOverrides` | object | style props that apply only in that state |

No prop means something else on another control. `v-model` controls emit `update:modelValue`. Content slots are `before`, default and `after`.

The standard set, as examples:

| Control | Takes |
|---------|-------|
| `Btn`, `RouterBtn` | all of them |
| `Toggle`, `Slider` | all but `forceActive` and `activeOverrides` |
| `Checkbox` | all but `translucent`, `forceActive` and `activeOverrides` |
| `InputText`, `InputTextarea`, `InputSelect` | all but `translucent`, `forceActive` and `activeOverrides` |
| `Chip` | all but `forceActive` and the state overrides |
| `ToolPanel` | `size`, `flat`, `outline`, `round` |
| `Tab` | `tone`, `size` |

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

## The variable grammar

Default each local on the component's root class, from roles and the size context, and read it with no fallback.

| Kind | Named after | Holds | Examples |
|------|-------------|-------|----------|
| Color | a role | a color | `--Btn-fill`, `--Chip-text`, `--Toggle-border`, `--Btn-shadow` |
| Value | a CSS property | a full value | `--Btn-background`, `--Btn-box-shadow`, `--Toggle-border-size` |
| Size | a metric | a length | `--Btn-size`, `--Btn-padding`, `--Slider-knob-size` |

Parts go in between: `--Slider-track-background`, `--Toggle-knob-transparency`. No `-color` and no `-surface` suffixes.

Color knobs feed value knobs, so geometry lives in one place:

```css
--Btn-shadow: var(--tone-shadow);
--Btn-box-shadow: 0 1px 1px var(--Btn-shadow), 0 1px 5px var(--shadow-medium);
```

These locals are the control's own. They are not tokens, and they are not a restyle API for someone else's class.

## Writing a control

Context classes only when the prop is set. Heights from the size context. Roles, not ramps, when the control takes any tone.

```vue
<template>
    <button
        class="Tag"
        :class="[
            tone && `tone-${tone}`,
            size && `input-size-${size}`,
            {
                'Tag-round': round,
                'Tag-outline': outline,
                'Tag-flat': flat,
                'Tag-disabled': disabled,
            },
        ]"
        :disabled="disabled">
        <span class="Label">{{ label }}</span>
    </button>
</template>

<script>
export default {

    props: {
        label: { type: String },
        tone: { type: String },
        size: { type: String },
        round: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        flat: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
    },

};
</script>

<style scoped>
.Tag {
    --Tag-size: var(--input-major-height);
    --Tag-padding: var(--input-major-padding);
    --Tag-font-size: var(--input-font-size);
    --Tag-background: var(--tone-tint);
    --Tag-text: var(--tone-tint-text);
    --Tag-border-size: 0px;
    --Tag-border: transparent;
    --Tag-radius: var(--radius-m);

    box-sizing: border-box;
    height: var(--Tag-size);
    padding: 0 var(--Tag-padding);
    border: var(--Tag-border-size) solid var(--Tag-border);
    border-radius: var(--Tag-radius);
    background: var(--Tag-background);
    color: var(--Tag-text);
    font-size: var(--Tag-font-size);
}

.Tag:not(:disabled):focus-visible {
    outline: var(--input-outline-size) solid var(--tone-focus-outline);
}

.Tag-disabled {
    opacity: var(--input-disabled-opacity);
    filter: var(--input-disabled-filter);
}

.Tag-round {
    --Tag-radius: calc(.5 * var(--Tag-size));
}

.Tag-outline {
    --Tag-border-size: var(--input-border-size);
    --Tag-border: var(--tone-border);
}
</style>
```

What makes it snap:

- **Context, not defaults.** `tone` and `size` have no default. Add the class only when the prop is set, so the control inherits the region.
- **Heights, not padding.** A single-line control has a fixed `height` from `--input-major-height` and is `border-box`. Companions take `--input-minor-height`. Leave line-height inherited. Padding is the padding token: don't subtract the border from it. Content doesn't jump when `outline` stays a look.
- **Looks, not selected.** `outline` is a look. Chosen drops `ghost`; the rest stay ghost. Don't toggle a border as selected, especially in a row that would jump.
- **Roles, not ramps,** when it's multi-tone. A control that takes `tone` reads roles, and `--tone-200` when none fits, never `--color-*`. A single-tone component may read ramp steps. Neither calls `light-dark()`.
- **Shared states.** Disabled uses `--input-disabled-opacity` and `--input-disabled-filter`. Hover on a filled control is `--input-hover-overlay`; hover on a well is `--input-hover-filter`. Focus uses `:focus-visible` (`:focus-within` for text fields).
- **A round control's radius is half its own height,** never a radius token.

Root and parts are PascalCase and short (`Tag`, `Label`). Modifiers are the component plus camelCase (`Tag-flat`, `Tag-forceFocus`).

## Context, not configuration

Leave `tone` and `size` out and a control takes them from its surroundings. One class changes a whole group:

```html
<div class="tone-danger input-size-s">
    <InputText label="Name" />
    <Btn label="Remove" />
</div>
```

## App-wide defaults

Every prop resolves in three steps: the prop you pass, then `$nightshade.defaults`, then the component's own default. Provide the defaults once, and every control that doesn't set a prop takes them:

```ts
import { reactive } from 'vue';

app.provide('$nightshade', reactive({
    defaults: {
        round: true,
        flat: true,
    },
}));
```

That's what the Flat, Round, Outline and Translucent switches do, in the home page hero and in the playground bar: they set the defaults for this whole site. Because the defaults object is reactive, the site re-renders in place.

- **Explicit props win.** `<Btn :round="false">` stays square. A bound `undefined` (`:tone="item.tone"`) isn't explicit: the defaults still apply.
- **Defaults cascade like context.** A component that provides its own `$nightshade` overrides them for its subtree.
- **Prefer a context class for a region,** and defaults for the whole app.

## Combinations

Controls are built to sit together: one height per size, one grid, one set of switches. Flip the playground bar above and watch them change in step, in both schemes.

<Demo dual column :initial="{ name: 'Ada', comment: '', notify: true, plan: 'team', seats: 12 }" v-slot="{ state }">
    <HGroup align="end">
        <InputText v-model="state.name" label="Your name" labelStyle="text" class="flex-1" />
        <Btn label="Save" tone="primary" />
    </HGroup>
    <InputTextarea v-model="state.comment" label="Comment" labelStyle="tab" tone="secondary" placeholder="Say something nice" />
    <HGroup justify="space-between" wrap>
        <InputGroup>
            <Btn v-for="plan in ['solo', 'team', 'org']" :key="plan" :label="plan" :tone="state.plan === plan ? 'primary' : undefined" @click="state.plan = plan" />
        </InputGroup>
        <HGroup tagName="label">
            <Toggle v-model="state.notify" tone="primary" />
            Notify me
        </HGroup>
    </HGroup>
    <ToolPanel>
        <Chip :label="`${state.seats} seats`" tone="secondary" icon="fas fa-user" size="s" />
        <Slider v-model="state.seats" :min="1" :max="50" size="s" tone="secondary" class="flex-1" />
        <Btn icon="fas fa-check" size="s" tone="success" square />
    </ToolPanel>
</Demo>

## The standard components

An opt-in Vue set on this grammar. Import the ones you use. Each brings its own CSS, in the `nightshade-components` layer:

```bash
npm i @nightshadeui/stylesheets @nightshadeui/components
```

```ts
import '@nightshadeui/stylesheets';
import { Btn, InputText } from '@nightshadeui/components';

app.component('Btn', Btn);
app.component('InputText', InputText);
```

Or register them all: `standardComponents`. `@nightshadeui/components/css` still links every component's CSS at once. The `nightshade` package bundles the styles and the components.

| Component | Page |
|-----------|------|
| `Btn`, `RouterBtn` | [Button](/components/button) |
| `Chip` | [Chip](/components/chip) |
| `InputBase`, `InputText`, `InputTextarea`, `InputSelect`, `InputGroup` | [Text inputs](/components/inputs) |
| `Toggle`, `Checkbox` | [Toggle and checkbox](/components/toggle) |
| `Slider` | [Slider](/components/slider) |
| `HGroup`, `VGroup`, `Filler`, `ToolPanel`, `Tab` | [Layout](/components/layout) |
| `Bubble`, `ContextPopup`, `Tooltip` (and `v-tooltip`), `ModalOverlay`, `BaseMenu`, `ContextMenu` | [Overlays and menus](/components/overlays) |
