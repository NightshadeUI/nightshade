<template>
    <div class="RampSwatches">
        <div class="Header">
            <code class="Name">--color-{{ name }}-*</code>
            <span
                v-if="note"
                class="Note">{{ note }}</span>
        </div>
        <div class="Steps">
            <div
                v-for="(step, index) in steps"
                :key="step.step"
                class="Step"
                :style="{
                    background: schemeColor(index, formatOklch),
                    color: schemeColor(index, contrastColor),
                }"
                :title="`--color-${name}-${step.step}`">
                <span class="StepLabel">{{ step.step }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { contrastColor } from '@nightshadeui/palette-generator/src';

export default {

    props: {
        name: { type: String, required: true },
        steps: { type: Array, required: true },
        note: { type: String },
    },

    methods: {

        /** The light step, or its mirror in the dark scheme: what `--color-<name>-<step>` resolves to. */
        schemeColor(index, format) {
            const mirror = this.steps[this.steps.length - 1 - index];
            return `light-dark(${format(this.steps[index])}, ${format(mirror)})`;
        },

        formatOklch(step) {
            return `oklch(${step.lightness} ${step.chroma} ${step.hue})`;
        },

        contrastColor,

    },

};
</script>

<style scoped>
.RampSwatches {
    display: flex;
    flex-flow: column;
    gap: var(--sp0-5);
}

.Header {
    display: flex;
    align-items: baseline;
    gap: var(--sp1);
}

.Name {
    font: 500 12px/1.4 var(--font-monospace);
}

.Note {
    font-size: var(--font-size-xs);
    color: var(--text-faint);
}

.Steps {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 2px;
}

.Step {
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    gap: 2px;
    height: var(--sp7);
    padding: var(--sp0-5);
    border-radius: var(--radius-m);
    box-shadow: 0 0 0 1px color-mix(in oklab, currentColor 10%, transparent) inset;
    font: 500 10px/1 var(--font-monospace);
    transition: background-color .15s;
}
</style>
