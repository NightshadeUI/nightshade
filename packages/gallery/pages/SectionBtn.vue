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
            <HGroup tagName="label">
                <input v-model="shadow" type="checkbox" />
                <div>Shadow</div>
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
                    :shadow="shadow"
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
                    :shadow="shadow"
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
            shadow: false,
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
.Swatches {
    display: flex;
}

.Swatch {
    position: relative;

    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: var(--sp);
    height: var(--sp4);
    border-radius: var(--border-radius);

    font-size: var(--font-size-xs);
}

.Swatch::before {
    content: attr(data-text);
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    text-align: center;
    color: var(--color-base-700);
}

.Label {
    font-weight: var(--font-weight-bold);
    width: var(--sp8);
}
</style>
