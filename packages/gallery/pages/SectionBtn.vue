<template>

    <DualTheme>

        <VGroup>
            <HGroup wrap>
                <Btn
                    v-for="token, index of tokens"
                    :key="index"
                    :label="capitalize(token)"
                    :kind="token"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover"
                    :forceActive="commonOptions.forceActive"
                    :round="commonOptions.round"
                    :outline="commonOptions.outline"
                    :flat="commonOptions.flat" />
            </HGroup>

            <HGroup wrap>
                <Btn
                    v-for="token, index of tokens"
                    :key="index"
                    :label="capitalize(token)"
                    :kind="token"
                    :ghost="true"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover"
                    :forceActive="commonOptions.forceActive"
                    :round="commonOptions.round"
                    :outline="commonOptions.outline"
                    :flat="commonOptions.flat" />
            </HGroup>
        </VGroup>
    </DualTheme>
</template>

<script>
import { capitalize } from '../utils/capitalize.js';
import { uiTokens } from '../utils/commons.js';

export default {

    inject: [
        'commonOptions'
    ],

    computed: {

        tokens() {
            return uiTokens;
        }

    },

    methods: {
        capitalize,
    }

};
</script>
