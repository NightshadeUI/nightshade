<template>
    <div
        v-if="toolbarState.visible"
        class="ContentEditorToolbar"
        :style="styleObject"
        @mousedown.prevent>
        <ContentEditorBlockToolbar
            :controller="controller"
            :activeBlockType="toolbarState.activeBlockType" />
        <ContentEditorInlineToolbar
            :controller="controller"
            :hasSelection="toolbarState.hasSelection"
            :activeInlineTypes="toolbarState.activeInlineTypes" />
    </div>
</template>

<script>
import ContentEditorBlockToolbar from './ContentEditorBlockToolbar.vue';
import ContentEditorInlineToolbar from './ContentEditorInlineToolbar.vue';

export default {

    components: {
        ContentEditorBlockToolbar,
        ContentEditorInlineToolbar,
    },

    props: {
        controller: { type: Object, required: true },
    },

    data() {
        return {
            toolbarStateRef: this.controller.getToolbarState(),
            unsubscribeToolbar: null,
        };
    },

    computed: {

        toolbarState() {
            return this.toolbarStateRef;
        },

        styleObject() {
            return {
                left: `${this.toolbarState.x}px`,
                top: `${this.toolbarState.y}px`,
            };
        },
    },

    mounted() {
        this.unsubscribeToolbar = this.controller.onToolbar.on(next => {
            this.toolbarStateRef = next;
        });
    },

    beforeUnmount() {
        this.unsubscribeToolbar?.();
    },

    methods: {},
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

</style>
