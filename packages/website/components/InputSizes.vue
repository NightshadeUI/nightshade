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
    </div>
</template>

<script>
const sizes = [
    {
        name: 'xs',
        height: '20px · sp2-5',
        minor: '12px · sp1-5',
        font: 'xs',
    },
    {
        name: 's',
        height: '24px · sp3',
        minor: '16px · sp2',
        font: 's',
    },
    {
        name: 'm',
        height: '32px · sp4',
        minor: '20px · sp2-5',
        font: 'm',
    },
    {
        name: 'l',
        height: '40px · sp5',
        minor: '24px · sp3',
        font: 'm',
    },
    {
        name: 'xl',
        height: '48px · sp6',
        minor: '32px · sp4',
        font: 'l',
    },
];

export default {

    data() {
        return {
            sizes,
        };
    },

};
</script>

<style scoped>
.InputSizes {
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
</style>
