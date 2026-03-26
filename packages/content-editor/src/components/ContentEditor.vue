<template>
    <div class="ContentEditor" style="position: relative;">
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
        modelValue: { type: Array, default: () => [] },
        options: { type: Object, default: () => ({}) },
    },

    emits: ['update:modelValue'],

    data() {
        const controller = new ContentEditorController(this.modelValue, this.options);
        const unsubscribe = controller.onUpdate.on(value => {
            this.isInternalUpdatePending = true;
            this.$emit('update:modelValue', value);
        });
        return {
            controller,
            unsubscribe,
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
            this.controller.setValue(newValue);
        },
    },

    mounted() {
        this.controller.mount(this.$refs.editorEl);
    },

    beforeUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.controller.unmount();
    },
};
</script>
