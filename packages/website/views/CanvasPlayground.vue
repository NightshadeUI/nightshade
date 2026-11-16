<template>
    <CanvasView
        class="CanvasPlayground"
        :canvas="canvas">

        <template #origin>
            <div class="OriginPoint" />
        </template>

        <template #overlays>
            <CanvasDebugCoords :canvas="canvas" />
            <div class="OverlayControls">
                <HGroup tagName="label">
                    <Toggle
                        v-model="canvas.config.allowMultiSelect"
                        size="s"
                        tone="primary"
                        round />
                    Allow multi select
                </HGroup>
            </div>
        </template>

        <CanvasObject
            v-model:pos="testNode.pos"
            v-model:isSelected="testNode.isSelected"
            objectId="test-node"
            :canvas="canvas"
            :selectable="testNode.selectable"
            :movable="testNode.movable"
            :snapToGrid="testNode.snapToGrid"
            :resizable="testNode.resizable"
            :bounds="testNode.bounds">

            <VGroup
                class="TestNode tone-primary"
                :class="{ 'TestNode-selected': testNode.isSelected }">
                <HGroup gap="1" align="stretch">
                    <InputText
                        v-model="testNode.pos.x"
                        class="ControlInput"
                        size="s"
                        label="x"
                        type="number" />
                    <InputText
                        v-model="testNode.pos.y"
                        class="ControlInput"
                        size="s"
                        label="y"
                        type="number" />
                    <InputText
                        v-model="testNode.pos.w"
                        class="ControlInput"
                        size="s"
                        label="w"
                        type="number"
                        :min="1" />
                    <InputText
                        v-model="testNode.pos.h"
                        class="ControlInput"
                        size="s"
                        label="h"
                        type="number"
                        :min="1" />
                </HGroup>

                <HGroup>
                    <InputText
                        v-model="testNode.bounds[0].x"
                        class="ControlInput"
                        size="s"
                        label="minW"
                        type="number"
                        :min="1" />
                    <InputText
                        v-model="testNode.bounds[0].y"
                        class="ControlInput"
                        size="s"
                        label="minH"
                        type="number"
                        :min="1" />
                    <InputText
                        v-model="testNode.bounds[1].x"
                        class="ControlInput"
                        size="s"
                        label="maxW"
                        type="number"
                        :min="1" />
                    <InputText
                        v-model="testNode.bounds[1].y"
                        class="ControlInput"
                        size="s"
                        label="maxH"
                        type="number"
                        :min="1" />
                </HGroup>

                <InputGroup>
                    <Btn
                        label="H"
                        size="s"
                        :tone="testNode.resizable === 'horizontal' ? 'primary' : undefined"
                        flat
                        outline
                        @click="testNode.resizable = 'horizontal'" />
                    <Btn
                        label="V"
                        size="s"
                        :tone="testNode.resizable === 'vertical' ? 'primary' : undefined"
                        flat
                        outline
                        @click="testNode.resizable = 'vertical'" />
                    <Btn
                        label="Both"
                        size="s"
                        :tone="testNode.resizable === 'both' ? 'primary' : undefined"
                        flat
                        outline
                        @click="testNode.resizable = 'both'" />
                    <Btn
                        label="None"
                        size="s"
                        :tone="testNode.resizable === 'none' ? 'primary' : undefined"
                        flat
                        outline
                        @click="testNode.resizable = 'none'" />
                </InputGroup>

                <HGroup>
                    <HGroup tagName="label">
                        <Checkbox
                            v-model="testNode.isSelected"
                            tone="primary"
                            outline
                            flat
                            size="s" />
                        Is Selected
                    </HGroup>
                    <HGroup tagName="label">
                        <Checkbox
                            v-model="testNode.selectable"
                            tone="primary"
                            outline
                            flat
                            size="s" />
                        Selectable
                    </HGroup>
                    <HGroup tagName="label">
                        <Checkbox
                            v-model="testNode.movable"
                            tone="primary"
                            outline
                            flat
                            size="s" />
                        Movable
                    </HGroup>
                    <HGroup tagName="label">
                        <Checkbox
                            v-model="testNode.snapToGrid"
                            tone="primary"
                            outline
                            flat
                            size="s" />
                        Snap to grid
                    </HGroup>
                </HGroup>
            </VGroup>
        </CanvasObject>

        <CanvasObject
            v-for="sticky in stickies"
            :key="sticky.id"
            v-model:pos="sticky.pos"
            v-model:isSelected="sticky.isSelected"
            :objectId="sticky.id"
            :canvas="canvas"
            resizable="both"
            :bounds="[{ x: 3, y: 3 }, { x: 12, y: 12 }]"
            class="StickyNote tone-primary"
            :class="{ 'StickyNote-selected': sticky.isSelected }">
            {{ sticky.text }}
        </CanvasObject>

    </CanvasView>
