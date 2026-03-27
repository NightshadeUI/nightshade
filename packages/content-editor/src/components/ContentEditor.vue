<template>
    <div class="ContentEditor">
        <div
            ref="editorEl"
            class="EditableContent" />
    </div>
</template>

<script>
import { ContentEditor } from '../utils/ContentEditor.js';

export default {

    props: {
        modelValue: { type: Array, default: () => [] },
        options: { type: Object, default: () => ({}) },
    },

    emits: ['update:modelValue'],

    data() {
        const editor = new ContentEditor(this.options);
        return {
            editor,
            isInternalUpdatePending: false,
        };
    },

    watch: {
        modelValue(newValue) {
            if (this.isInternalUpdatePending) {
                this.isInternalUpdatePending = false;
                return;
            }
            this.editor.setModelValue(newValue);
        },
    },

    mounted() {
        this.editor.setModelValue(this.modelValue);
        this.editor.mount(this.$refs.editorEl);
        this.editor.onUpdate.on(this.onUpdate, this);
    },

    beforeUnmount() {
        this.editor.unmount();
        this.editor.onUpdate.removeAll(this);
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
