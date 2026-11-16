---
title: Control grammar
---

# Control grammar

<p class="Lead">The standard components are an opt-in: Vue controls that read the styles and nothing else. They share one vocabulary of props: learn it on a button, and you know it on a toggle, a chip, a slider and a text field.</p>

Already have a component library? Skip this package and map that library's variables to the same roles and context. The styles don't care who reads them.

## Install

```bash
npm i @nightshadeui/stylesheets @nightshadeui/components
```

Import the components you use. Each one brings its own CSS, so the app ships only the styles of what it imports:

```ts
import '@nightshadeui/stylesheets';
import { Btn, InputText } from '@nightshadeui/components';

app.component('Btn', Btn);
app.component('InputText', InputText);
```

Or register them all at once:

```ts
import { standardComponents } from '@nightshadeui/components';

for (const [name, component] of Object.entries(standardComponents)) {
    app.component(name, component);
}
```

Component styles sit in the `nightshade-components` layer, after the styles' `nightshade` layer. `@nightshadeui/components/css` still links every component's CSS at once, for apps that load styles apart from scripts. The `nightshade` package bundles the styles and the components.

## The grammar

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
| `outline` | boolean | a border in `--tone-border`, inside the control's padding, so its size doesn't change |
| `round` | boolean | radius of half the control's own height |
| `translucent` | boolean | blends with the background and blurs it |
| `disabled` | boolean | dimmed, and ignores input |
| `forceHover`, `forceFocus`, `forceActive` | boolean | show a state without the pointer, for docs and tests |
| `hoverOverrides`, `focusOverrides`, `activeOverrides` | object | style props that apply only in that state |

Each control takes the props that make sense for it, and none of them means something else anywhere:

| Control | Takes |
|---------|-------|
| `Btn`, `RouterBtn` | all of them |
| `Toggle`, `Slider` | all but `forceActive` and `activeOverrides` |
| `Checkbox` | all but `translucent`, `forceActive` and `activeOverrides` |
| `InputText`, `InputTextarea`, `InputSelect` | all but `translucent`, `forceActive` and `activeOverrides` |
| `Chip` | all but `forceActive` and the state overrides |
| `ToolPanel` | `size`, `flat`, `outline`, `round` |
| `Tab` | `tone`, `size` |

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

That's what the Flat, Round, Outline and Translucent switches do, in the home page hero and in the playground bar: they set the defaults for this whole site. Because the defaults object is reactive, the site re-renders in place.

A few things to know:

- **Explicit props win.** `<Btn :round="false">` stays square, whatever the defaults say. It's a handy way to pin a look that shouldn't follow the app. A bound `undefined` (`:tone="item.tone"`) isn't explicit: the defaults still apply.
- **Defaults cascade like context.** A component that provides its own `$nightshade` overrides them for its subtree. The demos on this site do exactly that, to add the state switches of the playground bar: disabled, hover and focus, and active where a page has buttons, the one control with a pressed state.
- **Any prop can have a default,** not only the looks: `size: 's'` makes a dense app, and `tone` sets a brand tone for every control that doesn't choose one. Prefer a context class for a region, and defaults for the whole app.
- **Every combination holds up.** Flat, round, outline and translucent are independent switches, and the standard components are built to look right in all sixteen. That's what a look-agnostic base buys you.

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
| Named after a CSS property | a full value | `--Btn-background`, `--Btn-box-shadow`, `--Btn-text-shadow`, `--Toggle-border-size`, `--Bubble-filter` |
| Named after a metric | a length | `--Btn-size`, `--Btn-padding`, `--Btn-radius`, `--Slider-knob-size` |

Parts add their name in between: `--Slider-track-background`, `--Toggle-knob-transparency`.

States are shared across controls, in the control settings: `--input-disabled-opacity`, `--input-disabled-filter`, `--input-hover-overlay` (filled controls) and `--input-hover-filter` (wells). Focus rings show on keyboard focus, with `:focus-visible`; text fields show theirs whenever they're focused.

## Inventory

| Component | Page |
|-----------|------|
| `Btn`, `RouterBtn` | [Button](/components/button) |
| `Chip` | [Chip](/components/chip) |
| `InputBase`, `InputText`, `InputTextarea`, `InputSelect`, `InputGroup` | [Text inputs](/components/inputs) |
| `Toggle`, `Checkbox` | [Toggle and checkbox](/components/toggle) |
| `Slider` | [Slider](/components/slider) |
| `HGroup`, `VGroup`, `Filler`, `ToolPanel`, `Tab` | [Layout](/components/layout) |
| `Bubble`, `ContextPopup`, `Tooltip` (and `v-tooltip`), `ModalOverlay`, `BaseMenu`, `ContextMenu` | [Overlays and menus](/components/overlays) |
