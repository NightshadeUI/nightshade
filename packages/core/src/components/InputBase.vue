<template>
    <component
        :is="tagName"
        class="InputBase"
        :class="[
            `ui-${effectiveStyle.kind}`,
            `input-size-${effectiveStyle.size}`,
            {
                'InputBase-fixedHeight': fixedHeight,
                'InputBase-flat': effectiveStyle.flat,
                'InputBase-round': effectiveStyle.round,
                'InputBase-disabled': disabled,
                'InputBase-forceFocus': forceFocus,
                'InputBase-forceHover': forceHover,
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
                {{ label }}
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

        size: { type: String, default: 'm' },
        fixedHeight: { type: Boolean, default: true },
        flat: { type: Boolean, default: false },
        round: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },

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
    --InputBase-size: var(--input-height);
    --InputBase-padding-x: var(--input-padding-md);
    --InputBase-padding-y: var(--input-padding-sm);
    --InputBase-gap: var(--input-gap);
    --InputBase-font-size: var(--input-font-size);

    --InputBase-text-color: var(--text-color);
    --InputBase-surface: var(--base-color);

    --InputBase-outline-color: transparent;
    --InputBase-outline-size: var(--input-outline-size);
    --InputBase-outline-offset: var(--input-outline-offset);

    --InputBase-border-size: var(--input-border-size);
    --InputBase-border-color: var(--ui-border-color);
    --InputBase-radius: var(--input-radius);

    --InputBase-shadow-color: var(--shadow-color-light);
    --InputBase-shadow: 0 1px 5px -1px var(--InputBase-shadow-color) inset;

    --InputBase-label-color: var(--ui-label-color);
    --InputBase-label-font-size: var(--font-size-s);
    --InputBase-tab-size: var(--sp3);
    --InputBase-tab-surface-color: var(--ui-surface-top-color);
    --InputBase-tab-text-color: var(--ui-surface-text-color);

    position: relative;
    display: flex;
    flex-flow: column nowrap;
    outline: 0;
    z-index: var(--ui-z);
}

.Container {
    position: relative;
    z-index: 1;

    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: var(--InputBase-padding-y) var(--InputBase-padding-x);
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

.InputBase:not(.InputBase-disabled):focus-within, .InputBase.InputBase-forceFocus {
    z-index: 10;
    --InputBase-outline-color: var(--ui-focus-light-color);
    --InputBase-border-color: var(--ui-focus-medium-color);
    --InputBase-label-color: var(--ui-focus-medium-color);
}

.InputBase-disabled {
    --InputBase-surface: var(--color-base-100);
}

.InputBase-disabled .Container {
    opacity: .6;
    filter: saturate(50%);
    cursor: not-allowed;
}

/* Styles */

.InputBase-fixedHeight .Container {
    height: var(--InputBase-size);
}

.InputBase-round {
    --InputBase-radius: var(--input-radius-round);
}

.InputBase-flat {
    --InputBase-shadow-color: none;
    --InputBase-shadow: none;
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
    --Tab-size: var(--InputBase-tab-size);
    --Tab-cap-size: var(--InputBase-tab-cap-size);
}

.Label.TextLabel {
    margin: 0 var(--InputBase-padding-x);
    line-height: 1.5;
    height: var(--sp3);

    color: var(--InputBase-text-color);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.Label.InlineLabel {
    position: absolute;
    top: -2px;
    left: 0;
    transform: translateY(-50%);
    height: var(--sp2);
    line-height: var(--sp2);
    border-radius: var(--input-radius);
    z-index: 2;
    margin: 0 var(--InputBase-padding-x);
    padding: 0 2px;

    color: var(--InputBase-label-color);
    text-shadow:
        0 0 3px var(--InputBase-surface),
        0 0 3px var(--InputBase-surface),
        0 0 3px var(--InputBase-surface),
        0 0 3px var(--InputBase-surface),
        0 0 3px var(--InputBase-surface),
        0 0 3px var(--InputBase-surface),
        0 0 3px var(--InputBase-surface),
        0 0 3px var(--InputBase-surface),
        0 0 3px var(--InputBase-surface),
        0 0 3px var(--InputBase-surface);

    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
