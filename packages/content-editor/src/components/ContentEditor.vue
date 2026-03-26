<template>
    <div class="ContentEditor">
        <ContentEditorToolbar :controller="controller" />
        <div ref="editorEl" class="ContentEditorEditable" />
    </div>
</template>

<script>
import { ContentEditorController } from '../ContentEditorController.js';
import ContentEditorToolbar from './ContentEditorToolbar.vue';

export default {
    name: 'ContentEditor',

    components: {
        ContentEditorToolbar,
    },

    props: {
        modelValue: { type: Object, default: null },
        options: { type: Object, default: () => ({}) },
    },

    emits: ['update:modelValue'],

    data() {
        const controller = new ContentEditorController(this.modelValue, this.options, {
            onModelValue: doc => {
                this.isInternalUpdatePending = true;
                this.$emit('update:modelValue', doc);
            },
        });
        return {
            controller,
            isInternalUpdatePending: false,
        };
    },

    watch: {
        modelValue(newValue) {
            if (this.isInternalUpdatePending) {
                this.isInternalUpdatePending = false;
                return;
            }
            if (this.controller.isApplyingExternalUpdate) {
                return;
            }
            this.controller.setDocument(newValue);
        },
    },

    mounted() {
        this.controller.mount(this.$refs.editorEl);
    },

    beforeUnmount() {
        this.controller.unmount();
    },

};
</script>

<style>
.ContentEditor {
    position: relative;
}

.ContentEditorEditable {
    outline: none;
}
</style>
