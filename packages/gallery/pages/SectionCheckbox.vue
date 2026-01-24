<template>
    <VGroup>
        <HGroup>
            <label class="Label">Mark:</label>
            <HGroup>
                <template
                    v-for="style in ['check', 'xmark', 'dot', 'knob', 'none']"
                    :key="style">
                    <Btn
                        :label="capitalize(style)"
                        flat
                        outline
                        round
                        :kind="mark === style ? 'primary' : 'base'"
                        @click="mark = style" />
                </template>
            </HGroup>
        </HGroup>
    </VGroup>

    <DualTheme>
        <HGroup wrap>
            <template
                v-for="kind in tokens"
                :key="kind">
                <Checkbox
                    v-model="value"
                    :kind="kind"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover"
                    :forceActive="commonOptions.forceActive"
                    :round="commonOptions.round"
                    :outline="commonOptions.outline"
                    :flat="commonOptions.flat"
                    :disabled="commonOptions.disabled"
                    :mark="mark" />
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
            mark: 'check',
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
