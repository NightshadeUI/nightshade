<template>
    <div class="SpacingScale">
        <div
            v-for="step in steps"
            :key="step"
            class="Row">
            <code class="Name">--sp{{ step }}</code>
            <span
                class="Bar"
                :style="{ width: `var(--sp${step})` }" />
            <span class="Value">{{ lengths[step] }}</span>
        </div>
        <span
            ref="probe"
            class="Probe" />
    </div>
</template>

<script>
export default {

    data() {
        return {
            steps: ['0-25', '0-5', '1', '1-5', '2', '2-5', '3', '4', '5', '6', '8', '10', '12', '16', '24', '32'],
            lengths: {},
        };
    },

    mounted() {
        this.lengths = Object.fromEntries(this.steps.map(step => [step, this.measureLength(`var(--sp${step})`)]));
    },

    methods: {

        /** The length a CSS value resolves to here, so the labels show the page's own scale. */
        measureLength(value) {
            const probe = this.$refs.probe;
            probe.style.width = value;
            return `${Math.round(probe.getBoundingClientRect().width * 100) / 100}px`;
        },

    },

};
</script>

<style scoped>
.SpacingScale {
    position: relative;
    display: flex;
    flex-flow: column;
    gap: var(--sp0-5);
    margin: var(--sp3) 0;
    overflow: hidden;
}

.Row {
    display: grid;
    grid-template-columns: 72px 1fr 56px;
    align-items: center;
    gap: var(--sp2);
}

.Name,
.Value {
    font: 400 12px/1 var(--font-monospace);
    color: var(--text-subtle);
}

.Value {
    text-align: right;
    color: var(--text-faint);
}

.Bar {
    height: var(--sp1-5);
    max-width: 100%;
    border-radius: var(--radius-s);
    background: linear-gradient(to right, var(--color-primary-500), var(--color-secondary-500));
}

.Probe {
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    visibility: hidden;
}
</style>
