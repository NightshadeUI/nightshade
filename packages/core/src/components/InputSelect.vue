<template>
    <InputBase
        class="InputSelect"
        v-bind="inputBaseProps"
        @click="onBaseClick($event)">
        <slot name="before" />
        <select
            ref="input"
            :value="modelValue"
            :disabled="disabled"
            :aria-readonly="readonly"
            @input="onInput($event)"
            @change="onChange($event)"
            @focus="$emit('focus', $event)"
            @blur="$emit('blur', $event)">
            <template v-if="hasGroupedOptions">
                <optgroup
                    v-for="group in groupedOptions"
                    :key="group.label"
                    :label="group.label">
                    <option
                        v-for="option in group.options"
                        :key="optionKey(option)"
                        :value="option.value">
                        {{ optionLabel(option) }}
                    </option>
                </optgroup>
            </template>
            <template v-else>
                <option
                    v-for="option in options"
                    :key="optionKey(option)"
                    :value="option.value">
                    {{ optionLabel(option) }}
                </option>
            </template>
        </select>
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
        options: {
            type: Array,
            default: () => [],
        },
        autoFocus: { type: Boolean },
        readonly: { type: Boolean },
    },

    emits: [
        'focus',
        'blur',
        'input',
        'change',
        'update:modelValue'
    ],

    computed: {

        inputBaseProps() {
            return collectProps(this, InputBase);
        },

        hasGroupedOptions() {
            return this.options.some(option => option?.group);
        },

        groupedOptions() {
            const groups = [{
                label: '',
                options: [],
            }];
            for (const option of this.options) {
                const groupLabel = option?.group ?? '';
                const group = groups.find(group => group.label === groupLabel);
                if (group) {
                    group.options.push(option);
                } else {
                    groups.push({
                        label: groupLabel,
                        options: [option],
                    });
                }
            }
            return groups;
        },
    },

    mounted() {
        if (this.autoFocus) {
            this.$refs.input?.focus();
        }
    },

    methods: {

        onInput(ev) {
            this.$emit('input', ev);
        },

        onChange(ev) {
            if (this.readonly) {
                ev.target.value = this.modelValue;
                return;
            }
            this.$emit('change', ev);
            this.$emit('update:modelValue', ev.target.value);
        },

        optionLabel(option) {
            return String(option?.label ?? option?.value ?? '');
        },

        optionKey(option) {
            return `${option?.group ?? ''}:${String(option?.value ?? '')}`;
        },

        onBaseClick() {
            const select = this.$refs.input;
            if (typeof select.showPicker === 'function') {
                select.showPicker();
            } else {
                select.click();
            }
        },

    }

};
</script>

<style scoped>
.InputSelect:not(.InputSelect-disabled) {
    cursor: pointer;
}

select {
    -webkit-appearance: none;
    appearance: none;
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

select[aria-readonly='true'] {
    pointer-events: none;
}
</style>
