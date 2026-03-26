<template>
    <div class="ContentEditor">
        <ContentEditorToolbar
            :controller="controller" />
        <div
            ref="editorEl"
            class="EditableContent" />
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
            this.controller.setValue(newValue);
        },
    },

    mounted() {
        this.controller.mount(this.$refs.editorEl);
        this.controller.onUpdate.on(this.onUpdate, this);
    },

    beforeUnmount() {
        this.controller.unmount();
        this.controller.onUpdate.removeAll(this);
    },

    methods: {

        onUpdate(value) {
            this.isInternalUpdatePending = true;
            this.$emit('update:modelValue', value);
        },

    },

};
</script>

<style scoped>
.ContentEditor {
    position: relative;
}

.EditableContent {
    outline: 0;
}
</style>
