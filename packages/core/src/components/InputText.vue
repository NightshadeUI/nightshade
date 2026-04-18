<template>
    <InputBase
        class="InputText"
        v-bind="inputBaseProps">
        <slot name="before" />
        <input
            ref="input"
            :value="modelValue"
            :type="type"
            :placeholder="placeholder"
            :readonly="readonly"
            :disabled="disabled"
            :min="min"
            :max="max"
            :step="step"
            autocomplete="off"
            @input="onInput($event)"
            @focus="$emit('focus', $event)"
            @blur="$emit('blur', $event)" />
        <slot name="after" />
    </InputBase>
</template>

<script>
import { collectProps } from '../utils/props';
import InputBase from './InputBase.vue';

export default {

    components: {
        InputBase,
    },

    props: {
        ...InputBase.props,
        tagName: { type: String, default: 'label' },
        modelValue: { type: [String, Number] },
        type: { type: String },
        placeholder: { type: String },
        min: { type: Number },
        max: { type: Number },
        step: { type: Number },
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

    mounted() {
        if (this.autoFocus) {
            this.$refs.input?.focus();
        }
    },

    methods: {

        onInput(ev) {
            this.$emit('update:modelValue', ev.target.value);
        }

    }

};
</script>

<style scoped>
.InputText:not(.InputText-disabled) {
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
}
</style>
