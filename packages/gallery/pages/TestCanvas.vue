<template>
    <CanvasView
        class="CanvasPlayground"
        :canvas="canvas">
        <CanvasObject
            v-model:pos="testNode.pos"
            v-model:isSelected="testNode.isSelected"
            objectId="test-node"
            :canvas="canvas"
            :selectable="testNode.selectable"
            :movable="testNode.movable"
            :snapToGrid="testNode.snapToGrid"
            :resizable="testNode.resizable"
            :bounds="testNode.bounds"
            class="TestNode"
            :class="{ 'TestNode-selected': testNode.isSelected }">
            <VGroup>
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
                        :kind="testNode.resizable === 'horizontal' ? 'primary' : 'base'"
                        flat
                        outline
                        @click="testNode.resizable = 'horizontal'" />
                    <Btn
                        label="V"
                        size="s"
                        :kind="testNode.resizable === 'vertical' ? 'primary' : 'base'"
                        flat
                        outline
                        @click="testNode.resizable = 'vertical'" />
                    <Btn
                        label="Both"
                        size="s"
                        :kind="testNode.resizable === 'both' ? 'primary' : 'base'"
                        flat
                        outline
                        @click="testNode.resizable = 'both'" />
                    <Btn
                        label="None"
                        size="s"
                        :kind="testNode.resizable === 'none' ? 'primary' : 'base'"
                        flat
                        outline
                        @click="testNode.resizable = 'none'" />
                </InputGroup>

                <HGroup>
                    <HGroup tagName="label">
                        <Checkbox
                            v-model="testNode.isSelected"
                            kind="primary"
                            outline
                            flat
                            size="xs" />
                        Is Selected
                    </HGroup>
                    <HGroup tagName="label">
                        <Checkbox
                            v-model="testNode.selectable"
                            kind="primary"
                            outline
                            flat
                            size="xs" />
                        Selectable
                    </HGroup>
                    <HGroup tagName="label">
                        <Checkbox
                            v-model="testNode.movable"
                            kind="primary"
                            outline
                            flat
                            size="xs" />
                        Movable
                    </HGroup>
                    <HGroup tagName="label">
                        <Checkbox
                            v-model="testNode.snapToGrid"
                            kind="primary"
                            outline
                            flat
                            size="xs" />
                        Snap to grid
                    </HGroup>
                </HGroup>
            </VGroup>
        </CanvasObject>

        <!--
        <CanvasObject
            v-for="sticky in stickies"
            :key="sticky.id"
            v-model:pos="sticky.pos"
            v-model:isSelected="sticky.isSelected"
            :objectId="sticky.id"
            :canvas="canvas"
            resizable="both"
            :bounds="[{ x: 3, y: 3 }, { x: 12, y: 12 }]"
            class="StickyNote"
            :class="{ 'StickyNote-selected': isSelected }">
            {{ sticky.text }}
        </CanvasObject>
    -->

        <template #overlays>
            <DebugCoords :controller="canvas" />
            <div class="OverlayControls">
                <HGroup tagName="label">
                    <Toggle
                        v-model="canvas.config.allowMultiSelect"
                        size="s"
                        kind="primary"
                        round />
                    Allow multi select
                </HGroup>
            </div>
        </template>
    </CanvasView>
</template>

<script>
import { CanvasController, CanvasObject, CanvasView, DebugCoords } from '@nightshadeui/canvas/src';
import { Btn, Checkbox, HGroup, InputGroup, InputText, VGroup } from '@nightshadeui/core/src';

export default {

    components: {
        Btn,
        CanvasObject,
        CanvasView,
        Checkbox,
        DebugCoords,
        HGroup,
        InputGroup,
        InputText,
        VGroup,
    },

    data() {
        return {
            canvas: new CanvasController(),
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
                    pos: { x: -8, y: -8, w: 5, h: 4 },
                    text: 'Hello',
                    isSelected: false,
                },
                {
                    id: 'sticky-2',
                    pos: { x: -8, y: -4, w: 6, h: 4 },
                    text: 'Drag me around',
                    isSelected: false,
                },
                {
                    id: 'sticky-3',
                    pos: { x: -8, y: 4, w: 5, h: 4 },
                    text: 'Resize from corners',
                    isSelected: false,
                },
                {
                    id: 'sticky-4',
                    pos: { x: -8, y: 8, w: 7, h: 4 },
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
    --canvas-margin-cells: 64;
    --canvas-grid-cell-size: 32px;
    --canvas-grid-subdivisions: 4;
    --canvas-grid-major-color: var(--color-base-200);
    --canvas-grid-minor-color: var(--color-base-100);

    margin: var(--sp);
    width: calc(100vw - var(--sp2));
    height: calc(100vh - var(--sp2));
    border: var(--input-border-size) solid var(--color-base-200);
    border-radius: var(--border-radius);
    background: var(--color-base-50);
}

.TestNode {
    padding: var(--sp2);
    border: var(--input-border-size) solid var(--color-base-300);
    border-radius: var(--input-radius);
    background: var(--color-base-0);
}

.TestNode-selected {
    border-color: var(--color-primary-500);
}

.ControlInput {
    flex: 0 0 var(--sp12);
}

.StickyNote {
    padding: var(--sp);
    border: var(--input-border-size) solid var(--color-warning-500);
    border-radius: var(--input-radius);
    background: var(--color-warning-200);
    color: var(--color-warning-950);
    font-size: var(--font-size-xs);
    white-space: pre-wrap;
}

.StickyNote-selected {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 var(--input-border-size) var(--color-primary-200);
}

.OverlayControls {
    position: absolute;
    z-index: 10;
    top: var(--sp2);
    right: var(--sp2);
    padding: var(--sp);
    border-radius: var(--border-radius);
    font-size: var(--font-size-s);
    border: var(--input-border-size) solid var(--color-base-200);
    background: var(--color-base-0);
}
</style>
