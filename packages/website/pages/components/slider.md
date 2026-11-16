---
title: Slider
---

# Slider

<p class="Lead">A track in a well, a knob on top, and an optional tooltip you can click to type an exact value.</p>

<PlaygroundBar />

## Basics

<Demo column :initial="{ value: 40 }" v-slot="{ state }">
    <Slider v-model="state.value" tone="primary" />
    <Slider v-model="state.value" tone="secondary" round />
</Demo>

```html
<Slider v-model="value" :min="0" :max="100" :step="1" tone="primary" />
```

Arrow keys step by `step`; <kbd>Home</kbd> and <kbd>End</kbd> jump to the ends.

## Tooltip

`tooltip` is `off`, `visible` or `dynamic` (on hover, drag, focus and change). Click the tooltip to type a value; <kbd>Enter</kbd> commits, <kbd>Esc</kbd> cancels.

<Demo column :initial="{ value: 0.62 }" v-slot="{ state }">
    <Slider v-model="state.value" :min="0" :max="1" :step="0.01" tone="primary" tooltip="visible" :formatTooltip="value => value.toFixed(2)" />
</Demo>

## Scale and snapping

`scale` draws ticks; `snapThreshold` pulls the value onto the nearest tick within that distance.

<Demo column :initial="{ value: 50 }" v-slot="{ state }">
    <Slider v-model="state.value" tone="primary" :scale="[0, 25, 50, 75, 100]" :snapThreshold="4" tooltip="dynamic" />
</Demo>

## Fill styles

`fillStyle` is `track` (the default), `inset` or `none`:

<Demo column :initial="{ value: 60 }" v-slot="{ state }">
    <Slider v-model="state.value" tone="primary" fillStyle="track" />
    <Slider v-model="state.value" tone="primary" fillStyle="inset" />
    <Slider v-model="state.value" tone="primary" fillStyle="none" />
</Demo>

## Every tone and size

Every tone your styles define, at every size, in both schemes. The playground bar above switches the looks and the states of all of them at once.

<Demo dual stacked>
<ToneMatrix v-slot="{ tone, size }">
    <Slider :tone="tone" :size="size" :modelValue="60" style="width: 96px" />
</ToneMatrix>
</Demo>

## Variables

| Variable | Default |
|----------|---------|
| `--Slider-knob-size` | `--input-minor-height` |
| `--Slider-track-height` | `--input-minor-height` minus one grid unit |
| `--Slider-track-background` | `--surface-deep` |
| `--Slider-fill-background` | `--tone-fill` |
| `--Slider-knob-background` | `--surface-knob` |

The track surface can be any background, which is how the hue sliders on this site get their rainbow.
