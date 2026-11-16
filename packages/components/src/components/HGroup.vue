<template>
    <component
        :is="resolvedProps.tagName"
        class="HGroup"
        :style="gapStyle"
        :class="[
            `HGroup-align-${resolvedProps.align}`,
            resolvedProps.justify && `HGroup-justify-${resolvedProps.justify}`,
            {
                'HGroup-wrap': resolvedProps.wrap,
            }
        ]">
        <slot />
    </component>
</template>

<script>
import { nightshadeMixin } from '../helpers/props.js';

export default {

    mixins: [nightshadeMixin],

    props: {
        tagName: { type: String, default: 'div' },
        align: { type: String, default: 'center' },
        justify: { type: String },
        gap: { type: [String, Number] },
        wrap: { type: Boolean, default: false },
    },

    computed: {

        // `gap` names a step of the spacing scale: `1` is `--sp1`, `0-5` is `--sp0-5`.
        gapStyle() {
            const { gap } = this.resolvedProps;
            if (gap == null) {
                return {};
            }
            return {
                '--HGroup-gap': String(gap) === '0' ? '0px' : `var(--sp${gap})`,
            };
        },

    },

};
</script>

<style scoped>
/* The order, stated wherever these styles load first: the styles, then the components */
@layer nightshade, nightshade-components;

@layer nightshade-components {

    .HGroup {
        --HGroup-gap: var(--sp1);

        display: flex;
        gap: var(--HGroup-gap);
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
    .HGroup-justify-space-evenly { justify-content: space-evenly; }

    .HGroup-wrap { flex-wrap: wrap; }

}
</style>
