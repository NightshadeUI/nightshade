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
                    <Btn
                        :tone="tone"
                        :size="size"
                        :label="tone" />
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { inputSizes } from '../helpers/commons.js';

/**
 * Every tone the page defines, at every input size.
 */
export default {

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
    overflow-x: auto;
    padding: var(--sp3);
    border: 1px solid var(--border-base);
    border-radius: calc(2 * var(--radius-l));
    background: var(--surface-base);
}

.Grid {
    display: grid;
    grid-template-columns: auto repeat(5, minmax(max-content, 1fr));
    align-items: center;
    gap: var(--sp1-5) var(--sp2);
    min-width: 760px;
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

.RowLabel {
    padding-right: var(--sp2);
}

.Cell {
    display: flex;
    justify-content: center;
}
</style>
