<template>
    <div
        :class="['ResizeHandle', `ResizeHandle-${direction}`]"
        @uidragstart.stop.prevent="canvasObject.startResizing(direction)"
        @uidragmove.stop.prevent="canvasObject.onResizeMove"
        @uidragend.stop.prevent="canvasObject.onResizeEnd" />
</template>

<script>
export default {

    props: {
        canvasObject: { type: Object, required: true },
        direction: { type: String, required: true },
    },

};
</script>

<style scoped>
.ResizeHandle {
    --CanvasObjectResize-handle-size: var(--sp2);
    --CanvasObjectResize-handle-offset: calc(-.5 * var(--CanvasObjectResize-handle-size));
    position: absolute;
    z-index: 3;
}

.ResizeHandle-n {
    top: var(--CanvasObjectResize-handle-offset);
    left: var(--CanvasObjectResize-handle-offset);
    right: var(--CanvasObjectResize-handle-offset);
    height: var(--CanvasObjectResize-handle-size);
    cursor: ns-resize;
}

.ResizeHandle-ne {
    top: var(--CanvasObjectResize-handle-offset);
    right: var(--CanvasObjectResize-handle-offset);
    width: var(--CanvasObjectResize-handle-size);
    height: var(--CanvasObjectResize-handle-size);
    cursor: nesw-resize;
    z-index: 4;
}

.ResizeHandle-e {
    top: var(--CanvasObjectResize-handle-offset);
    bottom: var(--CanvasObjectResize-handle-offset);
    right: var(--CanvasObjectResize-handle-offset);
    width: var(--CanvasObjectResize-handle-size);
    cursor: ew-resize;
}

.ResizeHandle-se {
    bottom: var(--CanvasObjectResize-handle-offset);
    right: var(--CanvasObjectResize-handle-offset);
    width: var(--CanvasObjectResize-handle-size);
    height: var(--CanvasObjectResize-handle-size);
    cursor: nwse-resize;
    z-index: 4;
}

.ResizeHandle-s {
    bottom: var(--CanvasObjectResize-handle-offset);
    left: var(--CanvasObjectResize-handle-offset);
    right: var(--CanvasObjectResize-handle-offset);
    height: var(--CanvasObjectResize-handle-size);
    cursor: ns-resize;
}

.ResizeHandle-sw {
    bottom: var(--CanvasObjectResize-handle-offset);
    left: var(--CanvasObjectResize-handle-offset);
    width: var(--CanvasObjectResize-handle-size);
    height: var(--CanvasObjectResize-handle-size);
    cursor: nesw-resize;
    z-index: 4;
}

.ResizeHandle-w {
    top: var(--CanvasObjectResize-handle-offset);
    bottom: var(--CanvasObjectResize-handle-offset);
    left: var(--CanvasObjectResize-handle-offset);
    width: var(--CanvasObjectResize-handle-size);
    cursor: ew-resize;
}

.ResizeHandle-nw {
    top: var(--CanvasObjectResize-handle-offset);
    left: var(--CanvasObjectResize-handle-offset);
    width: var(--CanvasObjectResize-handle-size);
    height: var(--CanvasObjectResize-handle-size);
    cursor: nwse-resize;
    z-index: 4;
}
</style>
