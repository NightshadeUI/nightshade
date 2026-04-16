<template>
    <CanvasView
        class="CanvasPlayground"
        :canvas="canvas">
        <CanvasObject
            v-model:pos="testNode.pos"
            objectId="test-node"
            :canvas="canvas"
            :selectable="testNode.selectable"
            :movable="testNode.movable"
            :snapToGrid="testNode.snapToGrid"
            :resizable="testNode.resizable"
            :bounds="testNode.bounds">
            <template #default="{ isSelected }">
                <VGroup
                    class="TestNode"
                    :class="{ 'TestNode-selected': isSelected }">
                    <HGroup gap="1" align="stretch">
                        <InputText
                            class="ControlInput"
                            size="s"
                            label="x"
                            :modelValue="testNode.pos.x"
                            type="number"
                            @update:modelValue="testNode.pos.x = toNumber($event, testNode.pos.x)" />
                        <InputText
                            class="ControlInput"
                            size="s"
                            label="y"
                            :modelValue="testNode.pos.y"
                            type="number"
                            @update:modelValue="testNode.pos.y = toNumber($event, testNode.pos.y)" />
                        <InputText
                            class="ControlInput"
                            size="s"
                            label="w"
                            :modelValue="testNode.pos.w"
                            type="number"
                            :min="1"
                            @update:modelValue="testNode.pos.w = toNumber($event, testNode.pos.w)" />
                        <InputText
                            class="ControlInput"
                            size="s"
                            label="h"
                            :modelValue="testNode.pos.h"
                            type="number"
                            :min="1"
                            @update:modelValue="testNode.pos.h = toNumber($event, testNode.pos.h)" />
                    </HGroup>

                    <HGroup>
                        <InputText
                            class="ControlInput"
                            size="s"
                            label="minW"
                            :modelValue="testNode.bounds[0].x"
                            type="number"
                            :min="1"
                            @update:modelValue="testNode.bounds[0].x = toNumber($event, testNode.bounds[0].x)" />
                        <InputText
                            class="ControlInput"
                            size="s"
                            label="minH"
                            :modelValue="testNode.bounds[0].y"
                            type="number"
                            :min="1"
                            @update:modelValue="testNode.bounds[0].y = toNumber($event, testNode.bounds[0].y)" />
                        <InputText
                            class="ControlInput"
                            size="s"
                            label="maxW"
                            :modelValue="testNode.bounds[1].x"
                            type="number"
                            :min="1"
                            @update:modelValue="testNode.bounds[1].x = toNumber($event, testNode.bounds[1].x)" />
                        <InputText
                            class="ControlInput"
                            size="s"
                            label="maxH"
                            :modelValue="testNode.bounds[1].y"
                            type="number"
                            :min="1"
                            @update:modelValue="testNode.bounds[1].y = toNumber($event, testNode.bounds[1].y)" />
                    </HGroup>

                    <HGroup>
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
                    </HGroup>
                </VGroup>
            </template>
        </CanvasObject>

        <CanvasObject
            v-for="sticky in stickies"
            :key="sticky.id"
            v-model:pos="sticky.pos"
            :objectId="sticky.id"
            :canvas="canvas"
            resizable="both"
            :bounds="sticky.bounds">
            <template #default="{ isSelected }">
                <div
                    class="StickyNote"
                    :class="{ 'StickyNote-selected': isSelected }">
                    {{ sticky.text }}
                </div>
            </template>
        </CanvasObject>

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
                pos: { x: 0, y: 0, w: 6, h: 6 },
                selectable: true,
                movable: true,
                snapToGrid: true,
                resizable: 'both',
                bounds: [{ x: 2, y: 2 }, { x: 12, y: 12 }],
            },
            stickies: [
                {
                    id: 'sticky-1',
                    pos: { x: -8, y: -8, w: 5, h: 4 },
                    text: 'Hello',
                    bounds: [{ x: 3, y: 3 }, { x: 12, y: 12 }],
                },
                {
                    id: 'sticky-2',
                    pos: { x: -8, y: -4, w: 6, h: 5 },
                    text: 'Drag me around',
                    bounds: [{ x: 3, y: 3 }, { x: 12, y: 12 }],
                },
                {
                    id: 'sticky-3',
                    pos: { x: -8, y: 4, w: 5, h: 5 },
                    text: 'Resize from corners',
                    bounds: [{ x: 3, y: 3 }, { x: 12, y: 12 }],
                },
                {
                    id: 'sticky-4',
                    pos: { x: -8, y: 8, w: 7, h: 4 },
                    text: 'Shift/Cmd for multi select',
                    bounds: [{ x: 3, y: 3 }, { x: 12, y: 12 }],
                },
            ],
        };
    },

    methods: {

        toNumber(value, fallback) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : fallback;
        },

    },

};
</script>

<style scoped>
.CanvasPlayground {
    --canvas-margin-cells: 64;
    --canvas-grid-cell-size: var(--sp2);
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
