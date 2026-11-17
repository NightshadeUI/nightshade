<template>
    <div class="TypeScale">
        <div
            v-for="size in sizes"
            :key="size"
            class="Row">
            <code class="Name">--font-size-{{ size }}</code>
            <span
                class="Sample"
                :style="{ fontSize: `var(--font-size-${size})` }">
                {{ sample }}
            </span>
        </div>
    </div>
</template>

<script>
export default {

    props: {
        sample: { type: String, default: 'Grow your own design system' },
    },

    data() {
        return {
            sizes: ['xxxl', 'xxl', 'xl', 'l', 'm', 's', 'xs', 'xxs', 'xxxs'],
        };
    },

};
</script>

<style scoped>
.TypeScale {
    margin: var(--sp3) 0;
    border-top: 1px solid var(--border-base);
}

.Row {
    display: grid;
    grid-template-columns: 140px 1fr;
    align-items: baseline;
    gap: var(--sp2);
    padding: var(--sp1) 0;
    border-bottom: 1px solid var(--border-base);
}

.Name {
    font: 400 var(--font-size-xs) var(--font-monospace);
    line-height: var(--line-height-main);
    color: var(--text-subtle);
}

.Sample {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: var(--line-height-prose);
}
</style>
