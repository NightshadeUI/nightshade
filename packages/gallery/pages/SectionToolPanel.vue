<template>
    <h3 id="tool-panel">Tool Panels</h3>

    <DualTheme>

        <VGroup>
            <ToolPanel
                v-for="size of panelSizes"
                :key="size"
                :size="size">

                <HGroup gap="0">
                    <Btn
                        v-for="option of options"
                        :key="option"
                        :label="capitalize(option)"
                        :size="getControlSize(size)"
                        :ghost="selectedOption !== option"
                        :outline="selectedOption === option ? commonOptions.outline : false"
                        @click="selectedOption = option" />
                </HGroup>

                <Filler />

                <InputText
                    v-model="selectedOption"
                    :size="getControlSize(size)" />
            </ToolPanel>

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

    data() {
        return {
            selectedOption: 'one',
        };
    },

    computed: {

        options() {
            return ['one', 'two', 'three'];
        },

        tokens() {
            return uiTokens;
        },

        inputSizes() {
            return inputSizes;
        },

        panelSizes() {
            return inputSizes.slice(1);
        },

    },

    methods: {
        capitalize,

        getControlSize(panelSize) {
            const i = inputSizes.indexOf(panelSize);
            return inputSizes[i - 1];
        }
    },

};
</script>
