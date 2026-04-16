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
/* TODO extract --canvas-resize-handle-size: var(--sp2), fix styles */
.ResizeHandle {
    position: absolute;
    z-index: 3;
}

.ResizeHandle-n {
    top: calc(-1 * var(--sp));
    left: calc(-1 * var(--sp));
    right: calc(-1 * var(--sp));
    height: var(--sp2);
    cursor: ns-resize;
}

.ResizeHandle-ne {
    top: calc(-1 * var(--sp));
    right: calc(-1 * var(--sp));
    width: var(--sp2);
    height: var(--sp2);
    cursor: nesw-resize;
}

.ResizeHandle-e {
    top: calc(-1 * var(--sp));
    bottom: calc(-1 * var(--sp));
    right: calc(-1 * var(--sp));
    width: var(--sp2);
    cursor: ew-resize;
}

.ResizeHandle-se {
    bottom: calc(-1 * var(--sp));
    right: calc(-1 * var(--sp));
    width: var(--sp2);
    height: var(--sp2);
    cursor: nwse-resize;
}

.ResizeHandle-s {
    bottom: calc(-1 * var(--sp));
    left: calc(-1 * var(--sp));
    right: calc(-1 * var(--sp));
    height: var(--sp2);
    cursor: ns-resize;
}

.ResizeHandle-sw {
    bottom: calc(-1 * var(--sp));
    left: calc(-1 * var(--sp));
    width: var(--sp2);
    height: var(--sp2);
    cursor: nesw-resize;
}

.ResizeHandle-w {
    top: calc(-1 * var(--sp));
    bottom: calc(-1 * var(--sp));
    left: calc(-1 * var(--sp));
    width: var(--sp2);
    cursor: ew-resize;
}

.ResizeHandle-nw {
    top: calc(-1 * var(--sp));
    left: calc(-1 * var(--sp));
    width: var(--sp2);
    height: var(--sp2);
    cursor: nwse-resize;
}
</style>
