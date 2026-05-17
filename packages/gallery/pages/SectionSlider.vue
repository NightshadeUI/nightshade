<template>
    <h3 id="sliders">Sliders</h3>

    <VGroup>
        <HGroup>
            <label class="Label">Knob:</label>
            <HGroup>
                <template
                    v-for="style in ['opaque', 'translucent']"
                    :key="style">
                    <Btn
                        :label="capitalize(style)"
                        flat
                        outline
                        round
                        :kind="knobStyle === style ? 'primary' : 'base'"
                        @click="knobStyle = style" />
                </template>
            </HGroup>
        </HGroup>
        <HGroup>
            <label class="Label">Fill:</label>
            <HGroup>
                <template
                    v-for="style in ['track', 'inset', 'none']"
                    :key="style">
                    <Btn
                        :label="capitalize(style)"
                        flat
                        outline
                        round
                        :kind="fillStyle === style ? 'primary' : 'base'"
                        @click="fillStyle = style" />
                </template>
            </HGroup>
        </HGroup>
    </VGroup>

    <DualTheme>
        <h4>Styles</h4>
        <VGroup>
            <HGroup
                v-for="kind in tokens"
                :key="kind"
                tagName="label"
                gap="2">
                <div class="Label flex-1 nowrap">{{ capitalize(kind) }}</div>
                <Slider
                    v-model="value"
                    :kind="kind"
                    :knobStyle="knobStyle"
                    :fillStyle="fillStyle"
                    class="flex-1" />
            </HGroup>
        </VGroup>

        <h4>Sizes</h4>
        <VGroup>
            <HGroup
                v-for="size of inputSizes"
                :key="size"
                tagName="label"
                gap="2">
                <div class="Label flex-1 nowrap">Size {{ size }}</div>
                <Slider
                    v-model="value"
                    kind="secondary"
                    :size="size"
                    :knobStyle="knobStyle"
                    :fillStyle="fillStyle"
                    class="flex-1" />
            </HGroup>
        </VGroup>

        <h4>Tooltip &amp; scale</h4>
        <VGroup>
            <HGroup
                tagName="label"
                gap="2">
                <Slider
                    v-model="scaledValue"
                    kind="primary"
                    :knobStyle="knobStyle"
                    :fillStyle="fillStyle"
                    tooltip="dynamic"
                    tooltipKind="inverse"
                    class="flex-1"
                    :min="0"
                    :max="100"
                    :step="1"
                    :scale="[0, 25, 50, 75, 100]"
                    :snapThreshold="3"
                    :formatTooltip="formatPercent"
                    :formatScale="formatPercent" />
            </HGroup>
        </VGroup>
    </DualTheme>
</template>

<script>
import { capitalize } from '../utils/capitalize.js';
import { inputSizes, uiTokens } from '../utils/commons.js';

export default {

    data() {
        return {
            value: 40,
            scaledValue: 50,
            knobStyle: 'opaque',
            fillStyle: 'track',
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

        formatPercent(value) {
            return `${value}%`;
        },

    },

};
</script>
