---
title: Canvas
---

# Canvas

<p class="Lead">An infinite canvas: pan, zoom, a dotted grid, and objects you can select, move and resize, snapped to the grid.</p>

```bash
npm i @nightshadeui/canvas
```

<ClientOnly>
    <CanvasPlayground />
</ClientOnly>

## Usage

```html
<CanvasView :canvas="canvas">
    <CanvasObject
        v-model:pos="node.pos"
        objectId="node"
        :canvas="canvas"
        resizable="both"
        snapToGrid>
        …
    </CanvasObject>
</CanvasView>
```

```ts
import { CanvasController } from '@nightshadeui/canvas';

const canvas = new CanvasController();
```

`CanvasController` holds the viewport, selection, zoom and pan. Positions are in grid cells, not pixels.

## Variables

Set them on a class of yours on the `CanvasView`, like any component knob. The controller reads the grid ones from the viewport, with the same defaults, so they work without the component too.

| Variable | Default |
|----------|---------|
| `--CanvasView-background` | `--surface-base` |
| `--CanvasView-margin-cells` | `64`, the empty cells around the origin |
| `--CanvasView-grid-cell-size` | `32px` |
| `--CanvasView-grid-subdivisions` | `4` |
| `--CanvasView-grid-major-fill`, `--CanvasView-grid-minor-fill` | `--border-deep`, `--border-base`: the grid dots |
| `--CanvasView-grid-major-radius`, `--CanvasView-grid-minor-radius` | `2px`, `1px` |
| `--CanvasBoxSelect-fill`, `--CanvasBoxSelect-opacity` | `--tone-fill` in `primary`, `0.1` |
