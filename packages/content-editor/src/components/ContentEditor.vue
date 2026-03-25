<template>
    <div class="ContentEditor">
        <div class="Toolbar">
            <Btn
                v-for="type in blockTypes"
                :key="type"
                kind="primary"
                size="s"
                :outline="focusedType !== type"
                @click="changeFocusedType(type)">
                {{ type }}
            </Btn>
        </div>

        <div
            ref="editorEl"
            class="Surface"
            contenteditable="true"
            @input="onInput"
            @focusin="onFocusChange"
            @focusout="onFocusChange" />
    </div>
</template>

<script>
import { Btn } from '@nightshadeui/core/src';

import {
    ContentEditorController,
} from '../ContentEditorController.js';

export default {

    name: 'ContentEditor',

    components: {
        Btn,
    },

    props: {
        modelValue: { type: Object, default: null },
    },

    emits: [
        'update:modelValue',
        'focus-node-change',
    ],

    data() {
        const controller = new ContentEditorController(this.modelValue || undefined);
        return {
            controller,
            focusedType: null,
            blockTypes: ['p1', 'p2', 'p3', 'h1', 'h2', 'h3'],
        };
    },

    watch: {

        modelValue(newValue) {
            if (!newValue || this.controller.isApplyingExternalUpdate) {
                return;
            }
            this.controller.setDocument(newValue);
        }

    },

    mounted() {
        this.controller.onChange = doc => {
            this.$emit('update:modelValue', doc);
        };
        this.controller.onFocusChange = node => {
            this.focusedType = node?.type || null;
            this.$emit('focus-node-change', node);
        };
        this.controller.mount(this.$refs.editorEl);
    },

    beforeUnmount() {
        this.controller.unmount();
    },

    methods: {

        onInput() {
            this.controller.handleInput();
        },

        onFocusChange() {
            this.controller.handleFocusChange();
        },

        changeFocusedType(type) {
            this.controller.changeFocusedBlockType(type);
        }

    }

};
</script>

<style scoped>
.ContentEditor {
    display: flex;
    flex-flow: column nowrap;
    gap: var(--sp);
}

.Toolbar {
    display: flex;
    flex-flow: row wrap;
    gap: calc(var(--sp) / 2);
}

.Surface {
    min-height: 240px;
    padding: var(--sp);
    border: 1px solid var(--color-base-300);
    border-radius: var(--radius);
    outline: none;
}

.Surface:focus {
    border-color: var(--color-primary-500);
}
</style>
