<template>
    <span
        v-if="split"
        class="Step Step-split"
        :title="title">
        <span class="StepLight">{{ step.light.context }}</span>
        <span class="StepDark">{{ step.dark.context }}</span>
    </span>
    <span
        v-else
        class="Step"
        :title="title">
        <span class="StepBoth">{{ step.context }}</span>
    </span>
</template>

<script>
/**
 * The context variable a role reads (`--tone-500`). Split chips are light on the left,
 * dark on the right, each in its own scheme. Hover for the scale variable (`--color-primary-500`).
 */
export default {

    props: {
        step: { type: Object, required: true },
    },

    computed: {

        split() {
            return this.step.light != null;
        },

        title() {
            if (!this.split) {
                return this.step.scale ?? '';
            }
            return this.describeSplit(this.step.light.scale, this.step.dark.scale);
        },

    },

    methods: {

        describeSplit(light, dark) {
            if (!light && !dark) {
                return '';
            }
            if (light === dark) {
                return light;
            }
            if (light && dark) {
                return `${light} in light, ${dark} in dark`;
            }
            return light || dark;
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
