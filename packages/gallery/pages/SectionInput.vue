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
                        :label="capitalize(style)"
                        flat
                        outline
                        round
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
                    :labelStyle="labelStyle"
                    :round="commonOptions.round"
                    :flat="commonOptions.flat"
                    :outline="commonOptions.outline"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus" />
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
                    :labelStyle="labelStyle"
                    :round="commonOptions.round"
                    :flat="commonOptions.flat"
                    :outline="commonOptions.outline"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus" />
            </template>
        </VGroup>

        <h4>Before / After</h4>

        <VGroup>
            <InputText
                v-model="text"
                :labelStyle="labelStyle"
                :round="commonOptions.round"
                :flat="commonOptions.flat"
                :outline="commonOptions.outline"
                :disabled="commonOptions.disabled"
                :forceFocus="commonOptions.forceFocus">
                <template #before>
                    💬
                </template>
                <template #after>
                    ✅
                </template>
            </InputText>
        </VGroup>

    </DualTheme>
</template>

<script>
import { capitalize } from '../utils/capitalize.js';
import { inputSizes, uiTokens } from '../utils/commons.js';

export default {

    inject: [
        'commonOptions'
    ],

    data() {
        return {
            text: 'Hello world!',
            labelStyle: 'inline',
        };
    },

    computed: {

        tokens() {
            return uiTokens;
        },

        inputSizes() {
            return inputSizes;
        },

    },

    methods: {
        capitalize,
    },

};
</script>

<style scoped>
.Label {
    font-weight: var(--font-weight-bold);
    width: var(--sp8);
}
</style>
