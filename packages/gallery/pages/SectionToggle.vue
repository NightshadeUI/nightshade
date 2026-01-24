<template>
    <DualTheme>

        <HGroup wrap>

            <template
                v-for="kind in tokens"
                :key="kind">
                <Toggle
                    v-model="value"
                    :kind="kind"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover"
                    :forceActive="commonOptions.forceActive"
                    :round="commonOptions.round"
                    :outline="commonOptions.outline"
                    :flat="commonOptions.flat"
                    :disabled="commonOptions.disabled" />
            </template>
        </HGroup>

    </DualTheme>
</template>

<script>
import { capitalize } from '../utils/capitalize.js';
import { uiTokens } from '../utils/commons.js';

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
        }

    },

    methods: {
        capitalize,
    },

};
</script>
