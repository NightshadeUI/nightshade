<template>
    <div
        ref="rootEl"
        class="CanvasObject"
        :style="objectStyle"
        @uiclick.stop.prevent="onUiClick">
        <slot v-bind="slotProps" />
    </div>
</template>

<script>
import { CanvasObjectController } from '../CanvasObjectController.js';

export default {

    props: {
        canvas: { type: Object, required: true },
        objectId: { type: String, required: true },
        pos: { type: Object, required: true },
        isSelected: { type: Boolean, default: false },
        selectable: { type: Boolean, default: true },
    },

    data() {
        return {
            objectController: null,
        };
    },

    computed: {

        coords() {
            const { x, y, w, h } = this.pos;
            const { cellSize } = this.canvas.space;
            return {
                x: x * cellSize,
                y: y * cellSize,
                w: w === undefined ? undefined : w * cellSize,
                h: h === undefined ? undefined : h * cellSize,
            };
        },

        objectStyle() {
            return {
                position: 'absolute',
                left: `${this.coords.x}px`,
                top: `${this.coords.y}px`,
                minWidth: this.coords.w === undefined ? undefined : `${this.coords.w}px`,
                minHeight: this.coords.h === undefined ? undefined : `${this.coords.h}px`,
            };
        },

        slotProps() {
            const selected = this.canvas.selection.isSelected(this.objectId);
            return {
                canvas: this.canvas,
                objectId: this.objectId,
                isSelected: selected,
                coords: this.coords,
                pos: this.pos,
            };
        },

    },

    watch: {

        isSelected(nextSelected) {
            this.objectController.setSelected(nextSelected);
        },

        selectable(nextSelectable) {
            this.objectController.setSelectable(nextSelectable);
        },

    },

    created() {
        this.objectController = new CanvasObjectController(this.objectId);
        this.canvas.mesh.connect(this.objectController);
    },

    mounted() {
        this.objectController.setElement(this.$refs.rootEl);
        this.objectController.setSelectable(this.selectable);
        this.canvas.objectRegistry.register(this.objectController);
        this.objectController.setSelected(this.isSelected);
    },

    unmounted() {
        this.canvas.objectRegistry.unregister(this.objectId);
        this.objectController.setElement(null);
        this.canvas.selection.removeFromSelection(this.objectId);
    },

    methods: {

        onUiClick(ev) {
            this.objectController.handleUiClick(ev);
        },

    },

};
</script>
