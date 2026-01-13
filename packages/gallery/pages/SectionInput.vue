<template>
    <VGroup>
        <HGroup>
            <label class="Label">Style:</label>
            <HGroup tagName="label">
                <input v-model="round" type="checkbox" />
                <div>Round</div>
            </HGroup>
            <HGroup tagName="label">
                <input v-model="flat" type="checkbox" />
                <div>Flat</div>
            </HGroup>
        </HGroup>
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
        <HGroup>
            <label class="Label">State:</label>
            <HGroup tagName="label">
                <input v-model="focus" type="checkbox" />
                <div>Focus</div>
            </HGroup>
            <HGroup tagName="label">
                <input v-model="disabled" type="checkbox" />
                <div>Disabled</div>
            </HGroup>
        </HGroup>
        <HGroup>
            <label class="Label">Options:</label>
            <HGroup tagName="label">
                <input
                    v-model="size"
                    type="checkbox"
                    true-value="small"
                    false-value="" />
                <div>Small</div>
            </HGroup>
            <HGroup tagName="label">
                <input
                    v-model="icon"
                    type="checkbox"
                    true-value="pseudo-icon"
                    false-value="" />
                <div>Icon</div>
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
                    :forceFocus="focus"
                    :flat="flat"
                    :round="round"
                    :disabled="disabled"
                    :size="size">
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

export default {

    data() {
        return {
            text: 'Hello world!',
            disabled: false,
            focus: false,
            size: undefined,
            icon: undefined,
            flat: false,
            round: false,
            labelStyle: 'inline',
        };
    },

    computed: {

        tokens() {
            return [
                'base',
                'inverse',
                'primary',
                'secondary',
                'tertiary',
                'success',
                'warning',
                'danger',
            ];
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
