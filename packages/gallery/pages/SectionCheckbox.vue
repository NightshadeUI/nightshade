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
            <HGroup tagName="label">
                <input v-model="outline" type="checkbox" />
                <div>Outline</div>
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
                    :forceFocus="focus"
                    :flat="flat"
                    :outline="outline"
                    :round="round"
                    :size="size"
                    :disabled="disabled"
                    :mark="mark" />
            </template>
        </HGroup>

    </DualTheme>
</template>

<script>
import { capitalize } from '../utils/capitalize.js';

export default {

    data() {
        return {
            value: true,
            disabled: false,
            focus: false,
            size: undefined,
            flat: false,
            round: false,
            outline: false,
            mark: 'check',
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
