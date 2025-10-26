<template>
    <component
        :is="tagName"
        class="HGroup"
        :class="[
            `HGroup-align-${align}`,
            `HGroup-justify-${justify}`,
            `HGroup-gap-${gap}`,
            {
                'HGroup-wrap': wrap,
            }
        ]">
        <slot />
    </component>
</template>

<script>
export default {

    props: {
        tagName: { type: String, default: 'div' },
        align: { type: String, default: 'center' },
        justify: { type: String },
        gap: { type: String, default: 's' },
        wrap: { type: Boolean, default: false },
    }

};
</script>

<style scoped>
.HGroup {
    display: flex;
    flex-flow: row nowrap;
}

.HGroup-align-stretch { align-items: stretch; }
.HGroup-align-baseline { align-items: baseline; }
.HGroup-align-center { align-items: center; }
.HGroup-align-start { align-items: flex-start; }
.HGroup-align-end { align-items: flex-end; }

.HGroup-justify-center { justify-content: center; }
.HGroup-justify-start { justify-content: flex-start; }
.HGroup-justify-end { justify-content: flex-end; }
.HGroup-justify-space-around { justify-content: space-around; }
.HGroup-justify-space-between { justify-content: space-between; }

.HGroup-gap-xxs { gap: var(--sp-xxs) }
.HGroup-gap-xs { gap: var(--sp-xs) }
.HGroup-gap-s { gap: var(--sp-s) }
.HGroup-gap-m { gap: var(--sp-m) }
.HGroup-gap-l { gap: var(--sp-l) }
.HGroup-gap-xl { gap: var(--sp-xl) }
.HGroup-gap-xxl { gap: var(--sp-xxl) }

.HGroup-gap-0 { gap: 0 }
.HGroup-gap-0-25 { gap: var(--sp-0-25) }
.HGroup-gap-0-5 { gap: var(--sp-0-5) }
.HGroup-gap-1 { gap: var(--sp-1) }
.HGroup-gap-1-5 { gap: var(--sp-1-5) }
.HGroup-gap-2 { gap: var(--sp-2) }
.HGroup-gap-2-5 { gap: var(--sp-2-5) }
.HGroup-gap-3 { gap: var(--sp-3) }
.HGroup-gap-4 { gap: var(--sp-4) }
.HGroup-gap-5 { gap: var(--sp-5) }
.HGroup-gap-6 { gap: var(--sp-6) }
.HGroup-gap-7 { gap: var(--sp-7) }
.HGroup-gap-8 { gap: var(--sp-8) }
.HGroup-gap-9 { gap: var(--sp-9) }
.HGroup-gap-10 { gap: var(--sp-10) }
.HGroup-gap-12 { gap: var(--sp-12) }
.HGroup-gap-16 { gap: var(--sp-16) }
.HGroup-gap-24 { gap: var(--sp-24) }
.HGroup-gap-32 { gap: var(--sp-32) }

.HGroup-wrap { flex-wrap: wrap; }
</style>
