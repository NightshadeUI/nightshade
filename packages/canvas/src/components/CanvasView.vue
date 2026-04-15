<template>
    <div class="CanvasView">
        <div
            ref="viewport"
            class="Viewport"
            @mousedown="controller.pan.onMouseDown"
            @scroll="controller.viewport.onScroll"
            @wheel="controller.zoom.onWheel">
            <div
                class="Sizer"
                :style="controller.viewport.getSizerStyle()" />
            <div
                class="Canvas"
                :style="controller.viewport.getCanvasStyle()">
                <div
                    class="Origin"
                    :style="controller.viewport.getOriginStyle()">
                    <slot />
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
        controller: { type: Object, required: true },
    },

    mounted() {
        this.controller.mount(this.$refs.viewport);
    },

    unmounted() {
        this.controller.unmount();
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
