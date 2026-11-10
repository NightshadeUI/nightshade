---
title: Chip
---

# Chip

<p class="Lead">A compact label on the tint of its tone, for tags, filters and segmented choices. Like <code>Btn</code>, it holds no selection state: you decide what a chosen chip looks like, and what choosing means.</p>

<PlaygroundBar />

<Demo :initial="{ tone: 'primary', ripe: true }" v-slot="{ state }">
    <Chip
        v-for="tone in ['base', 'primary', 'secondary', 'success', 'danger']"
        :key="tone"
        :tone="tone"
        :label="tone"
        :outline="state.tone === tone"
        @click="state.tone = tone" />
    <Chip
        label="Ripe"
        icon="fas fa-seedling"
        :tone="state.ripe ? 'success' : undefined"
        @click="state.ripe = !state.ripe" />
</Demo>

A chip is a button with a smaller voice. Mark the chosen one with any prop, a tone or an outline, and handle `click` yourself. One choice, many, or none at all (tags, navigation) are the same component:

```html
<Chip
    label="Ripe"
    icon="fas fa-seedling"
    :tone="ripe ? 'success' : undefined"
    @click="ripe = !ripe" />

<Chip
    v-for="tone in tones"
    :key="tone"
    :label="tone"
    :tone="tone"
    :outline="current === tone"
    @click="current = tone" />
```

## Props

Chip speaks the [control grammar](/components/): `tone`, `size`, `flat`, `outline`, `round`, `translucent`, `disabled`, `forceHover` and `forceFocus`. On top of it:

| Prop | Type | Effect |
|------|------|--------|
| `label` | string | the text |
| `icon` | string | an icon class, drawn in the text color |
| `tagName` | string | `button` by default |

## Roles it reads

| Variable | Default |
|----------|---------|
| `--Chip-background` | `--tone-tint` |
| `--Chip-text` | `--tone-tint-text` |
| `--Chip-icon` | same as the text |
| `--Chip-border` | `--tone-border` with `outline` |
| `--Chip-size`, `--Chip-padding`, `--Chip-gap` | the input size context |
