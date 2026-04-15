<template>
    <VGroup
        class="DebugCoords"
        gap="s">
        <HGroup class="Row">
            <strong>page</strong>
            <span>{{ format(page) }}</span>
        </HGroup>
        <HGroup class="Row">
            <strong>viewport</strong>
            <span>{{ format(viewport) }}</span>
        </HGroup>
        <HGroup class="Row">
            <strong>canvas</strong>
            <span>{{ format(canvas) }}</span>
        </HGroup>
        <HGroup class="Row">
            <strong>local</strong>
            <span>{{ format(local) }}</span>
        </HGroup>
        <HGroup class="Row">
            <strong>zoom</strong>
            <span>{{ controller.space.zoom.toFixed(2) }}</span>
        </HGroup>
    </VGroup>
</template>

<script>
export default {
    props: {
        controller: { type: Object, required: true },
    },

    computed: {

        page() {
            return this.controller.inputState.lastMousePos;
        },

        viewport() {
            return this.controller.space.pageToViewport(this.page);
        },

        canvas() {
            return this.controller.space.pageToCanvas(this.page);
        },

        local() {
            return this.controller.space.pageToLocal(this.page);
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
.DebugCoords {
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
