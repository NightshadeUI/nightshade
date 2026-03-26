<template>
    <div
        v-if="hasSelection"
        class="Row">
        <Btn
            v-for="inline in inlineOptions"
            :key="inline.type"
            :label="inline.label || inline.type"
            size="s"
            flat
            :forceActive="activeInlineTypes.includes(inline.type)"
            @click="onInlineClick(inline.type)" />
    </div>
</template>

<script>
import { Btn } from '@nightshadeui/core/src';

export default {

    components: {
        Btn,
    },

    props: {
        controller: { type: Object, required: true },
        hasSelection: { type: Boolean, default: false },
        activeInlineTypes: { type: Array, default: () => [] },
    },

    computed: {
        inlineOptions() {
            return this.controller.getOptions().inlines || [];
        },
    },

    methods: {
        onInlineClick(type) {
            this.controller.applyInlineType(type);
        },
    },
};
</script>

<style scoped>
.Row {
    display: inline-flex;
    align-items: center;
    gap: var(--sp0-5);
}
</style>
