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

| Variable | Default |
|----------|---------|
| `--canvas-background` | `--surface-base` |
| `--canvas-grid-cell-size` | `32px` |
| `--canvas-grid-subdivisions` | `4` |
| `--canvas-grid-major-color`, `--canvas-grid-minor-color` | grid dot colors |
| `--canvas-box-select-color` | `--color-primary-500` |
