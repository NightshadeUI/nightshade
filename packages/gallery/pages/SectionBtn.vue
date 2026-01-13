<template>
    <VGroup>
        <HGroup>
            <label class="Label">Style:</label>
            <HGroup tagName="label">
                <input v-model="flat" type="checkbox" />
                <div>Flat</div>
            </HGroup>
            <HGroup tagName="label">
                <input v-model="round" type="checkbox" />
                <div>Round</div>
            </HGroup>
            <HGroup tagName="label">
                <input v-model="outline" type="checkbox" />
                <div>Outline</div>
            </HGroup>
        </HGroup>
        <HGroup>
            <label class="Label">State:</label>
            <HGroup tagName="label">
                <input v-model="disabled" type="checkbox" />
                <div>Disabled</div>
            </HGroup>
            <HGroup tagName="label">
                <input v-model="focus" type="checkbox" />
                <div>Focus</div>
            </HGroup>
            <HGroup tagName="label">
                <input v-model="hover" type="checkbox" />
                <div>Hover</div>
            </HGroup>
            <HGroup tagName="label">
                <input v-model="active" type="checkbox" />
                <div>Active</div>
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
            <HGroup wrap>
                <Btn
                    v-for="token, index of tokens"
                    :key="index"
                    :label="capitalize(token)"
                    :kind="token"
                    :disabled="disabled"
                    :forceFocus="focus"
                    :forceHover="hover"
                    :forceActive="active"
                    :round="round"
                    :outline="outline"
                    :flat="flat"
                    :size="size"
                    :icon="icon" />
            </HGroup>

            <HGroup wrap>
                <Btn
                    v-for="token, index of tokens"
                    :key="index"
                    :label="capitalize(token)"
                    :kind="token"
                    :ghost="true"
                    :disabled="disabled"
                    :forceFocus="focus"
                    :forceHover="hover"
                    :forceActive="active"
                    :round="round"
                    :outline="outline"
                    :flat="flat"
                    :size="size"
                    :icon="icon" />
            </HGroup>
        </VGroup>
    </DualTheme>
</template>

<script>
import { capitalize } from '../utils/capitalize.js';

export default {

    data() {
        return {
            disabled: false,
            focus: false,
            hover: false,
            active: false,
            round: false,
            outline: false,
            flat: false,
            size: undefined,
            icon: undefined,
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
    }

};
</script>

<style scoped>
.Label {
    font-weight: var(--font-weight-bold);
    width: var(--sp8);
}
</style>
