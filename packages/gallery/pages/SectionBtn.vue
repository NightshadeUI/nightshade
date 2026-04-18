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
                    :kind="token" />
            </HGroup>

            <HGroup wrap>
                <Btn
                    v-for="token, index of tokens"
                    :key="index"
                    :label="capitalize(token)"
                    :kind="token"
                    :ghost="true" />
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
                    kind="secondary" />
            </HGroup>
        </VGroup>
    </DualTheme>

</template>

<script>
import { capitalize } from '../utils/capitalize.js';
import { uiTokens } from '../utils/commons.js';
import { inputSizes } from '../utils/commons.js';

export default {

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
