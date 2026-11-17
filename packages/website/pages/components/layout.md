---
title: Layout
---

# Layout

<p class="Lead">Flex groups with gaps on the spacing scale, a filler, a panel to hold controls, and the tab shape that labels can use.</p>

## HGroup and VGroup

Rows and columns. `gap` names a step of the [spacing scale](/styles/sizing#spacing-scale): `0`, `0-5`, `1`, `2-5`, `12`… `align` and `justify` take the usual flex values; `HGroup` also takes `wrap`.

<Demo column>
    <HGroup gap="1">
        <Btn label="One" />
        <Btn label="Two" />
        <Btn label="Three" />
    </HGroup>
    <HGroup gap="3" justify="space-between">
        <Btn label="Start" />
        <Btn label="End" tone="primary" />
    </HGroup>
</Demo>

```html
<HGroup gap="1" justify="space-between">
    <Btn label="Cancel" />
    <Btn label="Save" tone="primary" />
</HGroup>
```

`HGroup` defaults to `gap="1"` and centered items; `VGroup` to `gap="2"` and stretched items. The gap prop sets `--HGroup-gap` / `--VGroup-gap` on the root, from the spacing scale.

## Filler

Takes the remaining space in a group. `fill` draws a `dotted`, `dashed` or `solid` leader in the `--border-base` role.

<Demo column>
    <HGroup>
        <span>Spacing</span>
        <Filler fill="dotted" />
        <code>--sp</code>
    </HGroup>
    <HGroup>
        <span>Radius</span>
        <Filler fill="dotted" />
        <code>--radius-m</code>
    </HGroup>
</Demo>

## ToolPanel

A deep strip for a row of controls. It takes `size`, `flat`, `outline` and `round` like any control.

<Demo :initial="{ grid: true, zoom: 100 }" v-slot="{ state }">
    <ToolPanel>
        <Btn icon="fas fa-arrow-pointer" size="s" square flat tone="primary" />
        <Btn icon="fas fa-pen" size="s" square flat ghost />
        <Btn icon="fas fa-shapes" size="s" square flat ghost />
        <Toggle v-model="state.grid" size="s" />
        <Slider v-model="state.zoom" :min="25" :max="400" size="s" style="width: 120px" />
    </ToolPanel>
    <ToolPanel round>
        <Btn icon="fas fa-bold" size="s" square flat ghost round />
        <Btn icon="fas fa-italic" size="s" square flat ghost round />
        <Btn icon="fas fa-link" size="s" square flat ghost round />
    </ToolPanel>
</Demo>

Its height is the major height of its size, so the controls inside take the size below it:

<Demo dual stacked column :initial="{ mode: 'move' }" v-slot="{ state }">
    <ToolPanel v-for="[panel, inner] in [['s', 'xs'], ['m', 's'], ['l', 'm'], ['xl', 'l']]" :key="panel" :size="panel">
        <InputGroup>
            <Btn v-for="mode in ['move', 'draw', 'erase']" :key="mode" :label="mode" :size="inner" :ghost="state.mode !== mode" :tone="state.mode === mode ? 'primary' : undefined" @click="state.mode = mode" />
        </InputGroup>
        <Filler />
        <InputText v-model="state.mode" :size="inner" style="width: 96px" />
    </ToolPanel>
</Demo>

## Tab

A tab shape with curved caps, in any of four directions. `InputBase` uses it for `labelStyle="tab"`.

<Demo>
    <Tab label="Top" tone="primary" />
    <Tab label="Bottom" dir="bottom" tone="secondary" />
    <Tab label="Left" dir="left" tone="tertiary" />
    <Tab label="Right" dir="right" />
</Demo>
