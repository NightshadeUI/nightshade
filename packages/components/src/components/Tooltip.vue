<template>
    <ContextPopup
        v-if="shown"
        :dir="resolvedProps.dir"
        :align="resolvedProps.align"
        :anchorEl="anchor"
        :overlayEnabled="false"
        :overlayShown="false"
        @mouseenter="cancelHide"
        @mouseleave="scheduleHide"
        @hide="hide">
        <div
            :id="tooltipId"
            class="Tooltip"
            role="tooltip">
            <slot>
                <div
                    v-if="resolvedProps.title"
                    class="Title">
                    {{ resolvedProps.title }}
                </div>
                <div
                    v-if="resolvedProps.text"
                    class="Text">
                    {{ resolvedProps.text }}
                </div>
            </slot>
        </div>
    </ContextPopup>
</template>

<script>
import { nightshadeMixin } from '../helpers/props.js';
import ContextPopup from './ContextPopup.vue';

const SHOW_DELAY = 300;
const HIDE_DELAY = 100;

/**
 * Shows a bubble while its anchor is hovered or focused from the keyboard.
 * The anchor is the parent element, or `anchorEl` (which `v-tooltip` passes).
 * The pointer can cross from the anchor onto the bubble, so a bubble that opens under it stays open.
 */
export default {

    components: {
        ContextPopup,
    },

    mixins: [nightshadeMixin],

    props: {
        title: { type: String },
        text: { type: String },
        dir: { type: String, default: 'top' },
        align: { type: String, default: 'center' },
        anchorEl: { default: null },
    },

    data() {
        return {
            shown: false,
            anchor: null,
        };
    },

    computed: {

        tooltipId() {
            return `Tooltip-${this.$.uid}`;
        },

        hasContent() {
            return Boolean(this.$slots.default || this.resolvedProps.title || this.resolvedProps.text);
        },

    },

    created() {
        this.showTimer = null;
        this.hideTimer = null;
        this.anchorTitle = null;
    },

    mounted() {
        this.anchor = this.resolvedProps.anchorEl ?? this.$el.parentElement;
        this.anchor.addEventListener('pointerenter', this.onPointerEnter);
        this.anchor.addEventListener('pointerleave', this.scheduleHide);
        this.anchor.addEventListener('pointerdown', this.hide);
        this.anchor.addEventListener('focusin', this.onFocusIn);
        this.anchor.addEventListener('focusout', this.hide);
    },

    beforeUnmount() {
        this.hide();
        this.anchor.removeEventListener('pointerenter', this.onPointerEnter);
        this.anchor.removeEventListener('pointerleave', this.scheduleHide);
        this.anchor.removeEventListener('pointerdown', this.hide);
        this.anchor.removeEventListener('focusin', this.onFocusIn);
        this.anchor.removeEventListener('focusout', this.hide);
    },

    methods: {

        show() {
            clearTimeout(this.showTimer);
            this.cancelHide();
            if (this.shown || !this.hasContent) {
                return;
            }
            // The native title would show a second tooltip
            this.anchorTitle = this.anchor.getAttribute('title');
            this.anchor.removeAttribute('title');
            this.anchor.setAttribute('aria-describedby', this.tooltipId);
            window.addEventListener('scroll', this.hide, { capture: true, passive: true });
            this.shown = true;
        },

        hide() {
            clearTimeout(this.showTimer);
            this.cancelHide();
            if (!this.shown) {
                return;
            }
            if (this.anchorTitle != null) {
                this.anchor.setAttribute('title', this.anchorTitle);
            }
            this.anchor.removeAttribute('aria-describedby');
            window.removeEventListener('scroll', this.hide, { capture: true });
            this.shown = false;
        },

        scheduleHide() {
            clearTimeout(this.showTimer);
            clearTimeout(this.hideTimer);
            this.hideTimer = setTimeout(() => this.hide(), HIDE_DELAY);
        },

        cancelHide() {
            clearTimeout(this.hideTimer);
        },

        onPointerEnter(ev) {
            if (ev.pointerType !== 'mouse') {
                return;
            }
            this.cancelHide();
            if (this.shown) {
                return;
            }
            clearTimeout(this.showTimer);
            this.showTimer = setTimeout(() => this.show(), SHOW_DELAY);
        },

        onFocusIn(ev) {
            if (ev.target.matches(':focus-visible')) {
                this.show();
            }
        },

    },

};
</script>

<style scoped>
.Tooltip {
    --Tooltip-padding: var(--sp1) var(--sp1-5);
    --Tooltip-gap: var(--sp0-5);
    --Tooltip-width: var(--sp40);
    --Tooltip-title: var(--text-base);
    --Tooltip-text: var(--text-subtle);

    display: flex;
    flex-flow: column;
    gap: var(--Tooltip-gap);
    width: max-content;
    max-width: var(--Tooltip-width);
    padding: var(--Tooltip-padding);

    font-size: var(--font-size-s);
}

.Title {
    font-weight: var(--font-weight-bold);
    color: var(--Tooltip-title);
}

.Text {
    color: var(--Tooltip-text);
}

/* A lone text is the whole message */
.Text:first-child {
    color: var(--Tooltip-title);
}
</style>
