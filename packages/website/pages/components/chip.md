---
title: Chip
---

# Chip

<p class="Lead">A compact, selectable label for filters, tags and segmented choices. It sits on the tint of its tone, and takes the tone's fill when active.</p>

<PlaygroundBar />

<Demo :initial="{ active: 'primary', ripe: true }" v-slot="{ state }">
    <Chip
        v-for="tone in ['base', 'primary', 'secondary', 'success', 'danger']"
        :key="tone"
        :tone="tone"
        :label="tone"
        :modelValue="state.active === tone"
        @update:modelValue="state.active = tone" />
    <Chip v-model="state.ripe" label="Ripe" icon="fas fa-seedling" tone="success" />
</Demo>

```html
<Chip v-model="ripe" label="Ripe" icon="fas fa-seedling" tone="success" />
```

`v-model` toggles `modelValue` on click. For a single choice, bind the active state yourself:

```html
<Chip
    v-for="tone in tones"
    :key="tone"
    :label="tone"
    :tone="tone"
    :modelValue="current === tone"
    @update:modelValue="current = tone" />
```

## Props

Chip speaks the [control grammar](/components/): `tone`, `size`, `flat`, `outline`, `round`, `translucent`, `disabled`, `forceHover` and `forceFocus`. On top of it:

| Prop | Type | Effect |
|------|------|--------|
| `label` | string | the text |
| `icon` | string | an icon class, drawn in the text color |
| `modelValue` | boolean | active: the tone's fill instead of its tint |
| `activeTone` | tone name | the tone to switch to when active |
| `tagName` | string | `button` by default |

## Roles it reads

| Variable | Default |
|----------|---------|
| `--Chip-background` | `--tone-tint`, or `--tone-fill` when active |
| `--Chip-text` | `--tone-tint-text`, or `--tone-fill-text` when active |
| `--Chip-icon` | same as the text |
| `--Chip-border` | `--tone-border` with `outline` |
| `--Chip-size`, `--Chip-padding`, `--Chip-gap` | the input size context |
