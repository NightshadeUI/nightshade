<template>
    <ContextPopup
        ref="popup"
        v-bind="contextPopupProps"
        @hide="$emit('hide')"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave')"
        @ready="$emit('ready')">
        <BaseMenu
            class="ContextMenu"
            v-bind="{ ...baseMenuProps, ...$attrs }"
            @activate="onActivate" />
    </ContextPopup>
</template>

<script>
import { collectProps } from '../utils/props';
import BaseMenu from './BaseMenu.vue';
import ContextPopup from './ContextPopup.vue';

export default {

    components: {
        ContextPopup,
        BaseMenu,
    },

    inheritAttrs: false,

    props: {
        ...ContextPopup.props,
        ...BaseMenu.props,
        autoFocus: { type: Boolean, default: true },
    },

    emits: [
        ...(ContextPopup.emits || []),
        ...(BaseMenu.emits || []),
    ],

    computed: {

        contextPopupProps() {
            return collectProps(this, ContextPopup);
        },

        baseMenuProps() {
            return collectProps(this, BaseMenu);
        }

    },

    methods: {

        hide() {
            this.$refs.popup?.hide();
        },

        onActivate(item, ev) {
            this.$emit('activate', item, ev);
        }

    }

};
</script>