</template>

<script>
import { CanvasDebugCoords, CanvasObject, CanvasView } from '@nightshadeui/canvas/src';
import { Btn, Checkbox, HGroup, InputGroup, InputText, VGroup } from '@nightshadeui/components/src';

export default {

    components: {
        Btn,
        CanvasObject,
        CanvasView,
        Checkbox,
        CanvasDebugCoords,
        HGroup,
        InputGroup,
        InputText,
        VGroup,
    },

    inject: [
        'canvasDemoManager',
    ],

    data() {
        return {
            canvas: this.canvasDemoManager.createController(),
            testNode: {
                pos: { x: 0, y: 0, w: 20, h: 6 },
                selectable: true,
                isSelected: false,
                movable: true,
                snapToGrid: true,
                resizable: 'both',
                bounds: [{ x: 5, y: 5 }, { x: 20, y: 20 }],
            },
            stickies: [
                {
                    id: 'sticky-1',
                    pos: { x: -8, y: -5, w: 4, h: 4 },
                    text: 'Drag me around',
                    isSelected: false,
                },
                {
                    id: 'sticky-2',
                    pos: { x: -8, y: 0, w: 4, h: 4 },
                    text: 'Resize from corners',
                    isSelected: false,
                },
                {
                    id: 'sticky-3',
                    pos: { x: -8, y: 5, w: 4, h: 4 },
                    text: 'Shift/Cmd for multi select',
                    isSelected: false,
                },
            ],
        };
    },

};
</script>

<style scoped>
.CanvasPlayground {
    --CanvasView-grid-subdivisions: 2;
    --CanvasView-grid-major-fill: var(--border-base);

    width: 100%;
    height: 560px;
    border: var(--input-border-size) solid var(--border-base);
    border-radius: var(--radius-m);
    background: var(--surface-base);
}

.OriginPoint {
    position: absolute;
    top: -4px;
    left: -4px;
    width: 8px;
    height: 8px;
    background: var(--color-danger-500);
    border-radius: 100%;
}

.TestNode {
    position: absolute;
    inset: 0;

    padding: var(--sp2);
    border: var(--input-border-size) solid var(--color-base-400);
    border-radius: var(--radius-m);
    background: var(--surface-base);

    overflow: auto;
}

.TestNode-selected {
    border-color: var(--tone-focus-border);
    outline: var(--input-outline-size) solid var(--tone-focus-outline);
    outline-offset: var(--input-outline-offset);
}

.ControlInput {
    flex: 0 0 var(--sp12);
}

.StickyNote {
    padding: var(--sp);
    border: var(--input-border-size) solid var(--color-warning-600);
    border-radius: var(--radius-m);
    background: color-mix(in oklab, var(--color-warning-500), var(--surface-base) 75%);
    color: var(--text-base);
    font-size: var(--font-size-xs);
    white-space: pre-wrap;
}

.StickyNote-selected {
    border-color: var(--tone-focus-border);
    outline: var(--input-outline-size) solid var(--tone-focus-outline);
    outline-offset: var(--input-outline-offset);
}

.OverlayControls {
    position: absolute;
    z-index: 10;
    top: var(--sp2);
    right: var(--sp2);
    padding: var(--sp);
    border-radius: var(--radius-m);
    font-size: var(--font-size-s);
    border: var(--input-border-size) solid var(--border-base);
    background: var(--surface-base);
}
</style>
