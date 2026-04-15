---
title: Canvas
description: Canvas viewport and interaction playground
useCustomLayout: true
---

<ClientOnly>
    <div class="CanvasWrapper">
        <CanvasView
            v-if="controller"
            class="CanvasPlayground"
            :controller="controller">
            <div class="ExampleNode">
                Example Node
            </div>
            <template #overlays>
                <DebugCoords :controller="controller" />
            </template>
        </CanvasView>
    </div>
</ClientOnly>

<script>
import { onMounted, shallowRef } from 'vue';
import { CanvasController, CanvasView, DebugCoords } from '@nightshadeui/canvas/src';

export default {

    components: {
        CanvasController,
        CanvasView,
        DebugCoords,
    },

    data() {
        return {
            controller: new CanvasController()
        };
    },

};
</script>

<style scoped>
.CanvasWrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    padding: var(--sp2);
}

.CanvasPlayground {
    --canvas-margin-cells: 64;
    --canvas-grid-cell-size: 32px;
    --canvas-grid-subdivisions: 4;
    --canvas-grid-major-color: var(--color-base-200);
    --canvas-grid-minor-color: var(--color-base-100);

    flex: 1;
    min-width: 0;
    border: 1px solid var(--color-base-200);
    border-radius: var(--border-radius);
    background: var(--color-base-50);
}

.ExampleNode {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(4 * var(--canvas-grid-cell-size));
    height: calc(4 * var(--canvas-grid-cell-size));

    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid var(--color-base-300);
    border-radius: var(--input-radius);
    background: var(--color-base-0);
}
</style>
