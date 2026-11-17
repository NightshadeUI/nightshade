<template>
    <component
        :is="resolvedProps.tagName"
        class="VGroup"
        :style="gapStyle"
        :class="[
            `VGroup-align-${resolvedProps.align}`,
            resolvedProps.justify && `VGroup-justify-${resolvedProps.justify}`,
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
        align: { type: String, default: 'stretch' },
        justify: { type: String },
        gap: { type: [String, Number] },
    },

    computed: {

        // `gap` names a step of the spacing scale: `1` is `--sp1`, `0-5` is `--sp0-5`.
        gapStyle() {
            const { gap } = this.resolvedProps;
            if (gap == null) {
                return {};
            }
            return {
                '--VGroup-gap': String(gap) === '0' ? '0px' : `var(--sp${gap})`,
            };
        },

    },

};
</script>

<style scoped>
@layer nightshade-components {

    .VGroup {
        --VGroup-gap: var(--sp2);

        display: flex;
        gap: var(--VGroup-gap);
        flex-flow: column nowrap;
    }

    .VGroup-align-stretch { align-items: stretch; }
    .VGroup-align-baseline { align-items: baseline; }
    .VGroup-align-center { align-items: center; }
    .VGroup-align-start { align-items: flex-start; }
    .VGroup-align-end { align-items: flex-end; }

    .VGroup-justify-center { justify-content: center; }
    .VGroup-justify-start { justify-content: flex-start; }
    .VGroup-justify-end { justify-content: flex-end; }
    .VGroup-justify-space-around { justify-content: space-around; }
    .VGroup-justify-space-between { justify-content: space-between; }
    .VGroup-justify-space-evenly { justify-content: space-evenly; }

}
</style>
