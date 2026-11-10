<template>
    <div class="InputSizes">
        <div
            v-for="size in sizes"
            :key="size.name"
            class="Row">
            <code class="Name">{{ size.name }}</code>
            <div class="Sample">
                <Btn
                    :size="size.name"
                    label="Button"
                    tone="primary" />
                <InputText
                    :size="size.name"
                    placeholder="Input" />
                <Toggle
                    :size="size.name"
                    :modelValue="true"
                    tone="primary" />
            </div>
            <span class="Metric">
                <span class="MetricLabel">height</span>
                {{ size.height }}
            </span>
            <span class="Metric">
                <span class="MetricLabel">minor</span>
                {{ size.minor }}
            </span>
            <span class="Metric">
                <span class="MetricLabel">font</span>
                {{ size.font }}
            </span>
        </div>
        <span
            ref="probe"
            class="Probe" />
    </div>
</template>

<script>
import { inputSizes } from '../helpers/commons.js';

/**
 * Every control size, with the metrics it resolves to on this page.
 */
export default {

    data() {
        return {
            sizes: inputSizes.map(name => ({
                name,
                height: '',
                minor: '',
                font: '',
            })),
        };
    },

    mounted() {
        const unit = this.measureLength('var(--sp)');
        for (const size of this.sizes) {
            size.height = this.formatHeight(this.measureLength(`var(--input-size-${size.name}-major-height)`), unit);
            size.minor = this.formatHeight(this.measureLength(`var(--input-size-${size.name}-minor-height)`), unit);
            size.font = `${this.measureLength(`var(--input-size-${size.name}-font-size)`)}px`;
        }
    },

    methods: {

        /** The length a CSS value resolves to here, so the labels show the page's own scale. */
        measureLength(value) {
            const probe = this.$refs.probe;
            probe.style.width = value;
            return Math.round(probe.getBoundingClientRect().width * 100) / 100;
        },

        /** `32px`, and its spacing step when it lands on one (`32px · sp4`). */
        formatHeight(length, unit) {
            const steps = length / unit;
            return Number.isInteger(steps * 4) ? `${length}px · sp${String(steps).replace('.', '-')}` : `${length}px`;
        },

    },

};
</script>

<style scoped>
.InputSizes {
    position: relative;
    margin: var(--sp3) 0;
    border-top: 1px solid var(--border-base);
    overflow-x: auto;
}

.Row {
    display: grid;
    grid-template-columns: var(--sp4) minmax(300px, 1fr) repeat(3, 96px);
    align-items: center;
    gap: var(--sp2);
    min-width: 620px;
    padding: var(--sp1-5) 0;
    border-bottom: 1px solid var(--border-base);
}

.Name {
    font: 500 var(--font-size-s)/1 var(--font-monospace);
}

.Sample {
    display: flex;
    align-items: center;
    gap: var(--sp1);
    background-image: repeating-linear-gradient(
        to bottom,
        color-mix(in oklab, var(--color-primary-500), transparent 85%) 0 1px,
        transparent 1px var(--sp)
    );
}

.Sample .InputText {
    width: 120px;
}

.Metric {
    display: flex;
    flex-flow: column;
    gap: 2px;
    font: 400 11px/1.3 var(--font-monospace);
    color: var(--text-subtle);
}

.MetricLabel {
    font-size: 10px;
    color: var(--text-faint);
}

.Probe {
    position: absolute;
    top: 0;
    left: 0;
    height: 0;
    visibility: hidden;
}
</style>
