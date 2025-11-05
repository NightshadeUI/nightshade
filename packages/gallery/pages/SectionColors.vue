<template>
    <DualTheme>
        <template
            v-for="token of tokens"
            :key="token">
            <h4>{{ capitalize(token) }}</h4>
            <HGroup gap="xxs">
                <div
                    v-for="scale of scales"
                    :key="scale"
                    class="Swatch"
                    :style="{
                        backgroundColor: `var(--color-${token}-${scale})`,
                    }"
                    :data-text="scale" />
            </HGroup>
        </template>
    </DualTheme>
</template>

<script>
import { capitalize } from '../utils/capitalize.js';

export default {

    computed: {

        scales() {
            return [100, 200, 300, 400, 500, 600, 700, 800, 900];
        },

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
</style>
