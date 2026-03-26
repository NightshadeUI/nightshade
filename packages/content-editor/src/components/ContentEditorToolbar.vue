<template>
    <div
        v-if="toolbarState.visible"
        class="ContentEditorToolbar"
        :style="styleObject"
        @mousedown.prevent="onMouseDown">
        <div class="Row">
            <Btn
                ref="blockButton"
                :label="activeBlockLabel"
                size="s"
                flat
                @click="toggleBlockMenu()" />
            <ContextMenu
                v-if="blockMenuShown"
                anchorRef="blockButton"
                dir="bottom"
                anchorDir="bottom"
                :overlayEnabled="false"
                :overlayShown="false"
                :arrowShown="false"
                :items="blockMenuItems"
                @hide="hideBlockMenu()"
                @activate="onBlockActivate" />
        </div>

        <div
            v-if="toolbarState.hasSelection"
            class="Row">
            <Btn
                v-for="inline in inlineOptions"
                :key="inline.type"
                :label="inline.label || inline.type"
                size="s"
                flat
                :forceActive="toolbarState.activeInlineTypes.includes(inline.type)"
                @click="onInlineClick(inline.type)" />
        </div>
    </div>
</template>

<script>
import { Btn, ContextMenu } from '@nightshadeui/core/src';

export default {
    name: 'ContentEditorToolbar',

    components: {
        Btn,
        ContextMenu,
    },

    props: {
        controller: { type: Object, required: true },
    },

    data() {
        return {
            blockMenuShown: false,
        };
    },

    computed: {

        toolbarState() {
            return this.controller.getToolbarState();
        },

        blockOptions() {
            return this.controller.getOptions().blocks;
        },

        inlineOptions() {
            return this.controller.getOptions().inlines || [];
        },

        activeBlockLabel() {
            const activeBlock = this.blockOptions.find(item => item.type === this.toolbarState.activeBlockType);
            return activeBlock?.label || activeBlock?.type || 'Block';
        },

        blockMenuItems() {
            return this.blockOptions.map(item => ({
                title: item.label || item.type,
                value: item.type,
                checked: item.type === this.toolbarState.activeBlockType,
            }));
        },

        styleObject() {
            return {
                left: `${this.toolbarState.x}px`,
                top: `${this.toolbarState.y}px`,
            };
        },
    },

    methods: {

        onMouseDown() {

        },

        toggleBlockMenu() {
            this.blockMenuShown = !this.blockMenuShown;
        },

        hideBlockMenu() {
            this.blockMenuShown = false;
        },

        onBlockActivate(item) {
            if (item?.value) {
                this.controller.applyBlockType(item.value);
            }
            this.hideBlockMenu();
        },

        onInlineClick(type) {
            this.controller.applyInlineType(type);
        },

    },
};
</script>

<style scoped>
.ContentEditorToolbar {
    --ContentEditorToolbar-border-color: var(--ui-border-color);
    --ContentEditorToolbar-surface: var(--ui-surface-color);

    position: absolute;
    z-index: 5;
    display: inline-flex;
    align-items: center;
    gap: var(--sp0-5);
    padding: var(--sp0-5);
    border: 1px solid var(--ContentEditorToolbar-border-color);
    border-radius: var(--input-radius);
    background: var(--ContentEditorToolbar-surface);
}

.Row {
    display: inline-flex;
    align-items: center;
    gap: var(--sp0-5);
}
</style>
