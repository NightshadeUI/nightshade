<template>
    <div class="PaletteReference">
        <div
            v-for="ramp in stylesManager.ramps"
            :key="ramp"
            class="Ramp">
            <code class="RampName">--color-{{ ramp }}-*</code>
            <div class="Steps">
                <button
                    v-for="step in steps"
                    :key="step"
                    class="Step"
                    :title="`Copy var(--color-${ramp}-${step})`"
                    :style="{
                        background: `var(--color-${ramp}-${step})`,
                        color: step < 500 ? `var(--color-${ramp}-950)` : `var(--color-${ramp}-0)`,
                    }"
                    @click="copyStep(ramp, step)">
                    {{ copied === `${ramp}-${step}` ? '✓' : step }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
const STEPS = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/**
 * Every ramp the page's palette defines, read live: what the generated `palette.css` resolves to
 * in the current scheme. Click a step to copy it.
 */
export default {

    inject: [
        'stylesManager',
    ],

    data() {
        return {
            steps: STEPS,
            copied: '',
        };
    },

    methods: {

        copyStep(ramp, step) {
            navigator.clipboard.writeText(`var(--color-${ramp}-${step})`);
            this.copied = `${ramp}-${step}`;
            setTimeout(() => {
                this.copied = '';
            }, 1200);
        },

    },

};
</script>

<style scoped>
.PaletteReference {
    display: flex;
    flex-flow: column;
    gap: var(--sp2-5);
    margin: var(--sp3) 0;
}

.RampName {
    display: block;
    margin-bottom: var(--sp0-5);
    font: 600 var(--font-size-s)/1.5 var(--font-monospace);
}

.Steps {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    border: 1px solid var(--border-base);
    border-radius: var(--radius-l);
    overflow: hidden;
}

.Step {
    height: var(--sp6);
    margin: 0;
    padding: 0;
    border: 0;
    font: 500 var(--font-size-xxs)/1 var(--font-monospace);
    cursor: copy;
}

@media (max-width: 640px) {
    .Steps {
        grid-template-columns: repeat(6, minmax(0, 1fr));
    }
}
</style>
