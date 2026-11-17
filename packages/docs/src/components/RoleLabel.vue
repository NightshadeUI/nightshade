<template>
    <span
        class="RoleLabel tone-base"
        :class="{ 'RoleLabel-end': end }"
        :title="title">
        <span class="RoleHead">
            <span
                class="Swatch"
                :style="swatchStyle" />
            <code class="RoleName">{{ label.role }}</code>
        </span>
        <span
            v-if="label.step"
            class="RoleStep">
            <RoleStep :step="label.step" />
        </span>
    </span>
</template>

<script>
import RoleStep from './RoleStep.vue';

/**
 * One role's label: its swatch and name (`--tone-` left out), and the step it reads below.
 */
export default {

    components: {
        RoleStep,
    },

    props: {
        label: { type: Object, required: true },
        /** Flush the label to the end (the figure's left column). */
        end: { type: Boolean, default: false },
    },

    computed: {

        title() {
            return `--tone-${this.label.role}`;
        },

        swatchStyle() {
            return { background: `var(--tone-${this.label.role})` };
        },

    },

};
</script>

<style scoped>
.RoleLabel {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    gap: var(--sp1);
    white-space: nowrap;
}

.RoleLabel-end {
    align-items: flex-end;
    text-align: right;
}

.RoleHead {
    display: flex;
    align-items: center;
    gap: var(--sp1);
    height: var(--sp2);
}

.RoleLabel-end .RoleHead {
    flex-direction: row-reverse;
}

.Swatch {
    flex-shrink: 0;
    width: var(--sp1-5);
    height: var(--sp1-5);
    border-radius: var(--radius-s);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--text-base), transparent 80%) inset;
}

.RoleName {
    color: var(--text-base);
    font: 500 var(--font-size-xs) var(--font-monospace);
    line-height: var(--line-height-main);
}

.RoleStep {
    display: flex;
    padding: 0 var(--sp2-5);
}
</style>
