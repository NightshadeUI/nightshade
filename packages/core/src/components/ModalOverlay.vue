<template>
    <teleport to="#overlays">
        <div
            class="ModalOverlay"
            :class="{
                'ModalOverlay-enabled': resolvedProps.overlayEnabled,
                'ModalOverlay-shown': resolvedProps.overlayShown,
            }"
            @click.stop="hide">
            <slot />
        </div>
    </teleport>
</template>

<script>
import { nightshadeMixin } from '../utils/props';

export default {

    mixins: [nightshadeMixin],

    props: {
        overlayEnabled: { type: Boolean, default: true },
        overlayShown: { type: Boolean, default: true },
    },

    emits: ['hide'],

    mounted() {
        window.addEventListener('keydown', this.onKeyDown);
    },

    beforeUnmount() {
        window.removeEventListener('keydown', this.onKeyDown);
    },

    methods: {

        hide() {
            this.$emit('hide');
        },

        onKeyDown(ev) {
            if (ev.key === 'Escape') {
                ev.preventDefault();
                this.hide();
            }
        },

    },

};
</script>

<style scoped>
.ModalOverlay {
    --ModalOverlay-surface: var(--overlay-surface);

    position: fixed;
    z-index: 2000;
    inset: 0;
    pointer-events: none;
}

.ModalOverlay-enabled {
    pointer-events: auto;
    overscroll-behavior: none;
    overflow: auto;
}

.ModalOverlay-shown {
    background: var(--ModalOverlay-surface);
}
</style>
