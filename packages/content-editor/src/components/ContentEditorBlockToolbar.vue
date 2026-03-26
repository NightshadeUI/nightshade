<template>
    <div class="Row">
        <Btn
            ref="blockButton"
            :label="activeBlockLabel"
            size="s"
            flat
            @click="toggleBlockMenu()" />
        <ContextMenu
            v-if="blockMenuShown"
            anchorRef="blockButton"
            dir="bottom"
            anchorDir="bottom"
            :overlayEnabled="false"
            :overlayShown="false"
            :arrowShown="false"
            :items="blockMenuItems"
            @hide="hideBlockMenu()"
            @activate="onBlockActivate" />
    </div>
</template>

<script>
import { Btn, ContextMenu } from '@nightshadeui/core/src';

export default {

    components: {
        Btn,
        ContextMenu,
    },

    props: {
        controller: { type: Object, required: true },
        activeBlockType: { type: String, default: null },
    },

    data() {
        return {
            blockMenuShown: false,
        };
    },

    computed: {
        blockOptions() {
            return this.controller.getOptions().blocks;
        },

        activeBlockLabel() {
            const activeBlock = this.blockOptions.find(item => item.type === this.activeBlockType);
            return activeBlock?.label || activeBlock?.type || 'Block';
        },

        blockMenuItems() {
            return this.blockOptions.map(item => ({
                title: item.label || item.type,
                value: item.type,
                checked: item.type === this.activeBlockType,
            }));
        },
    },

    methods: {
        toggleBlockMenu() {
            this.blockMenuShown = !this.blockMenuShown;
        },

        hideBlockMenu() {
            this.blockMenuShown = false;
        },

        onBlockActivate(item) {
            if (item?.value) {
                this.controller.applyBlockType(item.value);
            }
            this.hideBlockMenu();
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
