<template>
    <div class="CanvasView">
        <div
            ref="viewport"
            class="Viewport"
            @mousedown="canvas.pan.onMouseDown"
            @uiclick="onCanvasUiClick"
            @scroll="canvas.viewport.onScroll"
            @wheel="canvas.zoom.onWheel">
            <div
                class="Sizer"
                :style="canvas.viewport.getSizerStyle()" />
            <div
                class="Canvas"
                :style="canvas.viewport.getCanvasStyle()">
                <slot />
                <div
                    class="Origin"
                    :style="canvas.viewport.getOriginStyle()">
                    <slot name="origin" />
                </div>
            </div>
        </div>
        <div class="Overlays">
            <slot name="overlays" />
        </div>
    </div>
</template>

<script>
export default {

    props: {
        canvas: { type: Object, required: true },
    },

    mounted() {
        this.canvas.mount(this.$refs.viewport);
    },

    unmounted() {
        this.canvas.unmount();
    },

    methods: {

        onCanvasUiClick() {
            this.canvas.selection.deselectAll();
        },

    },

};
</script>

<style scoped>
.CanvasView {
    position: relative;
    display: flex;
}

.Viewport {
    position: relative;
    z-index: 1;
    flex: 1;
    overflow: auto;
    cursor: crosshair;
}

.Sizer {
    position: relative;
    z-index: 0;
}

.Canvas {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
}

.Origin {
    position: absolute;
    transform: translate(-50%, -50%);
}

.Overlays {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    pointer-events: none;
}
</style>
