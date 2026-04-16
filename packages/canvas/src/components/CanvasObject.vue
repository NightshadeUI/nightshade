<template>
    <div
        ref="rootEl"
        class="CanvasObject"
        :style="objectStyle"
        @uiclick.stop.prevent="canvasObject.onUiClick"
        @uidragstart.stop.prevent="canvasObject.onUiDragStart"
        @uidragmove.stop.prevent="canvasObject.onUiDragMove"
        @uidragend.stop.prevent="canvasObject.onUiDragEnd">
        <CanvasObjectResize
            v-for="direction in resizeDirections"
            :key="direction"
            :canvasObject="canvasObject"
            :direction="direction" />
        <slot v-bind="slotProps" />
    </div>
</template>

<script>
import { CanvasObjectController } from '../CanvasObjectController.js';
import CanvasObjectResize from './CanvasObjectResize.vue';

export default {

    components: {
        CanvasObjectResize,
    },

    props: {
        canvas: { type: Object, required: true },
        objectId: { type: String, required: true },
        pos: { type: Object, required: true },
        isSelected: { type: Boolean, default: false },
        selectable: { type: Boolean, default: true },
        movable: { type: Boolean, default: true },
        resizable: { type: String, default: 'none' },
        bounds: { type: Array },
    },

    emits: [
        'update:pos',
        'update:isSelected',
    ],

    data() {
        return {
            canvasObject: null,
        };
    },

    computed: {

        coords() {
            const { x, y, w, h } = this.canvasObject.getRenderPos();
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

        resizeDirections() {
            if (!this.canvas.selection.isSelected(this.objectId)) {
                return [];
            }
            return this.canvasObject.getResizeDirections();
        },

    },

    watch: {

        pos(newPos) {
            this.canvasObject.setPos(newPos);
        },

        isSelected(newSelected) {
            this.canvasObject.setSelected(newSelected);
        },

        selectable(newSelectable) {
            this.canvasObject.setSelectable(newSelectable);
        },

        movable(newMovable) {
            this.canvasObject.setMovable(newMovable);
        },

        resizable(newResizable) {
            this.canvasObject.setResizable(newResizable);
        },

        bounds(newBounds) {
            this.canvasObject.setBounds(newBounds);
        },

    },

    created() {
        this.canvasObject = new CanvasObjectController(this.objectId);
        this.canvas.mesh.connect(this.canvasObject);
        this.canvas.events.objectPosUpdated.on(({ objectId, pos }) => {
            if (objectId === this.objectId) {
                this.$emit('update:pos', pos);
            }
        }, this);
    },

    mounted() {
        const ctl = this.canvasObject;
        this.canvas.objectRegistry.register(ctl);
        ctl.setElement(this.$refs.rootEl);
        ctl.setPos(this.pos);
        ctl.setSelectable(this.selectable);
        ctl.setMovable(this.movable);
        ctl.setResizable(this.resizable);
        ctl.setBounds(this.bounds);
        ctl.setSelected(this.isSelected);
    },

    unmounted() {
        this.canvas.objectRegistry.unregister(this.objectId);
        this.canvasObject.setElement(null);
        this.canvas.selection.removeFromSelection(this.objectId);
        this.canvas.events.objectPosUpdated.removeAll(this);
    },

};
</script>
