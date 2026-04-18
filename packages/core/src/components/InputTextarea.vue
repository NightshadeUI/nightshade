<template>
    <InputBase
        class="InputTextarea"
        v-bind="inputBaseProps"
        :fixedHeight="false">
        <slot name="before" />
        <textarea
            ref="input"
            :value="resolvedProps.modelValue"
            :placeholder="resolvedProps.placeholder"
            :readonly="resolvedProps.readonly"
            :disabled="resolvedProps.disabled"
            :rows="resolvedProps.rows"
            resize="none"
            autocomplete="off"
            @input="onInput($event)"
            @focus="$emit('focus', $event)"
            @blur="$emit('blur', $event)" />
        <slot name="after" />
    </InputBase>
</template>

<script>
import {
    collectProps,
    nightshadeMixin,
} from '../utils/props';
import InputBase from './InputBase.vue';

export default {

    components: {
        InputBase,
    },

    mixins: [nightshadeMixin],

    props: {
        ...InputBase.props,
        tagName: { type: String, default: 'label' },
        modelValue: { type: String },
        placeholder: { type: String },
        rows: { type: Number },
        autoSize: { type: Boolean, default: true },
        autoFocus: { type: Boolean },
        readonly: { type: Boolean },
    },

    emits: [
        'focus',
        'blur',
        'input',
        'update:modelValue'
    ],

    computed: {
        inputBaseProps() {
            return collectProps(this, InputBase);
        }
    },

    watch: {

        modelValue: {
            handler() {
                const textarea = this.$refs.input;
                if (this.resolvedProps.autoSize && textarea) {
                    textarea.style.height = 'auto';
                    textarea.style.height = textarea.scrollHeight + 'px';
                }
            },
        },

    },

    mounted() {
        this.$nextTick(() => {
            const textarea = this.$refs.input;
            if (this.resolvedProps.autoFocus) {
                textarea.focus();
            }
            if (this.resolvedProps.autoSize) {
                textarea.style.height = textarea.scrollHeight + 'px';
                textarea.style.overflowY = 'hidden';
            }
        });
    },

    methods: {

        onInput(ev) {
            this.$emit('update:modelValue', ev.target.value);
        },

    }

};
</script>

<style scoped>
.InputTextarea:not(.InputTextarea-disabled) {
    cursor: text;
}

input, textarea {
    -webkit-appearance: none;
    box-sizing: border-box;
    flex: 1;
    padding: 0;
    border: 0;
    width: 100%;
    min-width: 0;
    outline: 0;
    user-select: text;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: inherit;
    resize: none;
}

.InputBase:deep(.Container) {
    overflow-y: auto;
}

textarea {
    align-self: flex-start;
}
</style>
