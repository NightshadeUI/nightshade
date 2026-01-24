<template>
    <h3 id="toggles">Toggles</h3>

    <DualTheme>
        <h4>Styles</h4>
        <HGroup wrap>
            <template
                v-for="kind in tokens"
                :key="kind">
                <Toggle
                    v-model="value"
                    :kind="kind"
                    :round="commonOptions.round"
                    :flat="commonOptions.flat"
                    :outline="commonOptions.outline"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover" />
            </template>
        </HGroup>

        <h4>Sizes</h4>
        <VGroup>
            <HGroup
                v-for="size of inputSizes"
                :key="size"
                tagName="label">
                <div class="Label">Size {{ size }}</div>
                <Filler fill="dotted" />
                <Toggle
                    v-model="value"
                    kind="secondary"
                    :size="size"
                    :round="commonOptions.round"
                    :flat="commonOptions.flat"
                    :outline="commonOptions.outline"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover" />
            </HGroup>
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
            value: true,
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
