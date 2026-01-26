<template>
    <h3 id="checkboxes">Checkboxes</h3>

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
        <h4>Styles</h4>
        <HGroup wrap>
            <template
                v-for="kind in tokens"
                :key="kind">
                <Checkbox
                    v-model="value"
                    :kind="kind"
                    :mark="mark"
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
                <Checkbox
                    v-model="value"
                    kind="secondary"
                    :size="size"
                    :mark="mark"
                    :round="commonOptions.round"
                    :flat="commonOptions.flat"
                    :outline="commonOptions.outline"
                    :disabled="commonOptions.disabled"
                    :forceFocus="commonOptions.forceFocus"
                    :forceHover="commonOptions.forceHover" />
            </HGroup>
        </VGroup>

        <h4>Custom Content</h4>

        <Checkbox
            v-model="value"
            kind="secondary"
            :round="commonOptions.round"
            :flat="commonOptions.flat"
            :outline="commonOptions.outline"
            :disabled="commonOptions.disabled"
            :forceFocus="commonOptions.forceFocus"
            :forceHover="commonOptions.forceHover">
            <template #active>Y</template>
            <template #inactive>N</template>
        </Checkbox>
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
            mark: 'check',
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
