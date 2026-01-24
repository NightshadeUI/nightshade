<template>
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

        <VGroup>

            <template
                v-for="kind in tokens"
                :key="kind">

                <InputText
                    v-model="text"
                    :kind="kind"
                    :label="capitalize(kind)"
                    :labelStyle="labelStyle"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus"
                    :round="commonOptions.round"
                    :outline="commonOptions.outline"
                    :flat="commonOptions.flat">
                    <template #after>
                        <i
                            v-if="icon"
                            class="pseudo-icon" />
                    </template>
                </InputText>
            </template>

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

    data() {
        return {
            text: 'Hello world!',
            labelStyle: 'inline',
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

<style scoped>
.Label {
    font-weight: var(--font-weight-bold);
    width: var(--sp8);
}
</style>
