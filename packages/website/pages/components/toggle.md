---
title: Toggle and checkbox
---

# Toggle and checkbox

<p class="Lead">Two binary controls that sit in a well. Both take the <em>minor</em> height of their size, so they line up with the field next to them.</p>

<PlaygroundBar />

## Toggle

<Demo :initial="{ a: true, b: false, c: true }" v-slot="{ state }">
    <Toggle v-model="state.a" tone="primary" />
    <Toggle v-model="state.b" tone="secondary" />
    <Toggle v-model="state.c" tone="success" round />
</Demo>

```html
<Toggle v-model="enabled" tone="primary" />
```

`activeTone` switches the tone when the toggle is on. Off, it's a neutral well; on, it fills with the tone:

<Demo :initial="{ on: false }" v-slot="{ state }">
    <Toggle v-model="state.on" activeTone="success" round />
    <span class="ToggleLabel">{{ state.on ? 'Online' : 'Offline' }}</span>
</Demo>

<style>
.ToggleLabel {
    font-size: var(--font-size-s);
    color: var(--text-subtle);
}
</style>

## Checkbox

`mark` picks the glyph: `check`, `xmark`, `dot` or `knob`.

<Demo :initial="{ check: true, xmark: true, dot: true, knob: true }" v-slot="{ state }">
    <Checkbox v-model="state.check" tone="primary" />
    <Checkbox v-model="state.xmark" mark="xmark" tone="danger" />
    <Checkbox v-model="state.dot" mark="dot" tone="secondary" round />
    <Checkbox v-model="state.knob" mark="knob" tone="tertiary" />
</Demo>

The `active` and `inactive` slots replace the mark entirely:

<Demo :initial="{ starred: true, pinned: false }" v-slot="{ state }">
    <Checkbox v-model="state.starred" tone="warning" round>
        <template #active><i class="fas fa-star CheckboxIcon" /></template>
        <template #inactive><i class="far fa-star CheckboxIcon" /></template>
    </Checkbox>
    <Checkbox v-model="state.pinned" tone="secondary">
        <template #active><i class="fas fa-thumbtack CheckboxIcon" /></template>
    </Checkbox>
</Demo>

<style>
.CheckboxIcon {
    font-size: .55em;
}
</style>

## Sizes

<Demo :initial="{ on: true }" v-slot="{ state }">
    <Toggle v-for="size in ['xs', 's', 'm', 'l', 'xl']" :key="size" v-model="state.on" :size="size" tone="primary" />
    <Checkbox v-for="size in ['xs', 's', 'm', 'l', 'xl']" :key="size" v-model="state.on" :size="size" tone="primary" />
</Demo>

## Every tone and size

Every tone your styles define, at every size, in both schemes. The playground bar above switches the looks and the states of all of them at once.

<Demo dual stacked>
<ToneMatrix v-slot="{ tone, size }">
    <HGroup>
        <Toggle :tone="tone" :size="size" :modelValue="true" />
        <Checkbox :tone="tone" :size="size" :modelValue="true" />
    </HGroup>
</ToneMatrix>
</Demo>

## Variables

| Variable | Default |
|----------|---------|
| `--Toggle-size`, `--Checkbox-size` | `--input-minor-height` |
| `--Toggle-background`, `--Checkbox-background` | `--surface-deep`, then `--tone-fill` when on |
| `--Toggle-knob-background` | `--surface-raised`, then `--tone-fill-text` when on |
| `--Toggle-width` | 1.618 × the height |
