# Components

A component reads roles and the size context, exposes its own knobs as `--<Component>-*`, and takes its tone and size from wherever it's placed. Do that, and it snaps into any tone, size and scheme with nothing extra.

## The variable grammar

Every knob is defaulted on the component's root class and read without fallbacks:

| Kind | Named after | Holds | Examples |
|------|-------------|-------|----------|
| Color | a role | a color | `--Btn-fill`, `--Chip-text`, `--Toggle-border`, `--Btn-shadow`, `--InputBase-outline` |
| Value | a CSS property | a full value | `--Btn-background`, `--Btn-box-shadow`, `--Toggle-border-size`, `--Chip-radius`, `--Bubble-filter` |
| Size | a metric | a length | `--Btn-size`, `--Btn-padding`, `--Btn-gap`, `--Btn-font-size` |

The property is the one the value feeds: a shadow drawn with `filter: drop-shadow()` is `--Bubble-filter`, a glyph's `text-shadow` is `--Checkbox-mark-text-shadow`. A color variable always holds a color: to drop a shadow, set its geometry (`--Btn-box-shadow: none`) or the color to `transparent`, never the color to `none`.

Parts go between the component and the name: `--Slider-track-background`, `--Toggle-knob-background`, `--Slider-tooltip-text`. No `-color` suffix (`--Btn-text`, not `--Btn-text-color`) and no `-surface` suffix (`--Bubble-background`). A knob that fades a part over what's behind it is `--<Component>-<part>-transparency`, a percentage.

Color knobs feed value knobs, which keeps geometry in one place:

```css
--Btn-shadow: var(--tone-shadow);
--Btn-box-shadow: 0 1px 1px var(--Btn-shadow), 0 1px 5px var(--shadow-medium);
```

## Writing a component

The order inside a scoped style block is: base, then states, then looks and modifiers.

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
    --Tag-outline: transparent;
    --Tag-radius: var(--radius-m);
    --Tag-shadow: var(--shadow-light);
    --Tag-box-shadow: 0 1px 1px var(--Tag-shadow);

    box-sizing: border-box;
    height: var(--Tag-size);
    padding: 0 var(--Tag-padding);
    border: var(--Tag-border-size) solid var(--Tag-border);
    border-radius: var(--Tag-radius);
    outline: var(--input-outline-size) solid var(--Tag-outline);
    background: var(--Tag-background);
    box-shadow: var(--Tag-box-shadow);
    color: var(--Tag-text);
    font-size: var(--Tag-font-size);
}

/* States */

.Tag:not(:disabled):focus-visible {
    --Tag-outline: var(--tone-focus-outline);
    --Tag-border: var(--tone-focus-border);
}

.Tag-disabled {
    opacity: var(--input-disabled-opacity);
    filter: var(--input-disabled-filter);
}

/* Looks */

.Tag-round {
    --Tag-radius: calc(.5 * var(--Tag-size));
}

.Tag-outline {
    --Tag-border-size: var(--input-border-size);
    --Tag-border: var(--tone-border);
}

.Tag-flat {
    --Tag-box-shadow: none;
}
</style>
```

What makes it snap:

- **Context, not defaults.** `tone` and `size` have no default value, and the class is added only when the prop is set. Without them, the component inherits the region's tone and size.
- **Heights, not padding.** A single-line control has a fixed `height` from `--input-major-height` and is `border-box`, so it lands on the grid. Inner or companion elements use `--input-minor-height` and sit centered beside it. Leave line-height inherited (`--line-height`, `--sp2`). Padding is the padding token: don't subtract the border from it. Content doesn't jump when `outline` stays a look.
- **Looks, not selected.** `outline` is a look. Chosen drops `ghost`; the rest stay ghost. Don't toggle a border as selected, especially in a row or toolbar that would jump.
- **Roles, not ramps, when it's multi-tone.** A control that takes a `tone` reads roles, and the context ramp (`--tone-200`) when none fits, never `--color-*`. A single-tone component may read ramp steps directly. Neither calls `light-dark()`.
- **Shared states.** Disabled uses `--input-disabled-opacity` and `--input-disabled-filter`. Hover on a filled control is an overlay of `--input-hover-overlay`; hover on a well is `filter: var(--input-hover-filter)`. Focus rings use `:focus-visible` (`:focus-within` for text fields) with the focus roles.
- **A round control's radius is half its own height**, never a radius token.

## Naming classes

- The root and sub-elements are PascalCase and short: `Tag`, `Label`, `Icon`, `Track`, `Knob`. Sub-elements aren't prefixed (`Label`, not `Tag-Label`).
- Modifier and state classes are the component plus a camelCased name: `Tag-flat`, `Tag-forceFocus`, `Slider-fill-track`.

## The prop grammar

Controls share one set of props. A new control takes the ones that make sense for it, with the same names and meanings:

| Prop | Effect |
|------|--------|
| `tone` | the tone; inherits the context when omitted |
| `size` | `xs` `s` `m` `l` `xl`; inherits the context when omitted |
| `flat` | no gradient, no raised shadow |
| `outline` | a border in `--tone-border`. A look, not selected |
| `ghost` | no surface; text in `--tone-text`. Unchosen stays ghost; chosen drops it |
| `round` | radius of half the control's height |
| `translucent` | blends with the background (`--translucency-*`) and blurs it |
| `disabled` | dimmed, ignores input |
| `forceHover`, `forceFocus`, `forceActive` | show a state without the pointer, for docs and tests |

`v-model` controls emit `update:modelValue`. Content slots are `before`, default and `after`.

## Using the standard components

`@nightshadeui/components` is an opt-in set of Vue controls on this grammar: `Btn`, `RouterBtn`, `Chip`, `InputText`, `InputTextarea`, `InputSelect`, `InputGroup`, `Toggle`, `Checkbox`, `Slider`, `HGroup`, `VGroup`, `Filler`, `ToolPanel`, `Tab`, `Bubble`, `ContextPopup`, `Tooltip` (with the `v-tooltip` directive), `ContextMenu`, `BaseMenu`, `ModalOverlay`.

Import the ones you use. Each brings its own CSS (in the `nightshade-components` layer), so an app that uses `Btn` and `Toggle` ships only their styles:

```ts
import '@nightshadeui/stylesheets';
import { Btn, Toggle } from '@nightshadeui/components';

app.component('Btn', Btn);
app.component('Toggle', Toggle);
```

Or register all of them: `standardComponents` maps every name to its component.

`RouterBtn` needs `vue-router` in the app. Overlays teleport into an element with `id="overlays"`. Each control's `--<Component>-*` locals are defaulted on its root class from roles; they are how the control is written, not a restyle API.

## App-wide defaults

Every standard component resolves a prop in three steps: the prop passed, then `$nightshade.defaults`, then its own default. Provide the defaults once:

```ts
import { reactive } from 'vue';

app.provide('$nightshade', reactive({
    defaults: {
        flat: true,
        round: true,
    },
}));
```

- Explicit props win: `<Btn :round="false">` stays square.
- A bound `undefined` (`:tone="item.tone"`) counts as unset, so the defaults still apply.
- A subtree can provide its own `$nightshade` to override the defaults below it.
- Prefer a context class (`.tone-*`, `.input-size-*`) for a region, and defaults for the whole app.

## Another component library

Skip `@nightshadeui/components` and map the library's own variables to the roles and context, once, at `:root` (or on its root class). The library then follows tones, sizes and schemes like everything else.
