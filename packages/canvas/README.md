# @nightshadeui/canvas

An infinite canvas for Vue 3: pan, zoom, a dotted grid, and objects you can select, move and resize, snapped to the grid.

```bash
npm i @nightshadeui/canvas
```

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

`CanvasController` holds the viewport, selection, zoom and pan; positions are in grid cells. Its look is a set of `--CanvasView-*` variables, defaulted from Nightshade's roles.
