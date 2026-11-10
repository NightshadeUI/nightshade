<template>
    <div class="ToneRoles">
        <div class="Grid">
            <span class="Corner" />
            <code
                v-for="role in toneRoles"
                :key="role"
                class="ColumnLabel">{{ role }}</code>
            <template
                v-for="tone in stylesManager.tones"
                :key="tone">
                <code class="RowLabel">{{ tone }}</code>
                <span
                    v-for="role in toneRoles"
                    :key="role"
                    class="Swatch"
                    :class="`tone-${tone}`"
                    :title="`.tone-${tone} --tone-${role}`"
                    :style="{ background: `var(--tone-${role})` }" />
            </template>
        </div>
    </div>
</template>

<script>
import { toneRoles } from '../helpers/commons.js';

/**
 * Every tone role, in every tone the page defines.
 */
export default {

    inject: [
        'stylesManager',
    ],

    data() {
        return {
            toneRoles,
        };
    },

};
</script>

<style scoped>
.ToneRoles {
    margin: var(--sp3) 0;
    overflow-x: auto;
}

.Grid {
    display: grid;
    grid-template-columns: 72px repeat(10, minmax(40px, 1fr));
    gap: var(--sp0-5);
    min-width: 560px;
}

.ColumnLabel {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    justify-self: center;
    padding: var(--sp0-5) 0;
    font: 400 10px/1 var(--font-monospace);
    color: var(--text-faint);
}

.RowLabel {
    align-self: center;
    font: 400 11px/1 var(--font-monospace);
    color: var(--text-subtle);
}

.Swatch {
    height: var(--sp4);
    border-radius: var(--radius-m);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--text-base), transparent 90%) inset;
}
</style>
