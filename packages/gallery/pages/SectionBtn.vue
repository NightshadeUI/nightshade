<template>
    <h3 id="buttons">Buttons</h3>

    <DualTheme>

        <h4>Styles</h4>

        <VGroup>
            <HGroup wrap>
                <Btn
                    v-for="token, index of tokens"
                    :key="index"
                    :label="capitalize(token)"
                    :kind="token"
                    :round="commonOptions.round"
                    :flat="commonOptions.flat"
                    :outline="commonOptions.outline"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover"
                    :forceActive="commonOptions.forceActive" />
            </HGroup>

            <HGroup wrap>
                <Btn
                    v-for="token, index of tokens"
                    :key="index"
                    :label="capitalize(token)"
                    :kind="token"
                    :ghost="true"
                    :round="commonOptions.round"
                    :flat="commonOptions.flat"
                    :outline="commonOptions.outline"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover"
                    :forceActive="commonOptions.forceActive" />
            </HGroup>
        </VGroup>

        <h4>Sizes</h4>

        <VGroup>
            <HGroup
                v-for="size of inputSizes"
                :key="size">
                <Btn
                    :label="`Size ${size}`"
                    :size="size"
                    kind="secondary"
                    :round="commonOptions.round"
                    :flat="commonOptions.flat"
                    :outline="commonOptions.outline"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover"
                    :forceActive="commonOptions.forceActive" />
            </HGroup>
        </VGroup>
    </DualTheme>

</template>

<script>
import { capitalize } from '../utils/capitalize.js';
import { uiTokens } from '../utils/commons.js';
import { inputSizes } from '../utils/commons.js';

export default {

    inject: [
        'commonOptions'
    ],

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
    }

};
</script>
