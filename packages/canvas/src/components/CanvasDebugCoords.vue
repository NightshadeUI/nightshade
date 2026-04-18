<template>
    <VGroup
        class="CanvasDebugCoords"
        gap="s">
        <HGroup class="Row">
            <strong>page</strong>
            <span>{{ format(pagePos) }}</span>
        </HGroup>
        <HGroup class="Row">
            <strong>viewport</strong>
            <span>{{ format(viewportPos) }}</span>
        </HGroup>
        <HGroup class="Row">
            <strong>canvas</strong>
            <span>{{ format(canvasPos) }}</span>
        </HGroup>
        <HGroup class="Row">
            <strong>local</strong>
            <span>{{ format(localPos) }}</span>
        </HGroup>
        <HGroup class="Row">
            <strong>zoom</strong>
            <span>{{ canvas.space.zoom.toFixed(2) }}</span>
        </HGroup>
    </VGroup>
</template>

<script>
export default {

    props: {
        canvas: { type: Object, required: true },
    },

    computed: {

        pagePos() {
            return this.canvas.inputState.lastMousePos;
        },

        viewportPos() {
            return this.canvas.space.pageToViewport(this.pagePos);
        },

        canvasPos() {
            return this.canvas.space.pageToCanvas(this.pagePos);
        },

        localPos() {
            return this.canvas.space.pageToLocal(this.pagePos);
        },

    },

    methods: {
        format(pos) {
            return `(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`;
        },
    },

};
</script>

<style scoped>
.CanvasDebugCoords {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    margin: var(--sp);
    padding: var(--sp);
    pointer-events: none;

    font-family: var(--font-monospace);
    font-size: var(--font-size-s);
    border: var(--input-border-size) solid var(--color-base-200);
    border-radius: var(--border-radius);

    background: var(--color-base-0);
}

.Row {
    white-space: nowrap;
}
</style>
