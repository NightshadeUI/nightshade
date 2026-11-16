<template>
    <div class="ToneMatrix">
        <div class="Grid">
            <span class="Corner">tone ╲ size</span>
            <span
                v-for="size in inputSizes"
                :key="size"
                class="ColumnLabel">
                {{ size }}
            </span>
            <template
                v-for="tone in stylesManager.tones"
                :key="tone">
                <span class="RowLabel">{{ tone }}</span>
                <div
                    v-for="size in inputSizes"
                    :key="size"
                    class="Cell">
                    <slot
                        :tone="tone"
                        :size="size">
                        <Btn
                            :tone="tone"
                            :size="size"
                            label="Button" />
                    </slot>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { Btn } from '@nightshadeui/components';

import { inputSizes } from '../helpers/commons.js';

/**
 * Every tone the page defines, at every input size: a button, or whatever the slot renders
 * from `{ tone, size }`. Put it in a `<Demo>` for a stage, both schemes (`dual stacked`) and the demo defaults.
 */
export default {

    components: {
        Btn,
    },

    inject: [
        'stylesManager',
    ],

    data() {
        return {
            inputSizes,
        };
    },

};
</script>

<style scoped>
.ToneMatrix {
    width: 100%;
    min-width: 0;
    overflow-x: auto;
}

.Grid {
    display: grid;
    grid-template-columns: repeat(6, max-content);
    justify-content: space-between;
    align-items: center;
    gap: var(--sp1-5);
    width: max-content;
    min-width: 100%;
}

.Corner,
.ColumnLabel,
.RowLabel {
    font: 500 var(--font-size-xxs)/1 var(--font-monospace);
    color: var(--text-faint);
}

.ColumnLabel {
    text-align: center;
}

.Cell {
    display: flex;
    justify-content: center;
}
</style>
