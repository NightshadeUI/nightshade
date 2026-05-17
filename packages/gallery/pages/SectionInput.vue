<template>
    <h3 id="inputs">Inputs</h3>

    <VGroup>
        <HGroup>
            <label class="Label">Label:</label>
            <HGroup>
                <template
                    v-for="style in ['inline', 'text', 'tab']"
                    :key="style">
                    <Btn
                        flat
                        outline
                        round
                        :label="capitalize(style)"
                        :kind="labelStyle === style ? 'primary' : 'base'"
                        @click="labelStyle = style" />
                </template>
            </HGroup>
        </HGroup>
    </VGroup>

    <DualTheme>

        <h4>Styles</h4>

        <VGroup>
            <template
                v-for="kind in tokens"
                :key="kind">
                <InputText
                    v-model="text"
                    :kind="kind"
                    :label="capitalize(kind)"
                    :labelStyle="labelStyle" />
            </template>
        </VGroup>

        <h4>Sizes</h4>

        <VGroup>
            <template
                v-for="size of inputSizes"
                :key="size">
                <InputText
                    v-model="text"
                    :size="size"
                    :label="`Size ${size}`"
                    :labelStyle="labelStyle" />
            </template>
        </VGroup>

        <h4>Before / After</h4>

        <VGroup>
            <InputText
                v-model="text"
                :labelStyle="labelStyle">
                <template #before>
                    💬
                </template>
                <template #after>
                    ✅
                </template>
            </InputText>
        </VGroup>

        <h4>Select</h4>

        <VGroup>
            <InputSelect
                v-model="selectedSimple"
                label="Simple select"
                :options="simpleSelectOptions"
                :labelStyle="labelStyle">
                <template #after>
                    <i class="fas fa-angle-down" />
                </template>
            </InputSelect>
            <InputSelect
                v-model="selectedGrouped"
                label="Grouped select"
                :options="groupedSelectOptions"
                :labelStyle="labelStyle" />
        </VGroup>

    </DualTheme>
</template>

<script>
import { capitalize } from '../utils/capitalize.js';
import { inputSizes, uiTokens } from '../utils/commons.js';

export default {

    data() {
        return {
            text: 'Hello world!',
            labelStyle: 'inline',
            selectedSimple: 'alpha',
            selectedGrouped: 'bananas',
        };
    },

    computed: {

        tokens() {
            return uiTokens;
        },

        inputSizes() {
            return inputSizes;
        },

        simpleSelectOptions() {
            return [
                { value: 'alpha', label: 'Alpha' },
                { value: 'beta', label: 'Beta' },
                { value: 'gamma', label: 'Gamma' },
            ];
        },

        groupedSelectOptions() {
            return [
                { value: 'all', label: 'All items' },
                { value: 'apples', group: 'Fruit' },
                { value: 'bananas', group: 'Fruit' },
                { value: 'carrots', group: 'Vegetables' },
                { value: 'broccoli', group: 'Vegetables' },
            ];
        },

    },

    methods: {
        capitalize,
    },

};
</script>
