<template>
    <ModalOverlay
        :overlayEnabled="resolvedProps.overlayEnabled"
        :overlayShown="resolvedProps.overlayShown"
        @hide="hide">
        <Bubble
            v-if="ready"
            :dir="actualDir"
            :align="actualAlign"
            :style="bubbleStyle"
            :arrowShown="resolvedProps.arrowShown"
            @mouseenter="$emit('mouseenter')"
            @mouseleave="$emit('mouseleave')"
            @click.stop="">
            <slot />
        </Bubble>
    </ModalOverlay>
</template>

<script>
import { nightshadeMixin } from '../utils/props';
import ModalOverlay from './ModalOverlay.vue';

export default {

    components: {
        ModalOverlay,
    },

    mixins: [nightshadeMixin],

    props: {
        dir: { type: String, default: 'v' },
        align: { type: String, default: 'auto' },
        anchorRef: { type: String },
        anchorDir: { type: String, default: 'middle' },
        overlayEnabled: { type: Boolean, default: true },
        overlayShown: { type: Boolean, default: true },
        arrowShown: { type: Boolean, default: true },
    },

    emits: ['hide', 'mouseenter', 'mouseleave', 'ready'],

    data() {
        return {
            pos: { x: 0, y: 0 },
            actualDir: 'bottom',
            actualAlign: 'start',
            ready: false,
        };
    },

    computed: {

        bubbleStyle() {
            const { x, y } = this.pos;
            return {
                left: `${x}px`,
                top: `${y}px`,
                'pointer-events': 'auto',
            };
        },

    },

    mounted() {
        this.$nextTick(() => this.calcPos());
        window.addEventListener('resize', this.onResize);
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.onResize);
    },

    methods: {

        hide() {
            this.$emit('hide');
        },

        calcPos() {
            const anchorEl = this.getAnchorEl();
            if (!anchorEl) {
                return;
            }
            this.pos = this.getAnchorPoint(anchorEl, this.resolvedProps.anchorDir);
            this.calcDirAlign();
            this.ready = true;
            this.$nextTick(() => this.$emit('ready'));
        },

        calcDirAlign() {
            const atTop = this.pos.y < window.innerHeight * 0.5;
            const atLeft = this.pos.x < window.innerWidth * 0.5;
            const { align, dir } = this.resolvedProps;
            if (align === 'auto') {
                const verticalDir = ['top', 'bottom', 'v'].includes(dir);
                if (verticalDir) {
                    this.actualAlign = atLeft ? 'start' : 'end';
                } else {
                    this.actualAlign = atTop ? 'start' : 'end';
                }
            } else {
                this.actualAlign = align;
            }
            if (dir === 'v') {
                this.actualDir = atTop ? 'bottom' : 'top';
            } else if (dir === 'h') {
                this.actualDir = atLeft ? 'right' : 'left';
            } else {
                this.actualDir = dir;
            }
        },

        getAnchorEl() {
            if (this.resolvedProps.anchorRef) {
                const ref = this.findRef(this.$parent, this.resolvedProps.anchorRef);
                if (ref) {
                    return ref;
                }
            }
            return this.$el.parentElement;
        },

        findRef(component, refKey) {
            if (!component) {
                return null;
            }
            const ref = component.$refs[refKey];
            if (ref) {
                const el = ref.$el ?? ref;
                if (el instanceof HTMLElement) {
                    return el;
                }
            }
            if (component.$parent) {
                return this.findRef(component.$parent, refKey);
            }
            return null;
        },

        getAnchorPoint(el, dir) {
            const { top, left, width, height } = el.getBoundingClientRect();
            switch (dir) {
                case 'left':
                    return { x: left, y: top + height * 0.5 };
                case 'right':
                    return { x: left + width, y: top + height * 0.5 };
                case 'top':
                    return { x: left + width * 0.5, y: top };
                case 'bottom':
                    return { x: left + width * 0.5, y: top + height };
                case 'middle':
                default:
                    return { x: left + width * 0.5, y: top + height * 0.5 };
            }
        },

        onResize() {
            this.calcPos();
        },

    },

};
</script>
