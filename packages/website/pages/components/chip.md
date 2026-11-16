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
        :icon="state.tone === tone ? 'fas fa-check' : undefined"
        @click="state.tone = tone" />
    <Chip
        label="Ripe"
        icon="fas fa-seedling"
        :tone="state.ripe ? 'success' : undefined"
        @click="state.ripe = !state.ripe" />
</Demo>

A chip is a button with a smaller voice. Mark the chosen one any way you like (a tone, an icon, an outline) and handle `click` yourself. The demo uses a check, so the playground's switches still apply to every chip. One choice, many, or none at all (tags, navigation) are the same component:

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
    :icon="current === tone ? 'fas fa-check' : undefined"
    @click="current = tone" />
```

## Every tone and size

Every tone your styles define, at every size, in both schemes. The playground bar above switches the looks and the states of all of them at once.

<Demo dual stacked>
<ToneMatrix v-slot="{ tone, size }">
    <Chip :tone="tone" :size="size" label="Chip" icon="fas fa-tag" />
</ToneMatrix>
</Demo>

## Props

Chip speaks the [control grammar](/components/): `tone`, `size`, `flat`, `outline`, `round`, `translucent`, `disabled`, `forceHover` and `forceFocus`. On top of it:

| Prop | Type | Effect |
|------|------|--------|
| `label` | string | the text |
| `icon` | string | an icon class, drawn in the text color |
| `tagName` | string | `button` by default |

## Variables

| Variable | Default |
|----------|---------|
| `--Chip-background` | `--tone-tint` |
| `--Chip-text` | `--tone-tint-text` |
| `--Chip-icon` | same as the text |
| `--Chip-border` | `--tone-border` with `outline` |
| `--Chip-size`, `--Chip-padding`, `--Chip-gap` | the input size context |
