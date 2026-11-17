<template>
    <label
        class="Checkbox InputElement"
        :class="[
            effectiveStyle.tone && `tone-${effectiveStyle.tone}`,
            effectiveStyle.size && `input-size-${effectiveStyle.size}`,
            `Checkbox-mark-${resolvedProps.mark}`,
            {
                'Checkbox-active': !!resolvedProps.modelValue,
                'Checkbox-outline': effectiveStyle.outline,
                'Checkbox-round': effectiveStyle.round,
                'Checkbox-flat': effectiveStyle.flat,
                'Checkbox-disabled': resolvedProps.disabled,
                'Checkbox-forceFocus': resolvedProps.forceFocus,
                'Checkbox-forceHover': resolvedProps.forceHover,
            }
        ]"
        :tabindex="resolvedProps.disabled ? -1 : 0"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
        @focusin="focus = true"
        @focusout="focus = false">
        <slot v-if="resolvedProps.modelValue" name="active">
            <component
                :is="markComponent"
                v-if="markComponent"
                class="Mark MarkGlyph" />
            <div
                v-else
                class="Mark" />
        </slot>
        <slot v-if="!resolvedProps.modelValue" name="inactive" />
        <input
            type="checkbox"
            :checked="resolvedProps.modelValue"
            :disabled="resolvedProps.disabled"
            @change="onChange" />
    </label>
</template>

<script>
import {
    GlyphCheck,
    GlyphXmark,
} from '../glyphs/index.js';
import {
    nightshadeMixin,
} from '../helpers/props.js';

export default {

    mixins: [nightshadeMixin],

    props: {
        mark: { type: String, default: 'check' },
        modelValue: { type: Boolean },
        disabled: { type: Boolean },
        tone: { type: String },
        activeTone: { type: String },
        size: { type: String },
        round: { type: Boolean, default: false },
        flat: { type: Boolean, default: false },
        outline: { type: Boolean, default: false },
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

        markComponent() {
            if (this.resolvedProps.mark === 'check') {
                return GlyphCheck;
            }
            if (this.resolvedProps.mark === 'xmark') {
                return GlyphXmark;
            }
            return null;
        },

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

    .Checkbox {
        --Checkbox-size: var(--input-minor-height);

        --Checkbox-outline: transparent;

        --Checkbox-background: var(--surface-deep);

        --Checkbox-border-size: 0px;
        --Checkbox-border: transparent;
        --Checkbox-radius: var(--radius-m);

        --Checkbox-box-shadow: 0 1px 3px var(--Checkbox-shadow) inset, 0 0 5px -1px var(--Checkbox-shadow) inset;
        --Checkbox-shadow: var(--shadow-light);
        --Checkbox-mark-text-shadow: 0 1px 1px var(--text-shadow-auto);

        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: var(--Checkbox-size);
        height: var(--Checkbox-size);
        overflow: hidden;

        border: var(--Checkbox-border-size) solid var(--Checkbox-border);
        border-radius: var(--Checkbox-radius);

        background: var(--Checkbox-background);
        outline: var(--input-outline-size) solid var(--Checkbox-outline);
        outline-offset: var(--input-outline-offset);
        background-clip: border-box;

        font-size: var(--Checkbox-size);
        color: var(--tone-fill-text);
        text-shadow: var(--Checkbox-mark-text-shadow);
        box-shadow: var(--Checkbox-box-shadow);

        cursor: pointer;
        user-select: none;

        transition: background-color .3s, border-radius .3s;
    }

    .Checkbox input {
        display: none;
    }

    .Mark {
        opacity: 0;

        transition: opacity .1s, border-radius .3s;
    }

    .MarkGlyph {
        width: var(--Checkbox-size);
        height: var(--Checkbox-size);
    }

    .Checkbox-active .Mark {
        opacity: 1;
    }

    /* Marks */

    .Checkbox-mark-dot .Mark::after {
        content: '●';
    }

    .Checkbox-mark-knob .Mark {
        content: '';
        width: calc(var(--Checkbox-size) - var(--sp));
        height: calc(var(--Checkbox-size) - var(--sp));
        border-radius: calc(var(--Checkbox-radius) - 2px);
        background: var(--tone-fill-text);
        box-shadow: 0 1px 2px var(--Checkbox-shadow);
    }

    /* States */

    .Checkbox-disabled {
        cursor: not-allowed;
        opacity: var(--input-disabled-opacity);
        filter: var(--input-disabled-filter);
    }

    .Checkbox:not(.Checkbox-disabled):hover, .Checkbox.Checkbox-forceHover {
        filter: var(--input-hover-filter);
    }

    .Checkbox:not(.Checkbox-disabled):focus-visible, .Checkbox.Checkbox-forceFocus {
        z-index: 10;
        --Checkbox-outline: var(--tone-focus-outline);
        --Checkbox-border: var(--tone-focus-border);
    }

    .Checkbox-active {
        --Checkbox-background: var(--tone-fill);
    }

    /* Styles */

    .Checkbox-round {
        --Checkbox-radius: calc(.5 * var(--Checkbox-size));
    }

    .Checkbox-outline {
        --Checkbox-border: var(--tone-border);
        --Checkbox-border-size: var(--input-border-size);
    }

    .Checkbox-flat {
        --Checkbox-box-shadow: none;
        --Checkbox-shadow: transparent;
        --Checkbox-mark-text-shadow: none;
    }

}
</style>
