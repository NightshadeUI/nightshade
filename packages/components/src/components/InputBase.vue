<template>
    <component
        :is="resolvedProps.tagName"
        class="InputBase"
        :class="[
            effectiveStyle.tone && `tone-${effectiveStyle.tone}`,
            effectiveStyle.size && `input-size-${effectiveStyle.size}`,
            {
                'InputBase-fixedHeight': resolvedProps.fixedHeight,
                'InputBase-flat': effectiveStyle.flat,
                'InputBase-round': effectiveStyle.round,
                'InputBase-disabled': resolvedProps.disabled,
                'InputBase-forceFocus': resolvedProps.forceFocus,
                'InputBase-forceHover': resolvedProps.forceHover,
            }
        ]"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @focusin="focus = true"
        @focusout="focus = false">
        <template v-if="resolvedProps.label">
            <Tab
                v-if="resolvedProps.labelStyle === 'tab'"
                class="Label TabLabel"
                :label="resolvedProps.label"
                :tone="effectiveStyle.tone" />
            <div
                v-if="resolvedProps.labelStyle === 'text'"
                class="Label TextLabel">
                {{ resolvedProps.label }}
            </div>
            <div
                v-if="resolvedProps.labelStyle === 'inline'"
                class="Label InlineLabel">
                {{ resolvedProps.label }}
            </div>
        </template>
        <div class="InputElement Container">
            <slot />
        </div>
    </component>
</template>

<script>
import {
    nightshadeMixin,
} from '../helpers/props.js';
import Tab from './Tab.vue';

export default {

    components: {
        Tab,
    },

    mixins: [nightshadeMixin],

    props: {
        tagName: { default: 'label' },
        tone: { type: String },
        label: { type: String },
        labelStyle: { type: String, default: 'inline' },

        size: { type: String },
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
            const { resolvedProps } = this;
            return {
                tone: resolvedProps.tone,
                size: resolvedProps.size,
                flat: resolvedProps.flat,
                round: resolvedProps.round,
                outline: resolvedProps.outline,
                labelStyle: resolvedProps.labelStyle,
            };
        },

        effectiveStyle() {
            const {
                baseStyle,
                hoverOverrides = {},
                focusOverrides = {},
                hover,
                focus,
                resolvedProps,
            } = this;
            const { forceHover, forceFocus } = resolvedProps;
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
/* The order, stated wherever these styles load first: the styles, then the components */
@layer nightshade, nightshade-components;

@layer nightshade-components {

    .InputBase {
        --InputBase-size: var(--input-major-height);
        --InputBase-padding-x: var(--input-major-padding);
        --InputBase-padding-y: var(--input-minor-padding);
        --InputBase-gap: var(--input-gap);
        --InputBase-font-size: var(--input-font-size);

        --InputBase-text: var(--text-base);
        --InputBase-background: var(--surface-base);

        --InputBase-outline: transparent;
        --InputBase-outline-size: var(--input-outline-size);
        --InputBase-outline-offset: var(--input-outline-offset);

        --InputBase-border-size: var(--input-border-size);
        --InputBase-border: var(--tone-border);
        --InputBase-radius: var(--radius-m);

        --InputBase-shadow: var(--shadow-light);
        --InputBase-box-shadow: 0 1px 5px -1px var(--InputBase-shadow) inset;

        --InputBase-label-text: var(--text-base);
        --InputBase-label-font-size: var(--font-size-s);

        position: relative;
        display: flex;
        flex-flow: column nowrap;
        outline: 0;
    }

    .Container {
        position: relative;
        z-index: 1;

        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding:
            calc(var(--InputBase-padding-y) - var(--InputBase-border-size))
            calc(var(--InputBase-padding-x) - var(--InputBase-border-size));
        gap: var(--InputBase-gap);
        width: 100%;
        min-height: var(--InputBase-size);

        color: var(--InputBase-text);
        background: var(--InputBase-background);
        box-shadow: var(--InputBase-box-shadow);

        outline: var(--InputBase-outline-size) solid var(--InputBase-outline);
        outline-offset: var(--InputBase-outline-offset);

        border: var(--InputBase-border-size) solid var(--InputBase-border);
        border-radius: var(--InputBase-radius);

        font-size: var(--InputBase-font-size);

        transition: color .3s, outline .3s, border-radius .3s, filter .3s;
    }

    /* States */

    .InputBase:not(.InputBase-disabled):focus-within, .InputBase.InputBase-forceFocus {
        z-index: 10;
        --InputBase-outline: var(--tone-focus-outline);
        --InputBase-border: var(--tone-focus-border);
        --InputBase-label-text: var(--tone-focus-border);
    }

    .InputBase-disabled {
        --InputBase-background: var(--surface-deep);
    }

    .InputBase-disabled .Container {
        opacity: var(--input-disabled-opacity);
        filter: var(--input-disabled-filter);
        cursor: not-allowed;
    }

    /* Styles */

    .InputBase-fixedHeight .Container {
        height: var(--InputBase-size);
    }

    .InputBase-round {
        --InputBase-radius: calc(.5 * var(--InputBase-size));
    }

    .InputBase-flat {
        --InputBase-box-shadow: none;
    }

    /* Labels */

    .Label {
        max-width: calc(100% - 2 * var(--sp2));
    }

    .Label.TabLabel {
        align-self: flex-start;
        position: relative;
        z-index: 0;
        margin: 0 var(--sp2);

        --Tab-size: calc(.75 * var(--InputBase-size));
        --Tab-cap-size: calc(.75 * var(--InputBase-size));
        --Tab-font-size: var(--InputBase-font-size);
    }

    .Label.TextLabel {
        margin: 0 var(--InputBase-padding-x);
        height: var(--sp3);
        line-height: 1.5;
        font-size: var(--InputBase-label-font-size);

        color: var(--InputBase-text);

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .Label.InlineLabel {
        position: absolute;
        z-index: 2;
        top: -2px;
        left: -2px;
        margin: 0 var(--InputBase-padding-x);
        padding: 0 2px;
        transform: translateY(-50%);
        height: var(--sp2);
        line-height: var(--sp2);

        font-size: var(--InputBase-label-font-size);
        border-radius: var(--radius-m);

        color: var(--InputBase-label-text);
        text-shadow:
            0 0 3px var(--InputBase-background),
            0 0 3px var(--InputBase-background),
            0 0 3px var(--InputBase-background),
            0 0 3px var(--InputBase-background),
            0 0 3px var(--InputBase-background),
            0 0 3px var(--InputBase-background),
            0 0 3px var(--InputBase-background),
            0 0 3px var(--InputBase-background),
            0 0 3px var(--InputBase-background),
            0 0 3px var(--InputBase-background);

        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

}
</style>
