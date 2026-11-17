<template>
    <span
        v-if="split"
        class="Step Step-split"
        :title="title">
        <span class="StepLight">{{ step.light }}</span>
        <span class="StepDark">{{ step.dark }}</span>
    </span>
    <span
        v-else
        class="Step">
        <span class="StepBoth">{{ step }}</span>
    </span>
</template>

<script>
/**
 * The step a role reads: one name, or a box split on the diagonal into the light scheme's step and the dark one's,
 * each drawn in its own scheme.
 */
export default {

    props: {
        step: { type: [String, Object], required: true },
    },

    computed: {

        split() {
            return typeof this.step !== 'string';
        },

        title() {
            if (!this.split) {
                return '';
            }
            return `${this.step.light} in light, ${this.step.dark} in dark`;
        },

    },

};
</script>

<style scoped>
.Step {
    display: inline-flex;
    box-sizing: border-box;
    height: var(--sp2);
    overflow: hidden;
    border: 1px solid var(--tone-text);
    border-radius: var(--radius-s);
    font: 400 var(--font-size-xxs) var(--font-monospace);
    line-height: var(--line-height-main);
}

/* Each half of a split step sets its own scheme, so it reads as a light chip and a dark one on either page */
.StepBoth,
.StepLight,
.StepDark {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 var(--sp0-5);
    color: var(--tone-text);
    background: var(--surface-base);
}

.StepLight {
    position: relative;
    padding-right: var(--sp1-5);
    border-end-end-radius: var(--sp1) 100%;
    color-scheme: light;
    corner-shape: bevel;
}

.StepDark {
    margin-left: calc(-1 * var(--sp1));
    padding-left: var(--sp1-5);
    color-scheme: dark;
}
</style>
