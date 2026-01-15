<template>
    <component
        :is="tagName"
        class="InputBase"
        :class="[
            `InputBase-${effectiveStyle.kind}`,
            `input-kind-${effectiveStyle.kind}`,
            `InputBase-${effectiveStyle.size}`,
            {
                'InputBase-fixed-height': fixedHeight,
                'InputBase-flat': effectiveStyle.flat,
                'InputBase-round': effectiveStyle.round,
                'InputBase-disabled': disabled,
                'InputBase-force-focus': forceFocus,
                'InputBase-force-hover': forceHover,
            }
        ]"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @focusin="focus = true"
        @focusout="focus = false">
        <template v-if="label">
            <Tab
                v-if="labelStyle === 'tab'"
                class="Label TabLabel"
                :label="label" />
            <div
                v-if="labelStyle === 'text'"
                class="Label TextLabel">
                {{ label }}
            </div>
            <div
                v-if="labelStyle === 'inline'"
                class="Label InlineLabel">
                <div class="InlineLabelText">
                    {{ label }}
                </div>
            </div>
        </template>
        <div class="InputElement Container">
            <slot />
        </div>
    </component>
</template>

<script>
import Tab from './Tab.vue';

export default {

    components: {
        Tab,
    },

    props: {
        tagName: { default: 'label' },
        kind: { type: String, default: 'base' },
        label: { type: String },
        labelStyle: { type: String, default: 'inline' },

        size: { type: String, default: 'normal' },
        fixedHeight: { type: Boolean, default: true },
        flat: { type: Boolean, default: false },
        round: { type: Boolean, default: false },

        disabled: { type: Boolean, default: false },
        forceFocus: { type: Boolean, default: false },
        forceHover: { type: Boolean, default: false },

        hoverOverrides: { type: Object },
        focusOverrides: { type: Object },
    },

    data() {
        return {
            hover: false,
            focus: false,
        };
    },

    computed: {

        baseStyle() {
            return {
                kind: this.kind,
                size: this.size,
                flat: this.flat,
                round: this.round,
                labelStyle: this.labelStyle,
            };
        },

        effectiveStyle() {
            const {
                baseStyle,
                hoverOverrides = {},
                focusOverrides = {},
                hover,
                focus,
                forceHover,
                forceFocus
            } = this;
            const style = Object.assign({}, baseStyle);
            if (hover || forceHover) {
                Object.assign(style, hoverOverrides);
            }
            if (focus || forceFocus) {
                Object.assign(style, focusOverrides);
            }
            return style;
        },
    }

};
</script>

<style scoped>
.InputBase {
    --InputBase-size: var(--input-size);
    --InputBase-padding: var(--sp1-5);
    --InputBase-gap: var(--sp);
    --InputBase-font-size: var(--font-size);

    --InputBase-text-color: var(--text-color);
    --InputBase-surface: var(--base-color);

    --InputBase-outline-color: transparent;
    --InputBase-outline-size: var(--input-outline-size);
    --InputBase-outline-offset: var(--input-outline-offset);

    --InputBase-border-size: var(--input-border-size);
    --InputBase-border-color: var(--input-border-color);
    --InputBase-radius: var(--input-radius);

    --InputBase-shadow-color: var(--shadow-color-light);
    --InputBase-shadow: 0 1px 5px -1px var(--InputBase-shadow-color) inset;

    --InputBase-label-color: var(--input-label-color);
    --InputBase-label-font-size: var(--font-size-s);
    --InputBase-tab-surface-color: var(--input-surface-color-top);
    --InputBase-tab-text-color: var(--input-surface-text-color);

    position: relative;
    display: flex;
    flex-flow: column nowrap;
    outline: 0;
    z-index: var(--input-z);
}

.Container {
    position: relative;
    z-index: 1;

    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: var(--InputBase-padding);
    gap: var(--InputBase-gap);
    width: 100%;
    min-height: var(--InputBase-size);

    color: var(--InputBase-text-color);
    background: var(--InputBase-surface);
    box-shadow: var(--InputBase-shadow);

    outline: var(--InputBase-outline-size) solid var(--InputBase-outline-color);
    outline-offset: var(--InputBase-outline-offset);

    border: var(--InputBase-border-size) solid var(--InputBase-border-color);
    border-radius: var(--InputBase-radius);

    font-size: var(--InputBase-font-size);

    transition: color .3s, outline .3s, border-radius .3s, filter .3s;
}

/* States */

.InputBase:not(.InputBase-disabled):focus-within, .InputBase.InputBase-force-focus {
    z-index: 10;
    --InputBase-outline-color: var(--input-focus-light-color);
    --InputBase-border-color: var(--input-focus-medium-color);
    --InputBase-label-color: var(--input-focus-medium-color);
}

.InputBase-disabled {
    --InputBase-surface: var(--color-base-100);
}

.InputBase-disabled .Container {
    opacity: .6;
    filter: saturate(40%);
    cursor: not-allowed;
}

/* Styles */

.InputBase-fixed-height .Container {
    height: var(--InputBase-size);
}

.InputBase-round {
    --InputBase-radius: var(--input-radius-round);
}

.InputBase-flat {
    --InputBase-shadow-color: none;
    --InputBase-shadow: none;
}

/* Sizes */

.InputBase-small {
    --InputBase-size: var(--input-size-s);
    --InputBase-font-size: var(--font-size-s);
    --InputBase-label-font-size: var(--font-size-xs);
    --InputBase-padding: var(--sp);
}

.InputBase-large {
    --InputBase-size: var(--input-size-l);
    --InputBase-font-size: var(--font-size-l);
    --InputBase-padding: var(--sp2);
}

/* Labels */

.Label {
    font-size: var(--InputBase-label-font-size);
    max-width: calc(100% - 2 * var(--sp2));
}

.Label.TabLabel {
    align-self: flex-start;
    position: relative;
    z-index: 0;
    margin: 0 var(--sp2);

    --Tab-surface: var(--InputBase-tab-surface-color);
    --Tab-color: var(--InputBase-tab-text-color);
    --Tab-size: calc(.75 * var(--InputBase-size));
    --Tab-cap-size: calc(.75 * var(--InputBase-size));
}

.Label.TextLabel {
    margin: 0 var(--InputBase-padding);
    line-height: 1.5;
    height: var(--sp3);

    color: var(--InputBase-text-color);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.Label.InlineLabel {
    position: absolute;
    top: calc(-1 * var(--InputBase-outline-size));
    left: 0;
    height: calc(var(--InputBase-border-size) + var(--InputBase-outline-size));
    z-index: 2;
    margin: 0 var(--InputBase-padding);
    padding: 0 2px;

    background: var(--InputBase-surface);
    user-select: none;
}

.InlineLabelText {
    color: var(--InputBase-label-color);
    transform: translateY(-50%);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
