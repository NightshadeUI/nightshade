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
    --canvas-resize-handle-size: var(--sp2);
    --canvas-resize-handle-offset: calc(-1 * var(--canvas-resize-handle-size) / 2);
    position: absolute;
    z-index: 3;
}

.ResizeHandle-n {
    top: var(--canvas-resize-handle-offset);
    left: var(--canvas-resize-handle-offset);
    right: var(--canvas-resize-handle-offset);
    height: var(--canvas-resize-handle-size);
    cursor: ns-resize;
}

.ResizeHandle-ne {
    top: var(--canvas-resize-handle-offset);
    right: var(--canvas-resize-handle-offset);
    width: var(--canvas-resize-handle-size);
    height: var(--canvas-resize-handle-size);
    cursor: nesw-resize;
}

.ResizeHandle-e {
    top: var(--canvas-resize-handle-offset);
    bottom: var(--canvas-resize-handle-offset);
    right: var(--canvas-resize-handle-offset);
    width: var(--canvas-resize-handle-size);
    cursor: ew-resize;
}

.ResizeHandle-se {
    bottom: var(--canvas-resize-handle-offset);
    right: var(--canvas-resize-handle-offset);
    width: var(--canvas-resize-handle-size);
    height: var(--canvas-resize-handle-size);
    cursor: nwse-resize;
}

.ResizeHandle-s {
    bottom: var(--canvas-resize-handle-offset);
    left: var(--canvas-resize-handle-offset);
    right: var(--canvas-resize-handle-offset);
    height: var(--canvas-resize-handle-size);
    cursor: ns-resize;
}

.ResizeHandle-sw {
    bottom: var(--canvas-resize-handle-offset);
    left: var(--canvas-resize-handle-offset);
    width: var(--canvas-resize-handle-size);
    height: var(--canvas-resize-handle-size);
    cursor: nesw-resize;
}

.ResizeHandle-w {
    top: var(--canvas-resize-handle-offset);
    bottom: var(--canvas-resize-handle-offset);
    left: var(--canvas-resize-handle-offset);
    width: var(--canvas-resize-handle-size);
    cursor: ew-resize;
}

.ResizeHandle-nw {
    top: var(--canvas-resize-handle-offset);
    left: var(--canvas-resize-handle-offset);
    width: var(--canvas-resize-handle-size);
    height: var(--canvas-resize-handle-size);
    cursor: nwse-resize;
}
</style>
