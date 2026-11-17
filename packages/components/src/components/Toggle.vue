<template>
    <label
        class="Toggle InputElement"
        :class="[
            effectiveStyle.tone && `tone-${effectiveStyle.tone}`,
            effectiveStyle.size && `input-size-${effectiveStyle.size}`,
            {
                'Toggle-active': !!modelValue,
                'Toggle-outline': effectiveStyle.outline,
                'Toggle-round': effectiveStyle.round,
                'Toggle-flat': effectiveStyle.flat,
                'Toggle-translucent': effectiveStyle.translucent,
                'Toggle-disabled': resolvedProps.disabled,
                'Toggle-forceFocus': resolvedProps.forceFocus,
                'Toggle-forceHover': resolvedProps.forceHover,
            }
        ]"
        :tabindex="resolvedProps.disabled ? -1 : 0"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @focusin="focus = true"
        @focusout="focus = false">
        <input
            type="checkbox"
            :checked="resolvedProps.modelValue"
            :disabled="resolvedProps.disabled"
            @change="onChange" />
    </label>
</template>

<script>
import {
    nightshadeMixin,
} from '../helpers/props.js';

export default {

    mixins: [nightshadeMixin],

    props: {
        modelValue: { type: Boolean },
        disabled: { type: Boolean },
        tone: { type: String },
        activeTone: { type: String },
        size: { type: String },
        round: { type: Boolean, default: false },
        flat: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
        translucent: { type: Boolean, default: false },
        forceFocus: { type: Boolean, default: false },
        forceHover: { type: Boolean, default: false },
        focusOverrides: { type: Object },
        hoverOverrides: { type: Object },
    },

    emits: [
        'update:modelValue',
    ],

    data() {
        return {
            hover: false,
            focus: false,
        };
    },

    computed: {

        isActive() {
            return !!this.resolvedProps.modelValue;
        },

        baseStyle() {
            const { resolvedProps } = this;
            return {
                tone: (this.isActive ? resolvedProps.activeTone : resolvedProps.tone) ?? resolvedProps.tone,
                size: resolvedProps.size,
                round: resolvedProps.round,
                outline: resolvedProps.outline,
                flat: resolvedProps.flat,
                translucent: resolvedProps.translucent,
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

    },

    methods: {

        onChange(ev) {
            this.$emit('update:modelValue', ev.target.checked);
        }

    }

};
</script>

<style scoped>
/* Nightshade's order, stated wherever these styles load first. */
@layer nightshade, nightshade-docs, nightshade-components;

@layer nightshade-components {

    .Toggle {
        --Toggle-size: var(--input-minor-height);
        --Toggle-width: calc(1.618 * var(--Toggle-size));
        --Toggle-knob-offset: var(--input-minor-padding);
        --Toggle-knob-size: calc(var(--Toggle-size) - 2 * var(--Toggle-knob-offset));
        --Toggle-knob-radius: calc(var(--Toggle-radius) - 0.5 * var(--Toggle-knob-offset));

        --Toggle-outline: transparent;

        --Toggle-background: var(--surface-deep);
        --Toggle-knob-background: var(--surface-knob);
        --Toggle-knob-transparency: 0%;

        --Toggle-border-size: 0px;
        --Toggle-border: transparent;
        --Toggle-radius: var(--radius-m);

        --Toggle-box-shadow: 0 1px 3px var(--Toggle-shadow) inset, 0 0 5px -1px var(--Toggle-shadow) inset;
        --Toggle-shadow: var(--shadow-light);

        display: block;
        position: relative;
        width: var(--Toggle-width);
        height: var(--Toggle-size);

        border: var(--Toggle-border-size) solid var(--Toggle-border);
        border-radius: var(--Toggle-radius);

        background: var(--Toggle-background);
        outline: var(--input-outline-size) solid var(--Toggle-outline);
        outline-offset: var(--input-outline-offset);
        background-clip: border-box;
        box-shadow: var(--Toggle-box-shadow);

        cursor: pointer;
        user-select: none;

        transition: background-color .3s, border-radius .3s;
    }

    .Toggle input {
        display: none;
    }

    .Toggle::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: var(--Toggle-knob-size);
        height: var(--Toggle-knob-size);
        border-radius: var(--Toggle-knob-radius);
        background: color-mix(in srgb, var(--Toggle-knob-background), transparent var(--Toggle-knob-transparency));
        box-shadow: 0 1px 3px var(--Toggle-shadow), 0 1px 5px var(--Toggle-shadow);

        transform: translate(var(--Toggle-knob-offset), -50%);
        transition: transform .3s, border-radius .3s;
    }

    /* States */

    .Toggle-disabled {
        cursor: not-allowed;
        opacity: var(--input-disabled-opacity);
        filter: var(--input-disabled-filter);
    }

    .Toggle:not(.Toggle-disabled):hover, .Toggle.Toggle-forceHover {
        filter: var(--input-hover-filter);
    }

    .Toggle:not(.Toggle-disabled):focus-visible, .Toggle.Toggle-forceFocus {
        z-index: 10;
        --Toggle-outline: var(--tone-focus-outline);
        --Toggle-border: var(--tone-focus-border);
    }

    .Toggle-active {
        --Toggle-background: var(--tone-fill);
        --Toggle-knob-background: var(--tone-fill-text);
    }

    .Toggle-active::before {
        transform: translate(
            calc(
                var(--Toggle-width) -
                var(--Toggle-knob-size) -
                var(--Toggle-knob-offset)
            ), -50%);
    }

    /* Styles */

    .Toggle-round {
        --Toggle-radius: calc(.5 * var(--Toggle-size));
    }

    .Toggle-outline {
        --Toggle-border: var(--tone-border);
        --Toggle-border-size: var(--input-border-size);
    }

    .Toggle-flat {
        --Toggle-shadow: transparent;
        --Toggle-box-shadow: none;
    }

    .Toggle-translucent {
        --Toggle-knob-transparency: var(--translucency-mix-medium);
    }

    .Toggle-translucent::before {
        box-shadow:
            0 0 2px var(--shadow-medium),
            0 1px 5px var(--Toggle-shadow),
            0 0 3px var(--translucency-highlight) inset;
        backdrop-filter: blur(var(--translucency-blur));
    }

}
</style>
