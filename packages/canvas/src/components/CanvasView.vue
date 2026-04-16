<template>
    <div class="CanvasView">
        <div
            ref="viewport"
            class="Viewport"
            @mousedown="canvas.pan.onMouseDown"
            @uidragstart="canvas.boxSelect.onUiDragStart"
            @uidragmove="canvas.boxSelect.onUiDragMove"
            @uidragend="canvas.boxSelect.onUiDragEnd"
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
            <CanvasBoxSelect :canvas="canvas" />
        </div>
        <slot name="overlays" />
    </div>
</template>

<script>
import CanvasBoxSelect from './CanvasBoxSelect.vue';

export default {

    components: {
        CanvasBoxSelect,
    },

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
    user-select: none;
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
</style>
